import Message from "../models/message.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { getReceiverSocketId, io } from "../socket.js";
import cloudinary from "../config/cloudinary.js"; 
import multer from 'multer';
import fs from 'fs';

export const getUsers = async (req, res) => {
    try {
        const loggedUser = req.userId;
        const users = await User.find({ _id: { $ne: loggedUser } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res) => {
    const { id } = req.params;
    try {
        const myId = req.userId;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { receiverId: myId, senderId: id }
            ]
        }).sort({ createdAt: 1 }); 
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        let imageUrl = '';

        
        if (image) {
           
            if (image.startsWith('data:')) {
                try {
                    console.log('Uploading media to Cloudinary...');
                    
                    const result = await cloudinary.uploader.upload(image, {
                        folder: 'PIXLY_messages',
                        resource_type: 'auto' // Automatically detect if it's image or video
                    });
                    
                    imageUrl = result.secure_url;
                    console.log('Cloudinary upload successful:', imageUrl);
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError);
                    return res.status(500).json({ message: 'Failed to upload media' });
                }
            } else {
                
                imageUrl = image;
            }
        }

        const { id: receiverId } = req.params;
        const senderId = req.userId;
        
        const message = new Message({
            text,
            image: imageUrl,
            senderId,
            receiverId
        });

        await message.save();

        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message);
        }

  
        try {
            const sender = await User.findById(senderId);
            const notification = new Notification({
                recipient: receiverId,
                sender: senderId,
                type: 'message',
                message: `You have a new message from ${sender.name}.`,
                contentId: message._id,
            });
            await notification.save();

          
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        } catch (error) {
            console.error("Error creating message notification:", error);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllMessages = async (req, res) => {
    try {
        const myId = req.userId;
     
        const messages = await Message.find({ 
            $or: [{ senderId: myId }, { receiverId: myId }] 
        }).sort({ createdAt: -1 }); 

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
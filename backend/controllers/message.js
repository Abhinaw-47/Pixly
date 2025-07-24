import Message from "../models/message.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { getReceiverSocketId, io } from "../socket.js";

export const getUsers=async(req,res)=>{
   
try {
   
    const loggedUser=req.userId;
    const users=await User.find({_id:{$ne:loggedUser}});
    res.status(200).json(users);

} catch (error) {
    res.status(500).json({message:error.message});
}
   
}

export const getMessages=async(req,res)=>{
    const {id}=req.params;
    try {
        
        const myId=req.userId;
        const messages=await Message.find({$or:[{senderId:myId,receiverId:id},{receiverId:myId,senderId:id}]});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const sendMessage=async(req,res)=>{

    try {
     const {text,image}=req.body;
    
     let imageUrl;
     if(image){
        imageUrl=image;
     }
    const {id:receiverId}=req.params;
    const senderId=req.userId;
    const message=new Message({text,image:imageUrl,senderId,receiverId});

    await message.save();
        //real time functionality using sockets
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("receiveMessage",message);
         
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

            // Emit the notification event if the user is online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        } catch (error) {
            console.error("Error creating message notification:", error);
        }
       
        

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
export const getAllMessages = async (req, res) => {
    try {
        const myId = req.userId;
        // Find all messages where the user is involved
        const messages = await Message.find({ $or: [{ senderId: myId }, { receiverId: myId }] })
            .sort({ createdAt: -1 }); // Sort by most recent
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
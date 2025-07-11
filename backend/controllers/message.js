import Message from "../models/message.js";
import User from "../models/user.js";
import { getReceiverSocketId, io } from "../socket.js";

export const getUsers=async(req,res)=>{
   console.log(req.userId,"undefined is userId");
try {
    console.log("here")
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
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
import mongoose from "mongoose";
import express from "express";
import PostMessage from "../models/postMessage.js";
import Notification from "../models/notification.js";
import { getReceiverSocketId } from "../socket.js";
import User from "../models/user.js";


export const getPosts=async(req,res)=>{
   const {page}=req.query;

try {
   console.log(page);
   const LIMIT=5;
   const startIndex=(Number(page)-1)*LIMIT;
 
   const total=await PostMessage.countDocuments({});
   console.log(total);
    const post=await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    console.log(post);
    res.status(200).json({data:post,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
   
   //     const post=await PostMessage.find().sort({ _id: -1 })
    
   //  res.status(200).json({data:post,currentPage:1,numberOfPages:1});
} catch (error) {
 
    res.status(404).json({message:error.message});
    console.log(error);
}

}
export const getPostBySearch=async(req,res)=>{
   const {searchQuery}=req.query;
   
   try {
      const keyword=new RegExp(searchQuery,'i');
      const posts=await PostMessage.find({
         $or:[
            {title:{$regex:keyword}},
            {description:{ $regex:keyword}},
            {name:{ $regex:keyword}},
            {tags:{ $regex:keyword}}
         ]
   });
   
      res.json({data:posts});
      
   } catch (error) {
      res.status(404).json({message:error.message});
   }
}
export const getProfile=async(req,res)=>{
  const {profile}=req.params;
  
   try {
      const posts=await PostMessage.find({creator:profile});
      res.json({data:posts});
   } catch (error) {
      res.status(404).json({message:error.message});
   }
}

export const createPost=async(req,res)=>{
   // const post =req.body;
   //  const newPost=new PostMessage({...post,creator:req.userId});
   const{title,description,tags}=req.body;
   try {
      let imageUrl='';
      if(req.file){
         const result=await cloudinary.uploader.upload(req.file.path);
         imageUrl=result.secure_url;
      }
      const newPost=new PostMessage({
         title,
         description,
         tags,
         selectedFile:imageUrl,
         creator:req.userId
      })
    await newPost.save();
    res.status(201).json(newPost);
   } catch (error) {
    res.status(409).json({message:error.message});
   }
}

export const updatePost=async(req,res)=>{
   const{id:_id}=req.params;
   const{title,description,name,tags}=req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
   try {
      let imageUrl='';
      if(req.file){
         const result=await cloudinary.uploader.upload(req.file.path);
         imageUrl=result.secure_url;
      }else if(req.body.selectedFile){
         imageUrl=req.body.selectedFile;
      }
      const updatedPost={
         title,
         description,
         name,
         tags,
         selectedFile:imageUrl
      }
      await PostMessage.findByIdAndUpdate(_id,updatedPost,{new:true});
   res.json(updatedPost);

   } catch (error) {
       res.status(500).json({ message: 'Something went wrong during post update.' });
        console.log(error);
   }
   // const updatedPost={title,description,message,name,selectedFile,tags,_id};
  


}

export const deletePost=async(req,res)=>{
const {id}=req.params;

if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
await PostMessage.findByIdAndDelete(id);

res.json({message:'Post deleted successfully'});

}
export const likePost=async(req,res)=>{
   const{id}=req.params;
     
   if(!req.userId) return res.json({message:'Unauthenticated'});
   if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
   const post=await PostMessage.findById(id);
   const index=post.likes.findIndex((id)=>id===String(req.userId));
   if(index===-1){
       post.likes.push(req.userId);
   }
   else{
       post.likes=post.likes.filter((id)=>id!==String(req.userId));
   }

   const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true});
 try {
        // Only create a notification on a new "like", not an "unlike"
        // And don't notify the user if they like their own post
        if (index === -1 && post.creator !== req.userId) {
            const sender = await User.findById(req.userId);
            const notification = new Notification({
                recipient: post.creator, // The ID of the post author
                sender: req.userId,
                type: 'like',
                message: `${sender.name} liked your post.`,
                contentId: post._id,
            });
            await notification.save();

            // Emit a real-time event if the post author is online
            const receiverSocketId = getReceiverSocketId(post.creator);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }
    } catch (error) {
        console.error("Error creating like notification:", error);
    }

   res.json(updatedPost);


}
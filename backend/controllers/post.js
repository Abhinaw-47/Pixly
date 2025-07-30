import mongoose from "mongoose";
import express from "express";
import PostMessage from "../models/postMessage.js";
import Notification from "../models/notification.js";
import { getReceiverSocketId } from "../socket.js";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js"; 

export const getPosts = async (req, res) => {
   const { page } = req.query;

   try {
      console.log(page);
      const LIMIT = 10;
      const startIndex = (Number(page) - 1) * LIMIT;

      const total = await PostMessage.countDocuments({});
     
      const post = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
   
      res.status(200).json({ data: post, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
   } catch (error) {
      res.status(404).json({ message: error.message });
      console.log(error);
   }
}

export const getPostBySearch = async (req, res) => {
   const { searchQuery } = req.query;

   try {
      const keyword = new RegExp(searchQuery, 'i');
      const posts = await PostMessage.find({
         $or: [
            { title: { $regex: keyword } },
            { description: { $regex: keyword } },
            { name: { $regex: keyword } },
            { tags: { $regex: keyword } }
         ]
      });

      res.json({ data: posts });

   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

export const getProfile = async (req, res) => {
   const { profile } = req.params;

   try {
      const posts = await PostMessage.find({ creator: profile });
      res.json({ data: posts });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

export const getLikedPosts = async (req, res) => {
   try {
      if(!req.userId) return res.json({ message: 'Unauthenticated' });
      const likedPosts=await PostMessage.find({
         likes: { $in: [req.userId] }
      }).sort({ _id: -1 });
      res.json({ data: likedPosts });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

export const createPost = async (req, res) => {
   const { title, description, tags, name } = req.body;
   
   try {
      let imageUrl = '';
      
     
      if (req.file) {
         console.log('Uploading file to Cloudinary:', req.file.path);
         
         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'PIXLY_posts',
            resource_type: 'auto' 
         });
         
         imageUrl = result.secure_url;
         console.log('Cloudinary upload successful:', imageUrl);
      }
      

      let processedTags = [];
      if (tags) {
         if (typeof tags === 'string') {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
         } else if (Array.isArray(tags)) {
            processedTags = tags;
         }
      }
      
      const newPost = new PostMessage({
         title,
         description,
         tags: processedTags,
         name: name, 
         selectedFile: imageUrl,
         creator: req.userId
      });
      
      await newPost.save();
      console.log('Post created successfully:', newPost);
      res.status(201).json(newPost);
      // const populatedPost = await PostMessage.findById(newPost._id).populate('likes', 'name _id');
      // res.status(201).json(populatedPost);
      
   } catch (error) {
      console.error('Error creating post:', error);
      res.status(409).json({ message: error.message });
   }
}

export const updatePost = async (req, res) => {
   const { id: _id } = req.params;
   const { title, description, name, tags } = req.body;
   
   if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
   
   try {
      let imageUrl = '';
      
      
      if (req.file) {
         console.log('Uploading new file to Cloudinary:', req.file.path);
         
         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'PIXLY_posts',
            resource_type: 'auto'
         });
         
         imageUrl = result.secure_url;
         console.log('Cloudinary upload successful:', imageUrl);
      } else if (req.body.selectedFile) {
     
         imageUrl = req.body.selectedFile;
      }
      
  
      let processedTags = [];
      if (tags) {
         if (typeof tags === 'string') {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
         } else if (Array.isArray(tags)) {
            processedTags = tags;
         }
      }
      
      const updatedPost = {
         title,
         description,
         name,
         tags: processedTags,
         selectedFile: imageUrl
      };
      
      const result = await PostMessage.findByIdAndUpdate(_id, updatedPost, { new: true });
      console.log('Post updated successfully:', result);
      res.json(result);

   } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Something went wrong during post update.' });
   }
}

export const deletePost = async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
   await PostMessage.findByIdAndDelete(id);

   res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
   const { id } = req.params;

   if (!req.userId) return res.json({ message: 'Unauthenticated' });
   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
   
   const post = await PostMessage.findById(id);
   const index = post.likes.findIndex((id) => id === String(req.userId));
   
   if (index === -1) {
      post.likes.push(req.userId);
   } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
   }

   const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
   
   try {
 
      if (index === -1 && post.creator !== req.userId) {
         const sender = await User.findById(req.userId);
         const notification = new Notification({
            recipient: post.creator,
            sender: req.userId,
            type: 'like',
            message: `${sender.name} liked your post.`,
            contentId: post._id,
         });
         await notification.save();

         
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
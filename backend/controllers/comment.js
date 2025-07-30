import Comment from "../models/comment.js";
import PostMessage from "../models/postMessage.js";
import User from "../models/user.js";


export const getComments = async (req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    try {
        const startIndex = (Number(page) - 1) * Number(limit);
        
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 }) 
            .limit(Number(limit))
            .skip(startIndex);
            
        const total = await Comment.countDocuments({ postId });
        
        res.status(200).json({
            data: comments,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / Number(limit)),
            totalComments: total
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const addComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }
    
    try {
   
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
    
        const post = await PostMessage.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
  
        const newComment = new Comment({
            text,
            author: req.userId,
            authorName: user.name,
            postId
        });
        
        await newComment.save();
        

        await PostMessage.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 }
        });
        
        
        res.status(201).json(newComment);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }
    
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
   
        if (comment.author !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        
        await Comment.findByIdAndDelete(commentId);
        

        await PostMessage.findByIdAndUpdate(comment.postId, {
            $inc: { commentCount: -1 }
        });
        
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const likeComment = async (req, res) => {
    const { commentId } = req.params;
    
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }
    
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        const index = comment.likes.findIndex((id) => id === String(req.userId));
        
        if (index === -1) {
            comment.likes.push(req.userId);
        } else {
            comment.likes = comment.likes.filter((id) => id !== String(req.userId));
        }
        
        const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, { new: true });
        
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
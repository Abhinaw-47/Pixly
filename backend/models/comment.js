import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    author: {
        type: String, 
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    likes: {
        type: [String], 
        default: [],
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
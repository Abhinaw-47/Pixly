import mongoose from "mongoose";

const postSchema = mongoose.Schema({
        name: String,
        creator: String,
        title: String,
        description: String,
        tags: [String],
        selectedFile: String,
        likes: {
          type: [String],
          default: [],
        },
        commentCount: {
        type: Number,
        default: 0
    },
        createdAt: {
          type: Date,
          default: new Date(),
        },
       
    });
    
    const PostMessage = mongoose.model("PostMessage", postSchema);
    
    export default PostMessage;
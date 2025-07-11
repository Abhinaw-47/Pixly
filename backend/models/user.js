import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    googleId:{
        type:String
    }
    // isVerified:{
    //     type:Boolean,
    //     default:false
    // },
    // resetPasswordToken:String,
    // resetPasswordExpire:Date,
    // verificationToken:String,
    // verificationTokenExpire:Date,

})
const User=mongoose.model("User",userSchema)

export default User
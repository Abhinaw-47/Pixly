
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenv from 'dotenv'
import { generateVerificationCode } from '../utils/generateVerificationCode.js'
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js'
dotenv.config()
export const signup=async(req,res)=>{
const {email,password,firstName,lastName,confirmPassword}=req.body
try {
    const existingUser=await User.findOne({email})
  
    if(existingUser){
        return res.status(404).json({message:"User already exist"})
    }
    if(password!==confirmPassword){
        return res.status(400).json({message:"Passwords don't match"})
    }
   const hashedPassword=await bcrypt.hash(password,12)
   const verificationToken=generateVerificationCode()
   const result=await User.create({email,password:hashedPassword,name:`${firstName} ${lastName}`,verificationToken,verificationTokenExpire:Date.now()+3600000}) 
  
    const token=jwt.sign({email:result.email,id:result._id},process.env.JWT_SECRET, {expiresIn:'1h'})
    // res.cookie("token", token, {
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV === "production",
	// 	sameSite: "strict",
	// 	maxAge: 7 * 24 * 60 * 60 * 1000,
	// });
   
    res.status(200).json({result,token}) 
} catch (error) {
    res.status(500).json({message:error.message})
}
}


export const signin=async(req,res)=>{
    const {email,password}=req.body
  
    try {
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({message:"User doesn't exist"})
        }
      
        const isPasswordCorrect=await bcrypt.compare(password, existingUser.password)
    if(!isPasswordCorrect){
        res.status(400).json({message:"Invalid credentials"})
    }
   
    const token=jwt.sign({email:existingUser.email,id:existingUser._id},'test', {expiresIn:'1h'})
    res.status(200).json({result:existingUser,token})
           
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const googleSignin=async(req,res)=>{
    const {token:googleToken,user}=req.body;
    try {
    const existingUser=await User.findOne({email:user.email});
    let result;
    if(existingUser){
        result=existingUser;
    }
    else{
         result=await User.create({
            email:user.email,
            name:user.name,
            googleId:user.sub
        });
    }
    const jwtToken=jwt.sign({email:result.email,id:result._id}, 'test', {expiresIn:'1h'})
    res.status(200).json({result,token:jwtToken})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
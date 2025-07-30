import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenv from 'dotenv'
import { sendVerificationEmail } from '../utils/sendEmail.js'

dotenv.config()

const generateAccessToken = (payload) => jwt.sign(payload, process.env.JWT_AcessSecret, { expiresIn: '25m' });
const generateRefreshToken = (payload) => jwt.sign(payload, process.env.JWT_RefreshSecret, { expiresIn: '7d' });

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword } = req.body
    try {
        const existingUser = await User.findOne({ email })
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" }) 
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" })
        }
        
        const hashedPassword = await bcrypt.hash(password, 12)
        
       
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
        
        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            otp,
            otpExpires,
            isVerified: false 
        })
        
        await sendVerificationEmail(result.email, otp)
        
        res.status(201).json({
            message: "Registration successful. Please check your email to verify your account",
            userId: result._id
        })
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: error.message })
    }
}

export const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" })
        }
        
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid OTP or expired" })
        }
        
        user.isVerified = true;
        user.otp = undefined
        user.otpExpires = undefined
        await user.save();
        
        const accessToken = generateAccessToken({ email: user.email, id: user._id });
        const refreshToken = generateRefreshToken({ email: user.email, id: user._id });
        
        res.status(200).json({
            result: user,
            accessToken,
            refreshToken
        })
        
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: error.message })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const existingUser = await User.findOne({ email })
        
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" })
        }
        
        if (existingUser.password && !existingUser.isVerified) {
            return res.status(400).json({ message: "Please verify your account" })
        }
        
        if (!existingUser.password) {
            return res.status(400).json({ message: "Please sign in with Google" })
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" }) 
        }
        
        const accessToken = generateAccessToken({ email: existingUser.email, id: existingUser._id });
        const refreshToken = generateRefreshToken({ email: existingUser.email, id: existingUser._id });
        
        res.status(200).json({
            result: existingUser,
            accessToken,
            refreshToken
        })
        
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: error.message })
    }
}

export const googleSignin = async (req, res) => {
    const { token: googleToken, user } = req.body;
    try {
        const existingUser = await User.findOne({ email: user.email });
        let result;
        
        if (existingUser) {
            result = existingUser;
        } else {
            result = await User.create({
                email: user.email,
                name: user.name,
                googleId: user.sub,
                isVerified: true
            });
        }
        
       
        const accessToken = generateAccessToken({ email: result.email, id: result._id });
        const refreshToken = generateRefreshToken({ email: result.email, id: result._id });
        
        res.status(200).json({
            result,
            accessToken,
            refreshToken
        })
        
    } catch (error) {
        console.error('Google signin error:', error);
        res.status(500).json({ message: error.message })
    }
}

export const refreshAccessToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Missing refresh token' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_RefreshSecret);
        const newAccessToken = generateAccessToken({ email: decoded.email, id: decoded.id });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

export const getUsersByIds = async (req, res) => {
    try {
        const { userIds } = req.body;
        
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: 'Please provide an array of user IDs' });
        }
        
        const users = await User.find({
            _id: { $in: userIds }
        }).select('_id name');
        
        res.status(200).json({ data: users });
    } catch (error) {
        console.error('Get users by IDs error:', error);
        res.status(500).json({ message: error.message });
    }
};
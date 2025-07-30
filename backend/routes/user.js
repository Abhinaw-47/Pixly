import express from 'express'
import {signup,signin,googleSignin, refreshAccessToken, getUsersByIds, verifyOtp} from '../controllers/user.js'
const router=express.Router()

router.post('/signup',signup); 
router.post('/signin',signin);
router.post('/googleSignin',googleSignin);
router.post('/refreshToken', refreshAccessToken);
router.post('/users/batch', getUsersByIds);
router.post('/verify-otp',verifyOtp)


export default router
import express from 'express'
import {signup,signin,googleSignin, refreshAccessToken, getUsersByIds} from '../controllers/user.js'
const router=express.Router()

router.post('/signup',signup); 
router.post('/signin',signin);
router.post('/googleSignin',googleSignin);
router.post('/refreshToken', refreshAccessToken);
router.post('/users/batch', getUsersByIds);


export default router
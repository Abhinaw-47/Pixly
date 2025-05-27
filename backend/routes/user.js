import express from 'express'
import {signup,signin,googleSignin} from '../controllers/user.js'
const router=express.Router()

router.post('/signup',signup); 
router.post('/signin',signin);
router.post('/googleSignin',googleSignin);

export default router
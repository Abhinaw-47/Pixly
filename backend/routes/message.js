import express from 'express'
import auth from '../middleware/auth.js'
import { getUsers,getMessages,sendMessage } from '../controllers/message.js'
const router=express.Router()

router.get('/users',auth,getUsers)
router.get('/:id',auth,getMessages);
router.post('/:id',auth,sendMessage);



export default router

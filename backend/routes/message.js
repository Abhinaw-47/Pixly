import express from 'express'
import auth from '../middleware/auth.js'
import { getUsers,getMessages,sendMessage, getAllMessages } from '../controllers/message.js'
const router=express.Router()

router.get('/users',getUsers)
router.get('/:id',auth,getMessages);
router.post('/:id',auth,sendMessage);
router.get('/', auth, getAllMessages);


export default router

import express from 'express';
// Assuming your auth middleware is in 'middleware/auth.js'
import auth from '../middleware/auth.js';
import { getNotifications, markAsRead } from '../controllers/notification.js';

const router = express.Router();

// Route to get all notifications for the logged-in user
router.get('/', auth, getNotifications);

// Route to mark a specific notification as read
router.patch('/:id/read', auth, markAsRead);

export default router;
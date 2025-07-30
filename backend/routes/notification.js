import express from 'express';

import auth from '../middleware/auth.js';
import { getNotifications, markAsRead } from '../controllers/notification.js';

const router = express.Router();


router.get('/', auth, getNotifications);


router.patch('/:id/read', auth, markAsRead);

export default router;
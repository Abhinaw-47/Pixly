import express from 'express';
import { getComments, addComment, deleteComment, likeComment } from '../controllers/comment.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.get('/:postId', getComments);


router.post('/:postId', auth, addComment);


router.delete('/:commentId', auth, deleteComment);

router.patch('/:commentId/like', auth, likeComment);

export default router;
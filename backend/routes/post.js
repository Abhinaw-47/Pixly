import express from 'express'
import multer from 'multer';
import { getPosts, createPost, updatePost, deletePost, likePost, getPostBySearch, getProfile } from '../controllers/post.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        // Accept images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'), false);
        }
    }
});

router.get('/profile/:profile', getProfile);
router.get('/search', getPostBySearch);
router.get('/', getPosts);
// Fix: Use 'selectedFile' (not 'SelectedFile') to match your form field name
router.post('/', auth, upload.single('selectedFile'), createPost);
router.patch('/:id', auth, upload.single('selectedFile'), updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router
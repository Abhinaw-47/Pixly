import express from 'express'
import multer from 'multer';
import { getPosts, createPost, updatePost, deletePost, likePost, getPostBySearch, getProfile, getLikedPosts } from '../controllers/post.js'
import auth from '../middleware/auth.js'

const router = express.Router()


const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: {
        fileSize: 20 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
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
router.get('/likes', auth, getLikedPosts)

router.post('/', auth, upload.single('selectedFile'), createPost);
router.patch('/:id', auth, upload.single('selectedFile'), updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router
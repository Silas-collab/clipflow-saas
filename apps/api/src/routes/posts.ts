import { Router } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost, publishPost } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createPost);
router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/publish', authenticate, publishPost);

export default router;

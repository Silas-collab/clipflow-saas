import { Router } from 'express';
import { getPostAnalytics, getUserAnalytics, refreshAnalytics } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/user', authenticate, getUserAnalytics);
router.get('/posts/:postId', authenticate, getPostAnalytics);
router.post('/posts/:postId/refresh', authenticate, refreshAnalytics);

export default router;

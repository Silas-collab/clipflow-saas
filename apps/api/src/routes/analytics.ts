import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';
const router = Router();
router.use(authenticate);
router.get('/user', analyticsController.getUserAnalytics);
router.get('/posts/:postId', analyticsController.getPostAnalytics);
router.post('/refresh', analyticsController.refreshAnalytics);
export default router;

import { Router } from 'express';
import * as motionController from '../controllers/motionController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/templates', authenticate, motionController.getMotionTemplates);
router.post('/apply', authenticate, motionController.applyMotion);
export default router;

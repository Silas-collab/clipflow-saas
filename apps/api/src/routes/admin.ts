import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
const router = Router();
router.use(authenticate);
router.get('/users', adminController.getUsers);
router.get('/stats', adminController.getStats);
export default router;

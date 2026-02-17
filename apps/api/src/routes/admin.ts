import { Router } from 'express';
import { getSettings, updateSettings, getStats, getUsers, updateUser } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/settings', authenticate, requireAdmin, getSettings);
router.put('/settings', authenticate, requireAdmin, updateSettings);
router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/users', authenticate, requireAdmin, getUsers);
router.put('/users/:id', authenticate, requireAdmin, updateUser);

export default router;

import { Router } from 'express';
import { connectAccount, getAccounts, disconnectAccount, refreshToken } from '../controllers/socialController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/connect', authenticate, connectAccount);
router.get('/', authenticate, getAccounts);
router.post('/:id/disconnect', authenticate, disconnectAccount);
router.post('/:id/refresh', authenticate, refreshToken);

export default router;

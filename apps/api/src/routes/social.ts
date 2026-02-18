import { Router } from 'express';
import * as socialController from '../controllers/socialController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, socialController.getAccounts);
router.post('/connect', authenticate, socialController.connectAccount);
router.delete('/:id', authenticate, socialController.disconnectAccount);
export default router;

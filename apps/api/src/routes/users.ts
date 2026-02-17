import { Router } from 'express';
import { getProfile, updateProfile, getCredits, addCredits } from '../controllers/usersController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/credits', authenticate, getCredits);
router.post('/credits', authenticate, addCredits);

export default router;

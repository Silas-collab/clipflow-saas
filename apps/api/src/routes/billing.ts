import { Router } from 'express';
import * as billingController from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/plans', billingController.getPlans);
router.post('/checkout', authenticate, billingController.createCheckoutSession);
router.get('/subscription', authenticate, billingController.getSubscription);
router.post('/cancel', authenticate, billingController.cancelSubscription);
export default router;

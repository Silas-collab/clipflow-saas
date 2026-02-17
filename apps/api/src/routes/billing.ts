import { Router } from 'express';
import express from 'express';
import { getPlans, createCheckoutSession, getSubscription, cancelSubscription, getInvoices, webhook } from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getPlans);
router.post('/checkout', authenticate, createCheckoutSession);
router.get('/subscription', authenticate, getSubscription);
router.delete('/subscription', authenticate, cancelSubscription);
router.get('/invoices', authenticate, getInvoices);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router;

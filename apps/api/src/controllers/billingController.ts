import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PLANS = [
  { id: 'FREE', name: 'Free', price: 0, credits: 60, features: ['60 credits/month', '720p export', 'Basic templates'] },
  { id: 'STARTER', name: 'Starter', price: 15, credits: 300, features: ['300 credits/month', '1080p export', 'All templates', 'Basic analytics'] },
  { id: 'PRO', name: 'Pro', price: 39, credits: 1000, features: ['1000 credits/month', '4K export', 'All templates', 'Advanced analytics', 'Priority support'] },
  { id: 'BUSINESS', name: 'Business', price: 99, credits: -1, features: ['Unlimited credits', '4K export', 'Team collaboration', 'API access', 'Custom branding'] },
  { id: 'ENTERPRISE', name: 'Enterprise', price: null, credits: -1, features: ['Custom limits', 'Dedicated support', 'SLA', 'On-premise option'] }
];

export const getPlans = async (req: Request, res: Response) => {
  res.json(PLANS);
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { planId } = req.body;
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json({ success: true, checkoutUrl: `https://checkout.stripe.com/mock/${planId}` });
};

export const getSubscription = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ plan: user?.plan || 'FREE', credits: user?.credits || 0 });
};

export const cancelSubscription = async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Subscription cancelled' });
};

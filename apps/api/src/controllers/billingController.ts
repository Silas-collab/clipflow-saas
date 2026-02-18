import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = [
      { id: 'free', name: 'Free', price: 0, credits: 60, features: ['60 credits/month', 'Basic clipping', 'Standard support'] },
      { id: 'pro', name: 'Pro', price: 29, credits: 500, features: ['500 credits/month', 'AI viral scoring', 'Priority support', 'Custom captions'] },
      { id: 'enterprise', name: 'Enterprise', price: 99, credits: 2000, features: ['2000 credits/month', 'API access', 'Dedicated support', 'Custom integrations'] }
    ];
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ success: false, error: 'Failed to get plans' });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { planId } = req.body;
    
    if (!planId) return res.status(400).json({ success: false, error: 'PlanId is required' });
    
    // TODO: Integrar com Stripe Checkout
    const sessionUrl = `https://checkout.stripe.com/pay/test-${planId}-${Date.now()}`;
    
    res.json({ success: true, data: { url: sessionUrl } });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ success: false, error: 'Failed to create checkout session' });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    res.json({ success: true, data: { plan: user.plan, credits: user.credits } });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to get subscription' });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    // TODO: Integrar com Stripe para cancelar assinatura
    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan: 'FREE', credits: 60 }
    });
    
    res.json({ success: true, message: 'Subscription cancelled', data: { plan: user.plan } });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { planId, paymentMethodId } = req.body;
    
    if (!planId) return res.status(400).json({ success: false, error: 'PlanId is required' });
    
    const planCredits: Record<string, number> = { free: 60, pro: 500, enterprise: 2000 };
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planId.toUpperCase(),
        credits: planCredits[planId] || 60
      }
    });
    
    res.json({ success: true, data: { plan: planId, credits: user.credits }, message: 'Subscription created' });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to create subscription' });
  }
};

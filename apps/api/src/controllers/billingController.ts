import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const getPlans = async (req: Request, res: Response) => {
  const plans = [
    { id: 'FREE', name: 'Free', price: 0, credits: 60, features: ['60 credits/month', '720p export', 'Basic templates'] },
    { id: 'STARTER', name: 'Starter', price: 15, credits: 300, features: ['300 credits/month', '1080p export', 'All templates', 'Basic analytics'] },
    { id: 'PRO', name: 'Pro', price: 39, credits: 1000, features: ['1000 credits/month', '4K export', 'All templates', 'Advanced analytics', 'Priority support'] },
    { id: 'BUSINESS', name: 'Business', price: 99, credits: -1, features: ['Unlimited credits', '4K export', 'Team collaboration', 'API access', 'Custom branding'] },
    { id: 'ENTERPRISE', name: 'Enterprise', price: null, credits: -1, features: ['Custom limits', 'Dedicated support', 'SLA', 'On-premise option'] }
  ];
  
  res.json(plans);
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { planId } = req.body;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const prices: Record<string, number> = {
    STARTER: 1500,
    PRO: 3900,
    BUSINESS: 9900
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `ClipFlow ${planId}` },
        unit_amount: prices[planId] || 0
      },
      quantity: 1
    }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
    customer_email: user.email
  });

  res.json({ url: session.url });
};

export const getSubscription = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, stripeSubscriptionId: true, credits: true }
  });
  
  res.json(user);
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stripeSubscriptionId) {
    return res.status(400).json({ error: 'No active subscription' });
  }

  await stripe.subscriptions.cancel(user.stripeSubscriptionId);
  
  await prisma.user.update({
    where: { id: userId },
    data: { plan: 'FREE', stripeSubscriptionId: null }
  });

  res.json({ message: 'Subscription canceled' });
};

export const getInvoices = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json(invoices);
};

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    const prisma = req.app.get('prisma') as PrismaClient;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const user = await prisma.user.findFirst({ where: { email: session.customer_email } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              plan: 'PRO'
            }
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { plan: 'FREE', stripeSubscriptionId: null }
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Webhook error' });
  }
};

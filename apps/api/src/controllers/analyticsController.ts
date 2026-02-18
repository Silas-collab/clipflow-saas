import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPostAnalytics = async (req: Request, res: Response) => {
  const analytics = await prisma.analytics.findMany({
    where: { entityType: 'post' },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json({ success: true, data: analytics });
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const analytics = await prisma.analytics.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json({ success: true, data: analytics });
};

export const refreshAnalytics = async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Analytics refreshed' });
};

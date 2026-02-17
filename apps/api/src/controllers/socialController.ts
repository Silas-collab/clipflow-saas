import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const socialSchema = z.object({
  platform: z.enum(['YOUTUBE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK']),
  accountId: z.string(),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.string().optional()
});

export const connectAccount = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const data = socialSchema.parse(req.body);
    
    // Check if already connected
    const existing = await prisma.socialAccount.findFirst({
      where: { userId, platform: data.platform, accountId: data.accountId }
    });

    if (existing) {
      // Update existing
      const account = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tokenExpiresAt: data.tokenExpiresAt ? new Date(data.tokenExpiresAt) : null,
          isActive: true
        }
      });
      return res.json(account);
    }

    const account = await prisma.socialAccount.create({
      data: {
        userId,
        platform: data.platform,
        accountId: data.accountId,
        accountName: data.accountName,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt ? new Date(data.tokenExpiresAt) : null
      }
    });

    res.json(account);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to connect account' });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { platform } = req.query;
  
  const where: any = { userId };
  if (platform) where.platform = platform;

  const accounts = await prisma.socialAccount.findMany({
    where,
    orderBy: { connectedAt: 'desc' }
  });
  
  res.json(accounts);
};

export const disconnectAccount = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  await prisma.socialAccount.update({
    where: { id },
    data: { isActive: false }
  });
  
  res.json({ message: 'Account disconnected' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const { accessToken, refreshToken, tokenExpiresAt } = req.body;
  
  const account = await prisma.socialAccount.update({
    where: { id },
    data: {
      accessToken,
      refreshToken,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null
    }
  });
  
  res.json(account);
};

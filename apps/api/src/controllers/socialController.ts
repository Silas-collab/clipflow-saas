import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAccounts = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const accounts = await prisma.socialAccount.findMany({
    where: { userId },
    select: { id: true, platform: true, accountId: true, createdAt: true }
  });
  res.json({ success: true, data: accounts });
};

export const connectAccount = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { platform, accountId, accessToken, refreshToken, expiresAt } = req.body;
  const account = await prisma.socialAccount.create({
    data: { userId, platform, accountId, accessToken, refreshToken, expiresAt }
  });
  res.json({ success: true, data: account });
};

export const disconnectAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  await prisma.socialAccount.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};

export const getOAuthUrl = async (req: Request, res: Response) => {
  const { platform } = req.query;
  const urls: Record<string, string> = {
    youtube: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3001/api/social/callback/youtube&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload',
    tiktok: 'https://www.tiktok.com/auth/authorize/?client_key=YOUR_CLIENT_KEY&redirect_uri=http://localhost:3001/api/social/callback/tiktok&response_type=code',
    instagram: 'https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3001/api/social/callback/instagram&response_type=code&scope=user_profile,user_media'
  };
  res.json({ success: true, url: urls[platform as string] || '' });
};

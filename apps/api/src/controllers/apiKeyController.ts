import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

export const getApiKeys = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: { id: true, name: true, provider: true, createdAt: true }
  });
  res.json({ success: true, data: keys });
};

export const createApiKey = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { name, provider, key } = req.body;
  const apiKey = await prisma.apiKey.create({
    data: { userId, name, provider, key: key || crypto.randomBytes(32).toString('hex') }
  });
  res.json({ success: true, data: apiKey });
};

export const deleteApiKey = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  await prisma.apiKey.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const getProfile = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, name: true, avatar: true, plan: true, 
      credits: true, role: true, createdAt: true,
      workspaces: { include: { members: { include: { user: true } } } }
    }
  });
  
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.id;
  const { name, avatar } = req.body;
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, avatar },
    select: { id: true, email: true, name: true, avatar: true, plan: true, credits: true }
  });
  
  res.json(user);
};

export const getCredits = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true }
  });
  
  res.json(user);
};

export const addCredits = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.id;
  const { amount } = req.body;
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
    select: { credits: true }
  });
  
  res.json({ credits: user.credits });
};

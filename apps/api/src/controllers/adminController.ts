import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSettings = async (req: Request, res: Response) => {
  res.json({ settings: {} });
};

export const updateSettings = async (req: Request, res: Response) => {
  res.json({ success: true });
};

export const getStats = async (req: Request, res: Response) => {
  const users = await prisma.user.count();
  const videos = await prisma.video.count();
  const clips = await prisma.clip.count();
  res.json({ users, videos, clips });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, plan: true, createdAt: true }
  });
  res.json({ success: true, data: users });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, plan, credits } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { role, plan, credits }
  });
  res.json({ success: true, data: user });
};

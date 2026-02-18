import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, plan: true, credits: true, createdAt: true }
  });
  res.json({ success: true, data: users });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, avatar: true, role: true, plan: true, credits: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, avatar, plan, credits } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name, avatar, plan, credits }
  });
  res.json({ success: true, data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatar: true, role: true, plan: true, credits: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data: user });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { name, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, avatar }
  });
  res.json({ success: true, data: user });
};

export const getCredits = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true }
  });
  res.json({ success: true, data: user });
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: posts });
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const post = await prisma.post.findFirst({ where: { id, userId } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ success: true, data: post });
};

export const createPost = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { clipId, platform, scheduledAt } = req.body;
  const post = await prisma.post.create({
    data: { userId, clipId, platform, scheduledAt }
  });
  res.json({ success: true, data: post });
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const { status, scheduledAt, publishedAt, postId, postUrl } = req.body;
  const post = await prisma.post.updateMany({
    where: { id, userId },
    data: { status, scheduledAt, publishedAt, postId, postUrl }
  });
  res.json({ success: true, data: post });
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  await prisma.post.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};

export const schedulePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const { scheduledAt } = req.body;
  const post = await prisma.post.updateMany({
    where: { id, userId },
    data: { status: 'SCHEDULED', scheduledAt }
  });
  res.json({ success: true, data: post });
};

export const publishPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const post = await prisma.post.updateMany({
    where: { id, userId },
    data: { status: 'PUBLISHED', publishedAt: new Date() }
  });
  res.json({ success: true, data: post });
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getClips = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { videoId } = req.query;
  const clips = await prisma.clip.findMany({
    where: { userId, ...(videoId ? { videoId: String(videoId) } : {}) },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: clips });
};

export const getClip = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const clip = await prisma.clip.findFirst({ where: { id, userId }, include: { captions: true } });
  if (!clip) return res.status(404).json({ error: 'Clip not found' });
  res.json({ success: true, data: clip });
};

export const createClip = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { videoId, title, startTime, endTime, duration, thumbnailUrl } = req.body;
  const clip = await prisma.clip.create({
    data: { userId, videoId, title, startTime, endTime, duration, thumbnailUrl }
  });
  res.json({ success: true, data: clip });
};

export const updateClip = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const { title, status, outputPath, viralScore, viralReasons } = req.body;
  const clip = await prisma.clip.updateMany({
    where: { id, userId },
    data: { title, status, outputPath, viralScore, viralReasons }
  });
  res.json({ success: true, data: clip });
};

export const deleteClip = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  await prisma.clip.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};

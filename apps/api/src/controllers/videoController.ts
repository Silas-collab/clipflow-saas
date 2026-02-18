import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getVideos = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const videos = await prisma.video.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: videos });
};

export const getVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const video = await prisma.video.findFirst({
    where: { id, userId },
    include: { clips: true }
  });
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json({ success: true, data: video });
};

export const createVideo = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { title, description, sourceUrl, sourceType, duration, thumbnailUrl } = req.body;
  const video = await prisma.video.create({
    data: { userId, title, description, sourceUrl, sourceType, duration, thumbnailUrl }
  });
  res.json({ success: true, data: video });
};

export const updateVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const { title, description, status, transcript } = req.body;
  const video = await prisma.video.updateMany({
    where: { id, userId },
    data: { title, description, status, transcript }
  });
  res.json({ success: true, data: video });
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  await prisma.video.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};

export const uploadVideo = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { title, sourceUrl, duration, thumbnailUrl } = req.body;
  const video = await prisma.video.create({
    data: { userId, title, sourceUrl, sourceType: 'UPLOAD', duration, thumbnailUrl }
  });
  res.json({ success: true, data: video });
};

export const suggestVideoClips = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  const video = await prisma.video.findFirst({ where: { id, userId } });
  if (!video) return res.status(404).json({ error: 'Video not found' });
  // Simular sugestões de clipes baseadas no vídeo
  const suggestions = [
    { startTime: 0, endTime: 15, title: 'Intro Hook', viralScore: 0.85 },
    { startTime: 30, endTime: 45, title: 'Key Moment', viralScore: 0.92 },
    { startTime: 60, endTime: 75, title: 'Highlight', viralScore: 0.78 }
  ];
  res.json({ success: true, data: suggestions });
};

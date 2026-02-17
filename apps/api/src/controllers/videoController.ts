import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import axios from 'axios';

const videoSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  workspaceId: z.string().optional()
});

export const uploadVideo = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const { title, url, workspaceId } = videoSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < 10) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    let videoData: any = {
      userId,
      title,
      status: 'UPLOADING',
      creditsUsed: 10
    };

    if (workspaceId) videoData.workspaceId = workspaceId;
    if (url) {
      videoData.originalUrl = url;
      videoData.status = 'PROCESSING';
    }

    const video = await prisma.video.create({ data: videoData });

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 10 } }
    });

    res.json(video);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Upload failed' });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { page = 1, limit = 20 } = req.query;
  
  const videos = await prisma.video.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
    include: { clips: { select: { id: true } } }
  });
  
  const total = await prisma.video.count({ where: { userId } });
  
  res.json({ videos, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
};

export const getVideo = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const video = await prisma.video.findUnique({
    where: { id },
    include: { 
      clips: { 
        include: { 
          analyses: true,
          captions: { include: { template: true } }
        } 
      } 
    }
  });
  
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json(video);
};

export const deleteVideo = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const userId = (req as any).user?.userId;
  
  await prisma.video.deleteMany({ where: { id, userId } });
  
  res.json({ message: 'Video deleted' });
};

export const processVideo = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  // Update status to processing
  const video = await prisma.video.update({
    where: { id },
    data: { status: 'PROCESSING' }
  });

  // TODO: Integrate with video processing service (FFmpeg, Whisper, etc.)
  // This would typically be handled by a background job

  res.json({ message: 'Video processing started', video });
};

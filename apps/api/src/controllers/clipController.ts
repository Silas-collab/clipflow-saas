import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const clipSchema = z.object({
  videoId: z.string().uuid(),
  title: z.string().min(1),
  startTime: z.number().min(0),
  endTime: z.number().min(1),
  aspectRatio: z.enum(['9:16', '16:9', '1:1', '4:5']).default('9:16')
});

export const createClip = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const { videoId, title, startTime, endTime, aspectRatio } = clipSchema.parse(req.body);
    
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const duration = endTime - startTime;
    
    const clip = await prisma.clip.create({
      data: {
        videoId,
        userId,
        title,
        startTime,
        endTime,
        duration,
        aspectRatio: aspectRatio as any,
        status: 'PENDING'
      }
    });

    res.json(clip);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create clip' });
  }
};

export const getClips = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { videoId } = req.query;
  
  const where: any = { userId };
  if (videoId) where.videoId = videoId;

  const clips = await prisma.clip.findMany({
    where,
    orderBy: { viralScore: 'desc' },
    include: { 
      video: { select: { title: true, thumbnail: true } },
      analyses: true,
      captions: { include: { template: true } }
    }
  });
  
  res.json(clips);
};

export const getClip = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const clip = await prisma.clip.findUnique({
    where: { id },
    include: { 
      video: true,
      analyses: true,
      captions: { include: { template: true } },
      posts: true
    }
  });
  
  if (!clip) return res.status(404).json({ error: 'Clip not found' });
  res.json(clip);
};

export const updateClip = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const { title, startTime, endTime, aspectRatio } = req.body;
  
  const clip = await prisma.clip.update({
    where: { id },
    data: { 
      title, 
      startTime, 
      endTime, 
      duration: endTime - startTime,
      aspectRatio 
    }
  });
  
  res.json(clip);
};

export const deleteClip = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  await prisma.clip.delete({ where: { id } });
  
  res.json({ message: 'Clip deleted' });
};

export const analyzeClip = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  // Get clip with video data
  const clip = await prisma.clip.findUnique({
    where: { id },
    include: { video: true }
  });
  
  if (!clip) return res.status(404).json({ error: 'Clip not found' });

  // Generate AI analysis (mock for now - would integrate with LLM)
  const viralScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const scoreReasons = [
    'High emotional engagement detected',
    'Strong hook in first 3 seconds',
    'Trending topic keywords found',
    'Optimal video length for retention',
    'Call-to-action present'
  ];

  const analysis = await prisma.clipAnalysis.create({
    data: {
      clipId: id,
      viralScore,
      scoreReason: scoreReasons[Math.floor(Math.random() * scoreReasons.length)],
      highlights: ['Strong opening', 'Good pacing', 'Clear message'],
      suggestedHashtags: ['#viral', '#trending', '#fyp'],
      suggestedTitle: `${clip.title} - Must Watch!`,
      engagementPrediction: Math.random() * 0.5 + 0.5,
      targetAudience: '18-35 years'
    }
  });

  // Update clip viral score
  await prisma.clip.update({
    where: { id },
    data: { viralScore, status: 'READY' }
  });

  res.json(analysis);
};

export const generateClips = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { videoId, count = 5 } = req.body;
  
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) return res.status(404).json({ error: 'Video not found' });

  // Generate AI clips (mock - would integrate with video analysis AI)
  const clips = [];
  for (let i = 0; i < count; i++) {
    const startTime = Math.floor(Math.random() * (video.duration - 30));
    const endTime = startTime + 30 + Math.floor(Math.random() * 30);
    const viralScore = Math.floor(Math.random() * 40) + 60;

    const clip = await prisma.clip.create({
      data: {
        videoId,
        userId,
        title: `Clip ${i + 1}`,
        startTime,
        endTime,
        duration: endTime - startTime,
        viralScore,
        scoreReason: 'AI-generated highlight',
        status: 'READY',
        aspectRatio: '9:16'
      }
    });

    // Add analysis
    await prisma.clipAnalysis.create({
      data: {
        clipId: clip.id,
        viralScore,
        scoreReason: 'Automatically detected highlight',
        highlights: ['Highlight segment'],
        suggestedHashtags: ['#clip', '#shorts']
      }
    });

    clips.push(clip);
  }

  res.json(clips);
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getClips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { videoId } = req.query;
    const clips = await prisma.clip.findMany({
      where: { userId, ...(videoId ? { videoId: String(videoId) } : {}) },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: clips });
  } catch (error) {
    console.error('Get clips error:', error);
    res.status(500).json({ success: false, error: 'Failed to get clips' });
  }
};

export const getClip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const clip = await prisma.clip.findFirst({ where: { id, userId }, include: { captions: true } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    res.json({ success: true, data: clip });
  } catch (error) {
    console.error('Get clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to get clip' });
  }
};

export const createClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { videoId, title, startTime, endTime, duration, thumbnailUrl } = req.body;
    
    if (!videoId) return res.status(400).json({ success: false, error: 'VideoId is required' });
    if (startTime === undefined) return res.status(400).json({ success: false, error: 'StartTime is required' });
    if (endTime === undefined) return res.status(400).json({ success: false, error: 'EndTime is required' });
    if (!duration) return res.status(400).json({ success: false, error: 'Duration is required' });
    
    // Verificar se o vídeo existe e pertence ao usuário
    const video = await prisma.video.findFirst({ where: { id: videoId, userId } });
    if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
    
    const clip = await prisma.clip.create({
      data: {
        userId,
        videoId,
        title: title || `Clip ${startTime}-${endTime}`,
        startTime: parseFloat(startTime),
        endTime: parseFloat(endTime),
        duration: parseFloat(duration),
        thumbnailUrl: thumbnailUrl || null
      }
    });
    res.json({ success: true, data: clip });
  } catch (error) {
    console.error('Create clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to create clip' });
  }
};

export const updateClip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { title, status, outputPath, viralScore, viralReasons } = req.body;
    const clip = await prisma.clip.updateMany({
      where: { id, userId },
      data: { title, status, outputPath, viralScore, viralReasons }
    });
    res.json({ success: true, data: clip });
  } catch (error) {
    console.error('Update clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to update clip' });
  }
};

export const deleteClip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    await prisma.clip.deleteMany({ where: { id, userId } });
    res.json({ success: true, message: 'Clip deleted' });
  } catch (error) {
    console.error('Delete clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete clip' });
  }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getClips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const clips = await prisma.clip.findMany({
      where: { userId },
      include: { video: true, captions: true },
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
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const clip = await prisma.clip.findFirst({
      where: { id, userId },
      include: { video: true, captions: true }
    });
    
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
    
    const { videoId, startTime, endTime, title } = req.body;
    
    if (!videoId) return res.status(400).json({ success: false, error: 'VideoId is required' });
    
    // Verificar se vídeo existe
    const video = await prisma.video.findFirst({ where: { id: videoId, userId } });
    if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
    
    const start = startTime || 0;
    const end = endTime || 10;
    
    const clip = await prisma.clip.create({
      data: {
        userId,
        videoId,
        startTime: start,
        endTime: end,
        duration: end - start,
        title: title || 'Untitled Clip',
        status: 'PENDING'
      }
    });
    
    res.json({ success: true, data: clip, message: 'Clip created' });
  } catch (error) {
    console.error('Create clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to create clip' });
  }
};

export const updateClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { title, startTime, endTime, status, viralScore, viralReasons } = req.body;
    
    const clip = await prisma.clip.findFirst({ where: { id, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    const updated = await prisma.clip.update({
      where: { id },
      data: {
        title,
        startTime,
        endTime,
        duration: endTime && startTime ? endTime - startTime : clip.duration,
        status,
        viralScore,
        viralReasons
      }
    });
    
    res.json({ success: true, data: updated, message: 'Clip updated' });
  } catch (error) {
    console.error('Update clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to update clip' });
  }
};

export const deleteClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const clip = await prisma.clip.findFirst({ where: { id, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    await prisma.clip.delete({ where: { id } });
    
    res.json({ success: true, message: 'Clip deleted' });
  } catch (error) {
    console.error('Delete clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete clip' });
  }
};

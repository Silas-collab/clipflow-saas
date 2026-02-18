import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getVideos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { status } = req.query;
    
    const where: any = { userId };
    if (status) where.status = String(status).toUpperCase();
    
    const videos = await prisma.video.findMany({
      where,
      include: { clips: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ success: false, error: 'Failed to get videos' });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const video = await prisma.video.findFirst({
      where: { id, userId },
      include: { clips: true }
    });
    
    if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
    
    res.json({ success: true, data: video });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ success: false, error: 'Failed to get video' });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { title, sourceUrl, sourceType, duration } = req.body;
    
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
    if (!sourceType) return res.status(400).json({ success: false, error: 'SourceType is required' });
    
    const video = await prisma.video.create({
      data: {
        userId,
        title,
        sourceUrl: sourceUrl || null,
        sourceType: String(sourceType).toUpperCase(),
        duration: duration ? parseFloat(duration) : null,
        status: 'UPLOADED'
      }
    });
    
    res.json({ success: true, data: video, message: 'Video created' });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ success: false, error: 'Failed to create video' });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { title, status } = req.body;
    
    const video = await prisma.video.findFirst({ where: { id, userId } });
    if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
    
    const updated = await prisma.video.update({
      where: { id },
      data: { title, status: status ? String(status).toUpperCase() : video.status }
    });
    
    res.json({ success: true, data: updated, message: 'Video updated' });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ success: false, error: 'Failed to update video' });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    await prisma.video.deleteMany({ where: { id, userId } });
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete video' });
  }
};

// Upload de vídeo (recebe arquivo ou URL)
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { title, sourceUrl, sourceType } = req.body;
    
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
    if (!sourceType) return res.status(400).json({ success: false, error: 'SourceType is required' });
    
    // Se for upload de arquivo, o arquivo estará em req.file
    let filePath = null;
    if ((req as any).file) {
      filePath = `/uploads/${(req as any).file.filename}`;
    }
    
    const video = await prisma.video.create({
      data: {
        userId,
        title,
        sourceUrl: sourceUrl || filePath,
        sourceType: String(sourceType).toUpperCase(),
        status: 'UPLOADED'
      }
    });
    
    res.json({ success: true, data: video, message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload video' });
  }
};

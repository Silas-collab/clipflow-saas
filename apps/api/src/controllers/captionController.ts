import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCaptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { clipId } = req.query;
    const captions = await prisma.caption.findMany({
      where: { clip: { userId, ...(clipId ? { id: String(clipId) } : {}) } }
    });
    res.json({ success: true, data: captions });
  } catch (error) {
    console.error('Get captions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get captions' });
  }
};

export const createCaption = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { clipId, content, position, style, fontSize, color } = req.body;
    
    if (!clipId) return res.status(400).json({ success: false, error: 'ClipId is required' });
    if (!content) return res.status(400).json({ success: false, error: 'Content is required' });
    
    // Verificar se o clip existe e pertence ao usuário
    const clip = await prisma.clip.findFirst({ where: { id: clipId, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    const caption = await prisma.caption.create({
      data: {
        clipId,
        content,
        position: position || 'bottom',
        style: style || null,
        fontSize: fontSize || 24,
        color: color || null
      }
    });
    res.json({ success: true, data: caption });
  } catch (error) {
    console.error('Create caption error:', error);
    res.status(500).json({ success: false, error: 'Failed to create caption' });
  }
};

export const updateCaption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { content, position, style, fontSize, color } = req.body;
    const caption = await prisma.caption.updateMany({
      where: { id, clip: { userId } },
      data: { content, position, style, fontSize, color }
    });
    res.json({ success: true, data: caption });
  } catch (error) {
    console.error('Update caption error:', error);
    res.status(500).json({ success: false, error: 'Failed to update caption' });
  }
};

export const deleteCaption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    await prisma.caption.deleteMany({ where: { id, clip: { userId } } });
    res.json({ success: true, message: 'Caption deleted' });
  } catch (error) {
    console.error('Delete caption error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete caption' });
  }
};

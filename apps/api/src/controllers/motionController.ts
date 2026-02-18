import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMotionStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    res.json({ success: true, data: { status: 'ready', templates: 5 } });
  } catch (error) {
    console.error('Get motion status error:', error);
    res.status(500).json({ success: false, error: 'Failed to get motion status' });
  }
};

export const getMotionTemplates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const templates = [
      { id: 'zoom-in', name: 'Zoom In', type: 'effect', duration: 2 },
      { id: 'slide-left', name: 'Slide Left', type: 'transition', duration: 1 },
      { id: 'fade', name: 'Fade', type: 'transition', duration: 1.5 },
      { id: 'bounce', name: 'Bounce', type: 'effect', duration: 0.5 },
      { id: 'spin', name: 'Spin', type: 'effect', duration: 1 }
    ];
    
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Get motion templates error:', error);
    res.status(500).json({ success: false, error: 'Failed to get motion templates' });
  }
};

export const applyMotion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { clipId, templateId, params } = req.body;
    
    if (!clipId) return res.status(400).json({ success: false, error: 'ClipId is required' });
    if (!templateId) return res.status(400).json({ success: false, error: 'TemplateId is required' });
    
    // Verificar se o clip pertence ao usuário
    const clip = await prisma.clip.findFirst({ where: { id: clipId, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    // TODO: Aplicar motion real com FFmpeg
    res.json({ 
      success: true, 
      data: { clipId, templateId, status: 'processing' },
      message: 'Motion applied successfully' 
    });
  } catch (error) {
    console.error('Apply motion error:', error);
    res.status(500).json({ success: false, error: 'Failed to apply motion' });
  }
};

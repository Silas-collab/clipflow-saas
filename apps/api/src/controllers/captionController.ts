import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const captionSchema = z.object({
  clipId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  content: z.string().min(1),
  style: z.object({
    fontSize: z.number().optional(),
    fontFamily: z.string().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    position: z.enum(['top', 'center', 'bottom']).optional()
  }).optional(),
  position: z.enum(['top', 'center', 'bottom']).default('bottom'),
  animation: z.string().optional()
});

export const createCaption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  
  try {
    const data = captionSchema.parse(req.body);
    
    const caption = await prisma.caption.create({
      data: {
        clipId: data.clipId,
        templateId: data.templateId,
        content: data.content,
        style: data.style || {},
        position: data.position,
        animation: data.animation
      },
      include: { template: true }
    });

    // Increment template usage
    if (data.templateId) {
      await prisma.captionTemplate.update({
        where: { id: data.templateId },
        data: { usageCount: { increment: 1 } }
      });
    }

    res.json(caption);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create caption' });
  }
};

export const getCaptions = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { clipId } = req.query;
  
  const where: any = {};
  if (clipId) where.clipId = clipId;

  const captions = await prisma.caption.findMany({
    where,
    include: { template: true, clip: { select: { title: true } } }
  });
  
  res.json(captions);
};

export const getCaption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const caption = await prisma.caption.findUnique({
    where: { id },
    include: { template: true, clip: true }
  });
  
  if (!caption) return res.status(404).json({ error: 'Caption not found' });
  res.json(caption);
};

export const updateCaption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const { content, style, position, animation } = req.body;
  
  const caption = await prisma.caption.update({
    where: { id },
    data: { content, style, position, animation }
  });
  
  res.json(caption);
};

export const deleteCaption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  await prisma.caption.delete({ where: { id } });
  
  res.json({ message: 'Caption deleted' });
};

export const getTemplates = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { premium, search } = req.query;
  
  const where: any = {};
  if (premium !== undefined) where.isPremium = premium === 'true';
  if (search) where.name = { contains: search as string, mode: 'insensitive' };

  const templates = await prisma.captionTemplate.findMany({
    where,
    orderBy: [{ isDefault: 'desc' }, { usageCount: 'desc' }]
  });
  
  res.json(templates);
};

export const createTemplate = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { name, description, style, previewUrl, isPremium } = req.body;
  
  const template = await prisma.captionTemplate.create({
    data: { name, description, style, previewUrl, isPremium: isPremium || false }
  });
  
  res.json(template);
};

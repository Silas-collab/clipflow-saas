import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCaptions = async (req: Request, res: Response) => {
  const { clipId } = req.query;
  const captions = await prisma.caption.findMany({
    where: clipId ? { clipId: String(clipId) } : {},
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: captions });
};

export const createCaption = async (req: Request, res: Response) => {
  const { clipId, content, position, style, fontSize, color } = req.body;
  const caption = await prisma.caption.create({
    data: { clipId, content, position: position || 'bottom', style, fontSize: fontSize || 24, color }
  });
  res.json({ success: true, data: caption });
};

export const updateCaption = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, position, style, fontSize, color } = req.body;
  const caption = await prisma.caption.update({
    where: { id },
    data: { content, position, style, fontSize, color }
  });
  res.json({ success: true, data: caption });
};

export const deleteCaption = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.caption.delete({ where: { id } });
  res.json({ success: true });
};

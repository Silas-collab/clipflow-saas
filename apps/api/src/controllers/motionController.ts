import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const motionSchema = z.object({
  title: z.string().min(1),
  prompt: z.string().optional(),
  audioPath: z.string().optional()
});

export const createProject = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const { title, prompt, audioPath } = motionSchema.parse(req.body);
    
    const project = await prisma.motionProject.create({
      data: { userId, title, prompt, audioPath, status: 'DRAFT' }
    });

    res.json(project);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  const projects = await prisma.motionProject.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json(projects);
};

export const getProject = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const project = await prisma.motionProject.findUnique({ where: { id } });
  
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
};

export const generateVideo = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const project = await prisma.motionProject.findUnique({ where: { id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Update status to processing
  await prisma.motionProject.update({
    where: { id },
    data: { status: 'PROCESSING' }
  });

  // TODO: Integrate with AI video generation (e.g., using LLM to generate React Motion Graphics code)
  // This would use the prompt/audio to generate a video with motion graphics

  res.json({ message: 'Video generation started', projectId: id });
};

export const deleteProject = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  await prisma.motionProject.delete({ where: { id } });
  
  res.json({ message: 'Project deleted' });
};

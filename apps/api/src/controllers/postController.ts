import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const postSchema = z.object({
  clipId: z.string().uuid(),
  socialAccountId: z.string().uuid(),
  scheduledAt: z.string().optional()
});

export const createPost = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const { clipId, socialAccountId, scheduledAt } = postSchema.parse(req.body);
    
    // Verify ownership
    const clip = await prisma.clip.findUnique({ where: { id: clipId } });
    if (!clip || clip.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const account = await prisma.socialAccount.findUnique({ 
      where: { id: socialAccountId } 
    });
    if (!account || account.userId !== userId) {
      return res.status(403).json({ error: 'Invalid social account' });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        clipId,
        socialAccountId,
        platform: account.platform,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      },
      include: { clip: true, socialAccount: true }
    });

    res.json(post);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { status, platform } = req.query;
  
  const where: any = { userId };
  if (status) where.status = status;
  if (platform) where.platform = platform;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { 
      clip: { select: { id: true, title: true, thumbnail: true } },
      socialAccount: { select: { platform: true, accountName: true } },
      analytics: true
    }
  });
  
  res.json(posts);
};

export const getPost = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: { 
      clip: true,
      socialAccount: true,
      analytics: true
    }
  });
  
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

export const updatePost = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const { scheduledAt, status } = req.body;
  
  const post = await prisma.post.update({
    where: { id },
    data: {
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      status
    }
  });
  
  res.json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  await prisma.post.delete({ where: { id } });
  
  res.json({ message: 'Post deleted' });
};

export const publishPost = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: { clip: true, socialAccount: true }
  });
  
  if (!post) return res.status(404).json({ error: 'Post not found' });

  // TODO: Integrate with actual social media APIs
  // This would publish to YouTube, Facebook, Instagram, TikTok
  
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      platformPostId: `mock_${Date.now()}`,
      platformUrl: `https://example.com/post/${Date.now()}`
    }
  });

  res.json(updatedPost);
};

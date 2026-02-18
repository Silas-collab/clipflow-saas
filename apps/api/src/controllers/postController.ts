import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { status, platform } = req.query;
    
    const where: any = { userId };
    if (status) where.status = String(status).toUpperCase();
    if (platform) where.platform = String(platform).toUpperCase();
    
    const posts = await prisma.post.findMany({
      where,
      include: { clip: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, error: 'Failed to get posts' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const post = await prisma.post.findFirst({
      where: { id, userId },
      include: { clip: true }
    });
    
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, error: 'Failed to get post' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { clipId, platform, caption, scheduledAt } = req.body;
    
    if (!platform) return res.status(400).json({ success: false, error: 'Platform is required' });
    
    const post = await prisma.post.create({
      data: {
        userId,
        clipId: clipId || null,
        platform: String(platform).toUpperCase(),
        caption: caption || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'DRAFT'
      },
      include: { clip: true }
    });
    
    res.json({ success: true, data: post, message: 'Post created' });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { caption, status, scheduledAt } = req.body;
    
    const post = await prisma.post.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    const updated = await prisma.post.update({
      where: { id },
      data: {
        caption,
        status: status ? String(status).toUpperCase() : post.status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : post.scheduledAt
      },
      include: { clip: true }
    });
    
    res.json({ success: true, data: updated, message: 'Post updated' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, error: 'Failed to update post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    await prisma.post.deleteMany({ where: { id, userId } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
};

export const schedulePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { scheduledAt } = req.body;
    
    if (!scheduledAt) return res.status(400).json({ success: false, error: 'Scheduled date is required' });
    
    const post = await prisma.post.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    const updated = await prisma.post.update({
      where: { id },
      data: {
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED'
      }
    });
    
    res.json({ success: true, data: updated, message: 'Post scheduled' });
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ success: false, error: 'Failed to schedule post' });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const post = await prisma.post.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    // Aqui seria a integração real com a API da plataforma social
    // Por agora, apenas atualizamos o status
    const updated = await prisma.post.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        postId: `mock-post-${Date.now()}`,
        postUrl: `https://mock-platform.com/post/${id}`
      }
    });
    
    res.json({ success: true, data: updated, message: 'Post published successfully' });
  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({ success: false, error: 'Failed to publish post' });
  }
};

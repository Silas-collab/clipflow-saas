import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const posts = await prisma.post.findMany({
      where: { userId },
      include: { clip: true },
      orderBy: { createdAt: 'desc' }
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
    
    const { clipId, platform, caption, title } = req.body;
    
    if (!platform) return res.status(400).json({ success: false, error: 'Platform is required' });
    
    const post = await prisma.post.create({
      data: {
        userId,
        clipId: clipId || null,
        platform: String(platform).toUpperCase(),
        caption: caption || title || 'Untitled Post',
        status: 'DRAFT'
      }
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
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
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
    
    const post = await prisma.post.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    await prisma.post.delete({ where: { id } });
    
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
    
    const post = await prisma.post.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    const updated = await prisma.post.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt)
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
    
    const updated = await prisma.post.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });
    
    res.json({ success: true, data: updated, message: 'Post published' });
  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({ success: false, error: 'Failed to publish post' });
  }
};

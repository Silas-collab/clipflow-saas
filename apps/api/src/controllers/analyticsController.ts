import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const getPostAnalytics = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { postId } = req.params;
  
  const analytics = await prisma.analytics.findMany({
    where: { postId },
    orderBy: { fetchedAt: 'desc' }
  });
  
  res.json(analytics);
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  const { period = '30d' } = req.query;
  
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const posts = await prisma.post.findMany({
    where: { 
      userId,
      status: 'PUBLISHED',
      publishedAt: { gte: startDate }
    },
    include: { analytics: true }
  });

  const totalViews = posts.reduce((sum, p) => sum + (p.analytics[0]?.views || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.analytics[0]?.likes || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.analytics[0]?.comments || 0), 0);
  const totalShares = posts.reduce((sum, p) => sum + (p.analytics[0]?.shares || 0), 0);

  res.json({
    period,
    totalPosts: posts.length,
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    avgEngagement: posts.length > 0 ? (totalLikes + totalComments + totalShares) / posts.length : 0,
    posts: posts.map(p => ({
      id: p.id,
      platform: p.platform,
      publishedAt: p.publishedAt,
      views: p.analytics[0]?.views || 0,
      likes: p.analytics[0]?.likes || 0,
      comments: p.analytics[0]?.comments || 0,
      shares: p.analytics[0]?.shares || 0
    }))
  });
};

export const refreshAnalytics = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { postId } = req.params;
  
  // TODO: Fetch real analytics from social platforms
  const mockAnalytics = {
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    engagement: Math.random()
  };

  const analytics = await prisma.analytics.create({
    data: {
      postId,
      ...mockAnalytics
    }
  });

  res.json(analytics);
};

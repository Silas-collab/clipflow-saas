import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { entityType, startDate, endDate } = req.query;
    
    const where: any = { userId };
    if (entityType) where.entityType = String(entityType);
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(String(startDate));
      if (endDate) where.createdAt.lte = new Date(String(endDate));
    }
    
    const analytics = await prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to get analytics' });
  }
};

export const getPostAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { postId } = req.params;
    
    const analytics = await prisma.analytics.findMany({
      where: { userId, entityId: postId, entityType: 'post' },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get post analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to get post analytics' });
  }
};

export const refreshAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    // TODO: Integrar com APIs sociais para buscar métricas reais
    res.json({ success: true, message: 'Analytics refresh started' });
  } catch (error) {
    console.error('Refresh analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to refresh analytics' });
  }
};

export const createAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { entityType, entityId, metric, value } = req.body;
    
    if (!entityType) return res.status(400).json({ success: false, error: 'EntityType is required' });
    if (!entityId) return res.status(400).json({ success: false, error: 'EntityId is required' });
    if (!metric) return res.status(400).json({ success: false, error: 'Metric is required' });
    if (value === undefined) return res.status(400).json({ success: false, error: 'Value is required' });
    
    const analytics = await prisma.analytics.create({
      data: { userId, entityType, entityId, metric, value: parseFloat(value) }
    });
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Create analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to create analytics' });
  }
};

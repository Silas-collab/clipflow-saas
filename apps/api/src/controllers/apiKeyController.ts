import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, provider: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: keys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ success: false, error: 'Failed to get API keys' });
  }
};

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { name, provider } = req.body;
    
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
    if (!provider) return res.status(400).json({ success: false, error: 'Provider is required' });
    
    // Gerar chave única
    const key = `cf_${provider}_${crypto.randomBytes(32).toString('hex')}`;
    
    const apiKey = await prisma.apiKey.create({
      data: { userId, name, provider, key }
    });
    
    res.json({ success: true, data: { id: apiKey.id, name: apiKey.name, provider: apiKey.provider, key }, message: 'API key created' });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ success: false, error: 'Failed to create API key' });
  }
};

export const deleteApiKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    await prisma.apiKey.deleteMany({ where: { id, userId } });
    res.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete API key' });
  }
};

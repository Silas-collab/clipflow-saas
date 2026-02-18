import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const accounts = await prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ success: false, error: 'Failed to get accounts' });
  }
};

export const connectAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { platform, accountId, accessToken, refreshToken, expiresAt } = req.body;
    
    if (!platform) return res.status(400).json({ success: false, error: 'Platform is required' });
    if (!accountId) return res.status(400).json({ success: false, error: 'AccountId is required' });
    
    // Verificar se já existe
    const existing = await prisma.socialAccount.findFirst({
      where: { userId, platform: String(platform).toUpperCase() }
    });
    
    if (existing) {
      // Atualizar
      const updated = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          accountId,
          accessToken,
          refreshToken,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      });
      return res.json({ success: true, data: updated, message: 'Account updated' });
    }
    
    // Criar novo
    const account = await prisma.socialAccount.create({
      data: {
        userId,
        platform: String(platform).toUpperCase(),
        accountId,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });
    
    res.json({ success: true, data: account, message: 'Account connected' });
  } catch (error) {
    console.error('Connect account error:', error);
    res.status(500).json({ success: false, error: 'Failed to connect account' });
  }
};

export const disconnectAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { platform } = req.params;
    
    const account = await prisma.socialAccount.findFirst({
      where: { userId, platform: String(platform).toUpperCase() }
    });
    
    if (!account) return res.status(404).json({ success: false, error: 'Account not found' });
    
    await prisma.socialAccount.delete({ where: { id: account.id } });
    
    res.json({ success: true, message: 'Account disconnected' });
  } catch (error) {
    console.error('Disconnect account error:', error);
    res.status(500).json({ success: false, error: 'Failed to disconnect account' });
  }
};

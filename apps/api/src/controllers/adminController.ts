import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    // Verificar se é admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden - Admin only' });
    }
    
    const [totalUsers, totalVideos, totalClips, totalPosts] = await Promise.all([
      prisma.user.count(),
      prisma.video.count(),
      prisma.clip.count(),
      prisma.post.count()
    ]);
    
    res.json({
      success: true,
      data: { totalUsers, totalVideos, totalClips, totalPosts }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden - Admin only' });
    }
    
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, plan: true, credits: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
};

// Função adicional para compatibilidade com rota
export const getUsers = getAllUsers;

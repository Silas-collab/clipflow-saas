import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatar: true, plan: true, credits: true, role: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { name, avatar } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, avatar },
      select: { id: true, email: true, name: true, avatar: true, plan: true, credits: true }
    });
    
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete account' });
  }
};

// Funções para admin - listar todos os usuários
export const getUsers = async (req: Request, res: Response) => {
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
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
};

// Obter usuário específico por ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, plan: true, credits: true, role: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
};

// Atualizar usuário específico (admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { name, avatar, plan, credits, role } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { name, avatar, plan, credits, role },
      select: { id: true, email: true, name: true, avatar: true, plan: true, credits: true, role: true }
    });
    
    res.json({ success: true, data: user, message: 'User updated' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
};

// Deletar usuário específico (admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
};

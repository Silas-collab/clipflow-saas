import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const getSettings = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  
  const settings = await prisma.platformSettings.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => settingsMap[s.key] = s.value);
  
  res.json({
    aiModel: settingsMap.aiModel || 'openai/gpt-4o-mini',
    defaultCredits: parseInt(settingsMap.defaultCredits) || 60,
    maxVideoSize: parseInt(settingsMap.maxVideoSize) || 500,
    enableGoogleAuth: settingsMap.enableGoogleAuth === 'true',
    enableStripe: settingsMap.enableStripe === 'true',
    maintenanceMode: settingsMap.maintenanceMode === 'true'
  });
};

export const updateSettings = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { aiModel, defaultCredits, maxVideoSize, enableGoogleAuth, enableStripe, maintenanceMode } = req.body;
  
  const settings = [
    { key: 'aiModel', value: aiModel },
    { key: 'defaultCredits', value: String(defaultCredits) },
    { key: 'maxVideoSize', value: String(maxVideoSize) },
    { key: 'enableGoogleAuth', value: String(enableGoogleAuth) },
    { key: 'enableStripe', value: String(enableStripe) },
    { key: 'maintenanceMode', value: String(maintenanceMode) }
  ];

  for (const setting of settings) {
    await prisma.platformSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value }
    });
  }

  res.json({ message: 'Settings updated' });
};

export const getStats = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  
  const [totalUsers, totalVideos, totalClips, totalPosts, usersByPlan] = await Promise.all([
    prisma.user.count(),
    prisma.video.count(),
    prisma.clip.count(),
    prisma.post.count(),
    prisma.user.groupBy({ by: ['plan'], _count: { plan: true } })
  ]);

  res.json({
    totalUsers,
    totalVideos,
    totalClips,
    totalPosts,
    usersByPlan
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { page = 1, limit = 20, search } = req.query;
  
  const where: any = {};
  if (search) {
    where.OR = [
      { email: { contains: search as string, mode: 'insensitive' } },
      { name: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: { id: true, email: true, name: true, plan: true, credits: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit)
  });

  const total = await prisma.user.count({ where });
  
  res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
};

export const updateUser = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const { id } = req.params;
  const { plan, credits, role } = req.body;
  
  const user = await prisma.user.update({
    where: { id },
    data: { plan, credits, role },
    select: { id: true, email: true, name: true, plan: true, credits: true, role: true }
  });
  
  res.json(user);
};

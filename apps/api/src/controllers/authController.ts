import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const JWT_SECRET = process.env.JWT_SECRET || 'clipflow-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const register = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        plan: 'FREE',
        credits: 60
      }
    });

    // Create default workspace
    await prisma.workspace.create({
      data: {
        name: 'My Workspace',
        ownerId: user.id
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, credits: user.credits },
      token
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workspaces: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        workspaces: user.workspaces
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const me = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma') as PrismaClient;
  const userId = (req as any).user?.userId;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workspaces: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        workspaces: user.workspaces
      }
    });
  } catch (error: any) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // JWT tokens são stateless, então logout é apenas resposta ao cliente
  // O cliente deve remover o token do localStorage
  res.json({ message: 'Logged out successfully' });
};

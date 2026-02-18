import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import clipRoutes from './routes/clips.js';
import captionRoutes from './routes/captions.js';
import socialRoutes from './routes/social.js';
import postRoutes from './routes/posts.js';
import analyticsRoutes from './routes/analytics.js';
import billingRoutes from './routes/billing.js';
import motionRoutes from './routes/motion.js';
import adminRoutes from './routes/admin.js';
import apiKeyRoutes from './routes/apiKeys.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

app.set('prisma', prisma);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/clips', clipRoutes);
app.use('/api/captions', captionRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/motion', motionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/api-keys', apiKeyRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 ClipFlow API running on port ${PORT}`));

process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

export default app;

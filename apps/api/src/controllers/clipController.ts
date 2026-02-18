import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateClip, downloadVideo, extractAudio, getVideoInfo } from '../services/ffmpegService.js';
import { transcribeAudio } from '../services/groqService.js';
import { analyzeViralPotential, suggestClips } from '../services/viralScoreService.js';
import fs from 'fs';

const prisma = new PrismaClient();

export const getClips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const clips = await prisma.clip.findMany({
      where: { userId },
      include: { video: true, captions: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: clips });
  } catch (error) {
    console.error('Get clips error:', error);
    res.status(500).json({ success: false, error: 'Failed to get clips' });
  }
};

export const getClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const clip = await prisma.clip.findFirst({
      where: { id, userId },
      include: { video: true, captions: true }
    });
    
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    res.json({ success: true, data: clip });
  } catch (error) {
    console.error('Get clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to get clip' });
  }
};

// Criar clip a partir de prompt/URL - FLUXO COMPLETO
export const createClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { 
      videoId, 
      videoUrl,      // URL para download
      startTime, 
      endTime, 
      title,
      aspectRatio,   // 9:16, 16:9, 1:1, 4:5
      autoGenerate,  // Gerar automaticamente com IA
      prompt         // Prompt descrevendo o clip desejado
    } = req.body;
    
    let finalVideoId = videoId;
    let videoPath: string | null = null;
    let videoDuration = 0;
    
    // PASSO 1: Download do vídeo se URL fornecida
    if (videoUrl && !videoId) {
      console.log('📥 Baixando vídeo de:', videoUrl);
      
      const downloadResult = await downloadVideo(videoUrl);
      videoPath = downloadResult.path;
      videoDuration = downloadResult.duration;
      
      // Criar registro do vídeo no banco
      const video = await prisma.video.create({
        data: {
          userId,
          title: downloadResult.title || 'Imported Video',
          sourceUrl: videoUrl,
          sourceType: 'URL',
          duration: videoDuration,
          status: 'COMPLETED'
        }
      });
      finalVideoId = video.id;
      
      console.log('✅ Vídeo baixado:', video.id);
    }
    
    // Se temos videoId, buscar informações
    if (finalVideoId && !videoPath) {
      const existingVideo = await prisma.video.findFirst({ 
        where: { id: finalVideoId, userId } 
      });
      if (!existingVideo) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }
      videoDuration = existingVideo.duration || 0;
    }
    
    // PASSO 2: Se autoGenerate, usar IA para sugerir cortes
    let suggestedStart = startTime || 0;
    let suggestedEnd = endTime || 30;
    
    if (autoGenerate && videoPath) {
      console.log('🤖 Extraindo áudio para análise...');
      
      // Extrair áudio
      const audioPath = await extractAudio(videoPath);
      const audioBuffer = fs.readFileSync(audioPath);
      
      // Transcrever com Groq Whisper
      console.log('📝 Transcrevendo áudio com Whisper...');
      const transcription = await transcribeAudio(audioBuffer);
      
      // Salvar transcrição no vídeo (campo: transcript)
      await prisma.video.update({
        where: { id: finalVideoId },
        data: { transcript: transcription.text }
      });
      
      // Usar IA para sugerir melhores cortes
      console.log('🎯 Analisando melhores momentos...');
      const suggestions = await suggestClips(transcription.text, videoDuration, 1);
      
      if (suggestions && suggestions.length > 0) {
        suggestedStart = suggestions[0].startTime;
        suggestedEnd = suggestions[0].endTime;
      }
      
      // Limpar arquivo de áudio temporário
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    }
    
    // PASSO 3: Criar registro do clip
    const clip = await prisma.clip.create({
      data: {
        userId,
        videoId: finalVideoId,
        startTime: suggestedStart,
        endTime: suggestedEnd,
        duration: suggestedEnd - suggestedStart,
        title: title || 'Untitled Clip',
        status: 'PROCESSING'
      }
    });
    
    // PASSO 4: Gerar clip físico com FFmpeg (async)
    if (videoPath) {
      // Processar em background
      processClipAsync(clip.id, videoPath, suggestedStart, suggestedEnd, aspectRatio || '9:16')
        .catch(err => console.error('Erro no processamento:', err));
      
      res.json({ 
        success: true, 
        data: clip, 
        message: 'Clip criado e sendo processado',
        processing: true
      });
    } else {
      res.json({ 
        success: true, 
        data: clip, 
        message: 'Clip criado. Faça upload do vídeo para processar.'
      });
    }
    
  } catch (error: any) {
    console.error('Create clip error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create clip' });
  }
};

// Processar clip de forma assíncrona
async function processClipAsync(
  clipId: string, 
  videoPath: string, 
  startTime: number, 
  endTime: number,
  aspectRatio: string
) {
  try {
    console.log(`🎬 Processando clip ${clipId}...`);
    
    // Gerar clip com FFmpeg
    const result = await generateClip({
      inputPath: videoPath,
      startTime,
      endTime,
      aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1' | '4:5'
    });
    
    // Extrair áudio do clip para análise viral
    const audioPath = await extractAudio(result.path);
    const audioBuffer = fs.readFileSync(audioPath);
    
    // Transcrever
    console.log('📝 Transcrevendo clip...');
    const transcription = await transcribeAudio(audioBuffer);
    
    // Analisar potencial viral
    console.log('📊 Analisando potencial viral...');
    const viralAnalysis = await analyzeViralPotential(transcription.text, result.duration);
    
    // Atualizar clip com resultados (viralReasons é string, não array)
    await prisma.clip.update({
      where: { id: clipId },
      data: {
        status: 'COMPLETED',
        outputPath: result.path,
        thumbnailUrl: result.thumbnail,
        viralScore: viralAnalysis.score,
        viralReasons: JSON.stringify(viralAnalysis.reasons)
      }
    });
    
    // Criar legendas automáticas (campo: content, não text)
    await prisma.caption.create({
      data: {
        clipId,
        content: transcription.text,
        style: 'default'
      }
    });
    
    console.log(`✅ Clip ${clipId} processado com sucesso!`);
    console.log(`   📈 Viral Score: ${viralAnalysis.score}/100`);
    
    // Limpar temporários
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    
  } catch (error: any) {
    console.error(`❌ Erro ao processar clip ${clipId}:`, error);
    
    await prisma.clip.update({
      where: { id: clipId },
      data: {
        status: 'FAILED',
        viralReasons: JSON.stringify([error.message])
      }
    });
  }
}

export const updateClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    const { title, startTime, endTime, status, viralScore, viralReasons } = req.body;
    
    const clip = await prisma.clip.findFirst({ where: { id, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    const updated = await prisma.clip.update({
      where: { id },
      data: {
        title,
        startTime,
        endTime,
        duration: endTime && startTime ? endTime - startTime : clip.duration,
        status,
        viralScore,
        viralReasons: viralReasons ? JSON.stringify(viralReasons) : clip.viralReasons
      }
    });
    
    res.json({ success: true, data: updated, message: 'Clip updated' });
  } catch (error) {
    console.error('Update clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to update clip' });
  }
};

export const deleteClip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { id } = req.params;
    
    const clip = await prisma.clip.findFirst({ where: { id, userId } });
    if (!clip) return res.status(404).json({ success: false, error: 'Clip not found' });
    
    // Deletar arquivos físicos
    if (clip.outputPath && fs.existsSync(clip.outputPath)) {
      fs.unlinkSync(clip.outputPath);
    }
    if (clip.thumbnailUrl && fs.existsSync(clip.thumbnailUrl)) {
      fs.unlinkSync(clip.thumbnailUrl);
    }
    
    await prisma.clip.delete({ where: { id } });
    
    res.json({ success: true, message: 'Clip deleted' });
  } catch (error) {
    console.error('Delete clip error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete clip' });
  }
};

// Endpoint para sugerir clips automaticamente
export const suggestClipCuts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { videoId, count = 5 } = req.body;
    
    const video = await prisma.video.findFirst({ 
      where: { id: videoId, userId } 
    });
    
    if (!video || !video.transcript) {
      return res.status(400).json({ 
        success: false, 
        error: 'Video not found or not transcribed' 
      });
    }
    
    const suggestions = await suggestClips(video.transcript, video.duration || 0, count);
    
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Suggest clips error:', error);
    res.status(500).json({ success: false, error: 'Failed to suggest clips' });
  }
};

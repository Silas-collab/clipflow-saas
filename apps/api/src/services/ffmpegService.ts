import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ClipOptions {
  inputPath: string;
  startTime: number;
  endTime: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  outputPath?: string;
}

interface ClipResult {
  path: string;
  duration: number;
  thumbnail: string;
  size: number;
}

// Obter dimensões para aspect ratio
function getDimensions(aspectRatio: string, baseHeight: number = 1920): { width: number; height: number } {
  const ratios: Record<string, { width: number; height: number }> = {
    '9:16': { width: 1080, height: 1920 },  // Vertical (TikTok/Reels/Shorts)
    '16:9': { width: 1920, height: 1080 }, // Horizontal (YouTube)
    '1:1': { width: 1080, height: 1080 },  // Quadrado (Instagram Feed)
    '4:5': { width: 1080, height: 1350 }   // Retrato (Instagram)
  };
  return ratios[aspectRatio] || ratios['9:16'];
}

// Gerar clip a partir de vídeo
export async function generateClip(options: ClipOptions): Promise<ClipResult> {
  const { inputPath, startTime, endTime, aspectRatio, outputPath } = options;
  
  const tempDir = '/tmp/clipflow/clips';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const clipId = crypto.randomBytes(8).toString('hex');
  const clipPath = outputPath || `${tempDir}/clip_${clipId}.mp4`;
  const thumbPath = `${tempDir}/thumb_${clipId}.jpg`;
  
  const duration = endTime - startTime;
  const { width, height } = getDimensions(aspectRatio);
  
  try {
    // Gerar clip com FFmpeg
    const cmd = `ffmpeg -y -ss ${startTime} -i "${inputPath}" -t ${duration} \
      -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black" \
      -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k \
      -movflags +faststart "${clipPath}"`;
    
    execSync(cmd, { stdio: 'ignore' });
    
    // Gerar thumbnail
    const thumbCmd = `ffmpeg -y -i "${clipPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${thumbPath}"`;
    execSync(thumbCmd, { stdio: 'ignore' });
    
    const stats = fs.statSync(clipPath);
    
    return {
      path: clipPath,
      duration,
      thumbnail: thumbPath,
      size: stats.size
    };
  } catch (error: any) {
    throw new Error(`Erro ao gerar clip: ${error.message}`);
  }
}

// Baixar vídeo de URL
export async function downloadVideo(url: string): Promise<{ path: string; duration: number; title: string }> {
  const tempDir = '/tmp/clipflow/downloads';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const videoId = crypto.randomBytes(8).toString('hex');
  const videoPath = `${tempDir}/${videoId}.mp4`;
  
  try {
    // Usar yt-dlp para baixar (suporta YouTube, TikTok, Instagram, Facebook, etc)
    execSync(`yt-dlp -f 'best[ext=mp4]' -o "${videoPath}" "${url}"`, {
      stdio: 'inherit',
      timeout: 300000
    });
    
    // Obter duração
    const durationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
    const duration = parseFloat(execSync(durationCmd).toString().trim());
    
    // Obter título
    const titleCmd = `ffprobe -v error -show_entries format=title -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
    let title = 'Video';
    try {
      title = execSync(titleCmd).toString().trim() || 'Video';
    } catch {
      title = 'Video';
    }
    
    return { path: videoPath, duration, title };
  } catch (error: any) {
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    throw new Error(`Erro ao baixar vídeo: ${error.message}`);
  }
}

// Extrair áudio de vídeo
export async function extractAudio(videoPath: string): Promise<string> {
  const audioPath = videoPath.replace(/\.mp4$/, '.mp3');
  
  execSync(`ffmpeg -y -i "${videoPath}" -vn -acodec mp3 -ab 192k "${audioPath}"`, {
    stdio: 'ignore'
  });
  
  return audioPath;
}

// Obter informações do vídeo
export async function getVideoInfo(filePath: string): Promise<{ duration: number; width: number; height: number; fps: number; size: number }> {
  const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -show_entries format=duration,size -of json "${filePath}"`;
  const output = execSync(cmd).toString();
  const data = JSON.parse(output);
  
  const stream = data.streams[0];
  const format = data.format;
  
  const fpsParts = stream.r_frame_rate?.split('/') || ['30', '1'];
  const fps = parseInt(fpsParts[0]) / parseInt(fpsParts[1]);
  
  return {
    duration: parseFloat(stream.duration || format.duration || '0'),
    width: stream.width || 0,
    height: stream.height || 0,
    fps: fps || 30,
    size: parseInt(format.size || '0')
  };
}

export default { generateClip, downloadVideo, extractAudio, getVideoInfo };

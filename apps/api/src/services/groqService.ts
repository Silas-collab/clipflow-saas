import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string = 'audio.mp3'
): Promise<TranscriptionResult> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer]), filename);
  formData.append('model', 'whisper-large-v3');
  formData.append('response_format', 'json');

  try {
    const response = await axios.post(GROQ_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
      maxBodyLength: 25 * 1024 * 1024, // 25MB limit
      maxContentLength: 25 * 1024 * 1024,
    });

    return {
      text: response.data.text,
      language: response.data.language,
    };
  } catch (error: any) {
    console.error('Groq transcription error:', error.response?.data || error.message);
    throw new Error(`Transcription failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function transcribeAudioChunked(
  audioBuffer: Buffer,
  chunkSizeMB: number = 20
): Promise<TranscriptionResult> {
  const chunkSize = chunkSizeMB * 1024 * 1024;
  const chunks: Buffer[] = [];
  
  for (let i = 0; i < audioBuffer.length; i += chunkSize) {
    chunks.push(audioBuffer.subarray(i, i + chunkSize));
  }

  const results = await Promise.all(
    chunks.map((chunk, index) => transcribeAudio(chunk, `chunk_${index}.mp3`))
  );

  return {
    text: results.map(r => r.text).join(' '),
    language: results[0]?.language,
  };
}

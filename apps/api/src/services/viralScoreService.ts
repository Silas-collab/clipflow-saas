import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_MODEL = process.env.DEFAULT_AI_MODEL || 'openai/gpt-4o-mini';

interface ViralAnalysis {
  score: number;
  reasons: string[];
  highlights: string[];
  suggestedHashtags: string[];
  suggestedTitle: string;
  engagementPrediction: number;
  targetAudience: string;
  bestTimeToPost: string;
  improvements: string[];
}

// Analisar potencial viral de um clip
export async function analyzeViralPotential(
  transcript: string,
  clipDuration: number,
  category: string = 'entertainment'
): Promise<ViralAnalysis> {
  
  const prompt = `Você é um especialista em viralização de conteúdo. Analise o seguinte transcript de um vídeo curto e forneça uma análise detalhada.

TRANSCRIPT:
"""
${transcript}
"""

DURAÇÃO: ${clipDuration} segundos
CATEGORIA: ${category}

Responda em JSON com a seguinte estrutura:
{
  "score": <número de 0-100 representando potencial viral>,
  "reasons": [<array de strings com razões do score>],
  "highlights": [<array de strings com pontos fortes>],
  "suggestedHashtags": [<array de 5-10 hashtags relevantes>],
  "suggestedTitle": <título otimizado para engajamento>,
  "engagementPrediction": <número 0-1 representando taxa de engajamento prevista>,
  "targetAudience": <descrição do público-alvo>,
  "bestTimeToPost": <horário recomendado para postar>,
  "improvements": [<array de sugestões para melhorar o viral score>]
}

Seja específico e prático. Responda APENAS com o JSON, sem texto adicional.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://clipflow.app',
          'X-Title': 'ClipFlow Viral Analysis'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Resposta inválida da IA');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Erro na análise viral:', error.response?.data || error.message);
    
    // Retornar análise padrão em caso de erro
    return {
      score: 50,
      reasons: ['Análise automática indisponível'],
      highlights: ['Conteúdo detectado'],
      suggestedHashtags: ['#viral', '#trending', '#fyp', '#content', '#video'],
      suggestedTitle: 'Vídeo Incrível',
      engagementPrediction: 0.3,
      targetAudience: 'Adultos 18-35',
      bestTimeToPost: '18:00-21:00',
      improvements: ['Adicione uma chamada para ação', 'Use legendas']
    };
  }
}

// Gerar sugestões de cortes baseado no transcript
export async function suggestClips(
  transcript: string,
  fullDuration: number,
  clipCount: number = 5
): Promise<Array<{ startTime: number; endTime: number; reason: string }>> {
  
  const prompt = `Você é um editor de vídeo especialista. Analise o transcript e sugira ${clipCount} trechos ideais para criar clips virais.

TRANSCRIPT:
"""
${transcript}
"""

DURAÇÃO TOTAL: ${fullDuration} segundos

Para cada clip, forneça:
- startTime: segundo inicial
- endTime: segundo final (clips devem ter entre 15-60 segundos)
- reason: por que esse trecho é bom

Responda em JSON:
{
  "clips": [
    {"startTime": <número>, "endTime": <número>, "reason": "<string>"}
  ]
}

Distribua os clips ao longo do vídeo. Responda APENAS com o JSON.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://clipflow.app',
          'X-Title': 'ClipFlow Clip Suggestions'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Resposta inválida da IA');
    }
    
    return JSON.parse(jsonMatch[0]).clips;
  } catch (error: any) {
    console.error('Erro ao sugerir clips:', error.response?.data || error.message);
    
    // Retornar sugestões padrão distribuídas
    const clips = [];
    const clipDuration = Math.min(30, fullDuration / clipCount);
    
    for (let i = 0; i < clipCount; i++) {
      const startTime = (fullDuration / clipCount) * i;
      clips.push({
        startTime: Math.floor(startTime),
        endTime: Math.floor(startTime + clipDuration),
        reason: 'Trecho sugerido automaticamente'
      });
    }
    
    return clips;
  }
}

export default { analyzeViralPotential, suggestClips };

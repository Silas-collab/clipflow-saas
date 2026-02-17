import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { } from 'framer-motion';
import { Play, Pause, Type, Image, Music, Download, Save, Undo, Redo, Crop, Sparkles, Palette } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ClipData {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  captions: string[];
  viralScore: number;
  analysis: {
    reason: string;
    highlights: string[];
  };
}

const captionTemplates = [
  { id: 1, name: 'Moderno', style: 'modern' },
  { id: 2, name: 'Viral', style: 'viral' },
  { id: 3, name: 'Elegante', style: 'elegant' },
  { id: 4, name: 'Descontraído', style: 'casual' },
  { id: 5, name: 'Neon', style: 'neon' },
  { id: 6, name: 'Gradiente', style: 'gradient' },
];

export default function Editor() {
  const { clipId } = useParams();
  const navigate = useNavigate();
  const [clip, setClip] = useState<ClipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [caption, setCaption] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);

  useEffect(() => {
    const fetchClip = async () => {
      try {
        const response = await api.get(`/clips/${clipId}`);
        if (response.data?.data) {
          setClip(response.data.data);
          setTrimEnd(response.data.data.duration || 60);
        }
      } catch (error) {
        toast.error('Erro ao carregar clip');
        navigate('/app/clips');
      } finally {
        setLoading(false);
      }
    };
    if (clipId) fetchClip();
  }, [clipId, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/clips/${clipId}`, {
        caption,
        templateId: selectedTemplate,
        trimStart,
        trimEnd
      });
      toast.success('Clip salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar clip');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/clips')} className="btn-secondary px-4">
            ← Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold">{clip?.title}</h1>
            <p className="text-gray-400">Viral Score: <span className="text-primary-400 font-bold">{clip?.viralScore}%</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Undo className="w-4 h-4" />
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Redo className="w-4 h-4" />
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button className="btn-primary flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-2">
            <div className="aspect-video bg-black rounded-xl relative overflow-hidden">
              <video
                src={clip?.videoUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {/* Play/Pause overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition"
              >
                <div className="w-20 h-20 rounded-full bg-primary-500/90 flex items-center justify-center">
                  {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1" />}
                </div>
              </button>
            </div>

            {/* Timeline */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Início: {Math.floor(trimStart / 60)}:{String(trimStart % 60).padStart(2, '0')}</span>
                <input
                  type="range"
                  min={0}
                  max={clip?.duration || 60}
                  value={trimStart}
                  onChange={(e) => setTrimStart(Number(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Fim: {Math.floor(trimEnd / 60)}:{String(trimEnd % 60).padStart(2, '0')}</span>
                <input
                  type="range"
                  min={0}
                  max={clip?.duration || 60}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Number(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              Análise da IA
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Por que este clip pode viralizar:</p>
                <p className="text-white">{clip?.analysis?.reason || 'Análise em processamento...'}</p>
              </div>
              {clip?.analysis?.highlights && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Momentos em destaque:</p>
                  <div className="flex flex-wrap gap-2">
                    {clip.analysis.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="space-y-4">
          {/* Caption Editor */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-accent-400" />
              Legenda
            </h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Digite a legenda do seu clip..."
              className="input-field h-32 resize-none"
            />
          </div>

          {/* Templates */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-400" />
              Modelos de Legenda
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {captionTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 rounded-xl border transition ${
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                      : 'border-[#2D2D4A] hover:border-primary-500/50'
                  }`}
                >
                  <span className="font-medium">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Edições Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <Crop className="w-4 h-4" />
                Cortar
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <Image className="w-4 h-4" />
                Imagens
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <Type className="w-4 h-4" />
                Texto
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <Music className="w-4 h-4" />
                Áudio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

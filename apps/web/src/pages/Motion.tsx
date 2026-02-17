import { useState } from 'react';
import {} from 'framer-motion';
import { Upload, Wand2, Play, Download, Plus, FileAudio, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  status: 'draft' | 'generating' | 'ready';
  thumbnail: string;
  createdAt: string;
}

export default function Motion() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [projects] = useState<Project[]>([]);

  const handleGenerate = async () => {
    if (!prompt && !audioFile) {
      toast.error('Adicione um prompt ou áudio');
      return;
    }
    setGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setGenerating(false);
      toast.success('Vídeo gerado com sucesso!');
    }, 3000);
  };

  const templates = [
    { id: 1, name: 'Tech Presentation', icon: '💻' },
    { id: 2, name: 'Product Launch', icon: '🚀' },
    { id: 3, name: 'Social Media', icon: '📱' },
    { id: 4, name: 'Storytelling', icon: '📖' },
    { id: 5, name: 'Tutorial', icon: '🎓' },
    { id: 6, name: 'Promo', icon: '🔥' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Motion AI</h1>
        <p className="text-gray-400 mt-1">Gere vídeos automaticamente com IA</p>
      </div>

      {/* Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            Criar Novo Vídeo
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o vídeo que você quer criar..."
                className="input-field h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Áudio</label>
              <div className="border-2 border-dashed border-[#2D2D4A] rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  {audioFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <FileAudio className="w-6 h-6" />
                      <span>{audioFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Arraste ou clique para上传 áudio</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Gerar Vídeo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Templates</h2>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                className="p-4 rounded-xl border border-[#2D2D4A] hover:border-primary-500 hover:bg-primary-500/10 transition flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{template.icon}</span>
                <span className="font-medium text-sm">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Meus Projetos</h2>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum projeto ainda</p>
            <p className="text-gray-500 text-sm mt-1">Crie seu primeiro vídeo com IA</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="glass rounded-xl overflow-hidden">
                <div className="aspect-video bg-[#252542]">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-2">{project.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">{project.status}</span>
                    <div className="flex gap-2">
                      <button className="p-2 glass rounded-lg hover:bg-primary-500/20">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 glass rounded-lg hover:bg-primary-500/20">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

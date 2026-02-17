import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Play, Trash2, Copy, Download, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Clip {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  viralScore: number;
  status: string;
  aspectRatio: string;
  createdAt: string;
}

export default function Clips() {
  const navigate = useNavigate();
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClips();
  }, [filter]);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clips');
      if (response.data?.data) {
        let filtered = response.data.data;
        if (filter === 'viral') {
          filtered = filtered.filter((c: Clip) => c.viralScore > 70);
        } else if (filter === 'recent') {
          filtered = filtered.slice(0, 10);
        }
        setClips(filtered);
      }
    } catch (error) {
      console.error('Error fetching clips:', error);
      toast.error('Erro ao carregar clips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este clip?')) return;
    try {
      await api.delete(`/clips/${id}`);
      toast.success('Clip excluído!');
      fetchClips();
    } catch (error) {
      toast.error('Erro ao excluir clip');
    }
  };

  const handleDuplicate = async (clip: Clip) => {
    try {
      await api.post('/clips', {
        title: `${clip.title} (cópia)`,
        videoId: clip.id,
        startTime: 0,
        endTime: clip.duration
      });
      toast.success('Clip duplicado!');
      fetchClips();
    } catch (error) {
      toast.error('Erro ao duplicar clip');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary-500" />
            Meus Clips
          </h1>
          <p className="text-gray-400">Gerencie seus clips criados</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="all">Todos</option>
            <option value="recent">Recentes</option>
            <option value="viral">Virais</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : clips.length === 0 ? (
        <div className="text-center py-16">
          <Scissors className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum clip ainda</h3>
          <p className="text-gray-400 mb-4">Crie clips a partir dos seus vídeos</p>
          <button
            onClick={() => navigate('/app/videos')}
            className="btn-primary"
          >
            Ir para Vídeos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map((clip) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="aspect-[9/16] bg-gray-900 relative">
                {clip.thumbnail ? (
                  <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                {clip.viralScore > 70 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Viral
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {clip.duration}s
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{clip.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{clip.aspectRatio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/app/editor/${clip.id}`)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Play className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDuplicate(clip)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(clip.id)}
                    className="p-2 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

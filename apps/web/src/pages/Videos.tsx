import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Youtube, FileVideo, Trash2, Loader2, CheckCircle, XCircle, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
}

export default function Videos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        if (response.data?.data) setVideos(response.data.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', acceptedFiles[0]);
      
      const response = await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data?.data) {
        setVideos(prev => [response.data.data, ...prev]);
        toast.success('Vídeo enviado com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao enviar vídeo');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] },
    maxFiles: 1,
    disabled: uploading
  });

  const handleYoutubeImport = async () => {
    if (!youtubeUrl) return;
    setUploading(true);
    try {
      const response = await api.post('/videos', { url: youtubeUrl });
      if (response.data?.data) {
        setVideos(prev => [response.data.data, ...prev]);
        toast.success('Vídeo importado do YouTube!');
        setYoutubeUrl('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao importar vídeo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/videos/${id}`);
      setVideos(prev => prev.filter(v => v.id !== id));
      toast.success('Vídeo excluído');
    } catch (error: any) {
      toast.error('Erro ao excluir vídeo');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Meus Vídeos</h1>
        <p className="text-gray-400 mt-1">Faça upload ou importe do YouTube</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          {...getRootProps()}
          className={`glass-card p-8 border-2 border-dashed transition cursor-pointer ${
            isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-[#2D2D4A]'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {uploading ? (
              <Loader2 className="w-16 h-16 text-primary-400 mx-auto mb-4 animate-spin" />
            ) : (
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">
              {uploading ? 'Enviando...' : 'Arraste seu vídeo aqui'}
            </h3>
            <p className="text-gray-400">MP4, MOV, AVI ou MKV até 2GB</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Youtube className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Importar do YouTube</h3>
              <p className="text-gray-400 text-sm">Cole a URL do vídeo</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input-field flex-1"
            />
            <button
              onClick={handleYoutubeImport}
              disabled={uploading || !youtubeUrl}
              className="btn-primary px-6 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Importar'}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Biblioteca de Vídeos</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-primary-400 mx-auto animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <FileVideo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum vídeo ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 glass rounded-xl hover:border-primary-500/30 transition"
              >
                <div className="w-32 h-20 bg-[#252542] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={video.thumbnail || '/placeholder.jpg'} alt={video.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{video.title}</h4>
                  <p className="text-gray-400 text-sm">{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {video.status === 'processing' && (
                    <span className="flex items-center gap-2 text-yellow-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando
                    </span>
                  )}
                  {video.status === 'ready' && (
                    <span className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Pronto
                    </span>
                  )}
                  {video.status === 'error' && (
                    <span className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-4 h-4" />
                      Erro
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/app/clips?video=${video.id}`)}
                    className="btn-secondary px-4 py-2 flex items-center gap-2"
                    disabled={video.status !== 'ready'}
                  >
                    <Scissors className="w-4 h-4" />
                    Gerar Clips
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

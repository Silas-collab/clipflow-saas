import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Scissors, TrendingUp, Users, Zap, Clock, Play, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface Stats {
  totalVideos: number;
  totalClips: number;
  totalViews: number;
  totalEngagement: number;
}

interface RecentClip {
  id: string;
  title: string;
  thumbnail: string;
  viralScore: number;
  views: number;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({ totalVideos: 0, totalClips: 0, totalViews: 0, totalEngagement: 0 });
  const [recentClips, setRecentClips] = useState<RecentClip[]>([]);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, clipsRes] = await Promise.all([
          api.get('/analytics/user'),
          api.get('/clips?limit=5')
        ]);
        if (statsRes.data?.data) setStats(statsRes.data.data);
        if (clipsRes.data?.data) setRecentClips(clipsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Vídeos Processados', value: stats.totalVideos, icon: Video, color: 'primary' },
    { label: 'Clips Gerados', value: stats.totalClips, icon: Scissors, color: 'accent' },
    { label: 'Total de Views', value: stats.totalViews.toLocaleString(), icon: TrendingUp, color: 'green' },
    { label: 'Engajamento', value: `${stats.totalEngagement}%`, icon: Users, color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">
            Olá, {user?.name || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Veja como seus clips estão performando</p>
        </div>
        <Link to="/app/videos" className="btn-primary flex items-center gap-2">
          <Play className="w-4 h-4" />
          Novo Vídeo
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold">Processar Vídeo</h3>
              <p className="text-gray-400 text-sm">IA detecta os melhores momentos</p>
            </div>
          </div>
          <Link to="/app/videos" className="btn-primary w-full block text-center">
            Começar
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold">Agendar Post</h3>
              <p className="text-gray-400 text-sm">Publique automaticamente</p>
            </div>
          </div>
          <Link to="/app/social" className="btn-secondary w-full block text-center">
            Agendar
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Motion AI</h3>
              <p className="text-gray-400 text-sm">Gere vídeos com IA</p>
            </div>
          </div>
          <Link to="/app/motion" className="btn-secondary w-full block text-center">
            Criar
          </Link>
        </motion.div>
      </div>

      {/* Recent Clips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Clips Recentes</h2>
          <Link to="/app/clips" className="text-primary-400 hover:text-primary-300 text-sm">
            Ver todos →
          </Link>
        </div>

        {recentClips.length === 0 ? (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum clip ainda</p>
            <Link to="/app/videos" className="text-primary-400 text-sm mt-2 inline-block">
              Processe seu primeiro vídeo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentClips.map((clip) => (
              <Link
                key={clip.id}
                to={`/app/editor/${clip.id}`}
                className="group glass p-4 rounded-xl hover:border-primary-500/30 transition"
              >
                <div className="aspect-video bg-[#252542] rounded-lg mb-3 overflow-hidden relative">
                  <img src={clip.thumbnail || '/placeholder.jpg'} alt={clip.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-primary-500/80 text-xs font-bold">
                    {clip.viralScore}% viral
                  </div>
                </div>
                <h4 className="font-medium truncate">{clip.title}</h4>
                <p className="text-gray-400 text-sm">{clip.views.toLocaleString()} visualizações</p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

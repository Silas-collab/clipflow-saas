import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook, Link2, Plus, Trash2, Calendar, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface SocialAccount {
  id: string;
  platform: 'youtube' | 'instagram' | 'facebook' | 'tiktok';
  username: string;
  connected: boolean;
  avatar?: string;
}

export default function Social() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/social');
        if (response.data?.data) setAccounts(response.data.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleConnect = async (platform: string) => {
    try {
      // In a real app, this would redirect to OAuth flow
      const response = await api.post('/social/connect', { platform });
      if (response.data?.data) {
        setAccounts(prev => [...prev, response.data.data]);
        toast.success(`Conta ${platform} conectada!`);
      }
    } catch (error) {
      toast.error('Erro ao conectar conta');
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await api.post(`/social/${id}/disconnect`);
      setAccounts(prev => prev.filter(a => a.id !== id));
      toast.success('Conta desconectada');
    } catch (error) {
      toast.error('Erro ao desconectar');
    }
  };

  const platformIcons = {
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
    tiktok: Link2,
  };

  const platformColors = {
    youtube: 'red',
    instagram: 'pink',
    facebook: 'blue',
    tiktok: 'cyan',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Redes Sociais</h1>
        <p className="text-gray-400 mt-1">Conecte suas contas para publicar automaticamente</p>
      </div>

      {/* Connected Accounts */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Contas Conectadas</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma conta conectada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => {
              const Icon = platformIcons[account.platform];
              const color = platformColors[account.platform];
              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 glass rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{account.platform}</p>
                      <p className="text-gray-400 text-sm">@{account.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Check className="w-4 h-4" />
                      Conectado
                    </span>
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Connect New */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Conectar Nova Conta</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['youtube', 'instagram', 'facebook', 'tiktok'] as const).map((platform) => {
            const Icon = platformIcons[platform];
            const color = platformColors[platform];
            const isConnected = accounts.some(a => a.platform === platform);
            return (
              <button
                key={platform}
                onClick={() => !isConnected && handleConnect(platform)}
                disabled={isConnected}
                className={`p-6 rounded-xl border transition flex flex-col items-center gap-3 ${
                  isConnected
                    ? 'border-green-500/50 bg-green-500/10 opacity-50'
                    : 'border-[#2D2D4A] hover:border-primary-500 bg-[#252542]'
                }`}
              >
                <Icon className={`w-8 h-8 text-${color}-400`} />
                <span className="font-medium capitalize">{platform}</span>
                {isConnected && <Check className="w-5 h-5 text-green-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Postagens Agendadas</h2>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Nenhuma postagem agendada</p>
        </div>
      </div>
    </div>
  );
}

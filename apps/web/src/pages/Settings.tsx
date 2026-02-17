import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Key, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    emailNotifications: true,
    theme: 'dark',
    language: 'pt-BR',
    model: 'openrouter/moonshotai/kimi-k2.5',
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      toast.success('Configurações salvas!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Configurações</h1>
        <p className="text-gray-400 mt-1">Gerencie sua conta e preferências</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-400 hover:bg-[#252542] hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6">Informações do Perfil</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6">Segurança</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Senha Atual</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-primary">Atualizar Senha</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6">Notificações</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-gray-400 text-sm">Receba notificações no navegador</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="w-5 h-5 accent-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Notificações por Email</p>
                    <p className="text-gray-400 text-sm">Receba atualizações por email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 accent-primary-500"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6">Aparência</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Idioma</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="input-field"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tema</label>
                  <div className="flex gap-3">
                    {['dark', 'light', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSettings({ ...settings, theme })}
                        className={`px-4 py-2 rounded-lg border transition capitalize ${
                          settings.theme === theme
                            ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                            : 'border-[#2D2D4A] hover:border-primary-500/50'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6">API Keys</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Modelo de IA</label>
                  <select
                    value={settings.model}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                    className="input-field"
                  >
                    <option value="openrouter/moonshotai/kimi-k2.5">Kimiverse (Moonshot AI)</option>
                    <option value="openai/gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                    <option value="anthropic/claude-3-opus">Anthropic Claude 3 Opus</option>
                    <option value="google/gemini-pro">Google Gemini Pro</option>
                  </select>
                  <p className="text-gray-400 text-sm mt-1">Modelo usado em todas as funcionalidades de IA</p>
                </div>
                <button className="btn-primary">Gerar Nova API Key</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

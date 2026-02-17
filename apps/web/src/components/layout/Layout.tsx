import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Video, Scissors, Globe, BarChart3, CreditCard, 
  Sparkles, Settings, LogOut, Zap, ChevronDown, User
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';

const navItems = [
  { path: '/app', icon: Home, label: 'Dashboard' },
  { path: '/app/videos', icon: Video, label: 'Vídeos' },
  { path: '/app/clips', icon: Scissors, label: 'Clips' },
  { path: '/app/social', icon: Globe, label: 'Social' },
  { path: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/app/motion', icon: Sparkles, label: 'Motion AI' },
  { path: '/app/billing', icon: CreditCard, label: 'Plano' },
  { path: '/app/settings', icon: Settings, label: 'Configurações' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] border-r border-[#2D2D4A] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#2D2D4A]">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">ClipFlow</span>
          </a>
        </div>

        {/* Credits Badge */}
        <div className="px-4 py-3 border-b border-[#2D2D4A]">
          <div className="glass px-4 py-3 rounded-xl flex items-center justify-between">
            <span className="text-sm text-gray-400">Créditos</span>
            <span className="font-bold text-primary-400">{user?.credits || 0}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                    : 'text-gray-400 hover:bg-[#252542] hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-[#2D2D4A]">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#252542] transition"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.plan || 'Free'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 glass-card rounded-xl overflow-hidden"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

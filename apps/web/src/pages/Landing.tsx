import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Zap, Users, BarChart3, Video, Sparkles, ArrowRight, Check } from 'lucide-react';

const features = [
  { icon: Video, title: 'Upload Inteligente', desc: 'Faça upload ou cole URL do YouTube' },
  { icon: Sparkles, title: 'AI Clipping', desc: 'IA detecta os melhores momentos automaticamente' },
  { icon: Zap, title: 'Viral Score', desc: 'Pontuação de viralidade para cada clip' },
  { icon: Users, title: 'Multi-Plataforma', desc: 'Publique no YouTube, Instagram, TikTok, Facebook' },
  { icon: BarChart3, title: 'Analytics', desc: 'Métricas completas de desempenho' },
  { icon: Play, title: 'Motion Graphics', desc: 'Gere vídeos com IA a partir de áudio' },
];

const plans = [
  { name: 'Free', price: 0, credits: 60, features: ['60 credits/mês', '720p export', 'Templates básicos'] },
  { name: 'Starter', price: 15, credits: 300, features: ['300 credits/mês', '1080p export', 'Todos templates', 'Analytics básico'] },
  { name: 'Pro', price: 39, credits: 1000, features: ['1000 credits/mês', '4K export', 'Analytics avançado', 'Suporte prioritário'] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold font-display">ClipFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Preços</a>
            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link to="/register" className="btn-primary">Começar Grátis</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Transforme seus vídeos em clips virais</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              <span className="gradient-text">Crie Clips</span> que
              <br />viralizam automaticamente
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Nossa IA analisa seu vídeo, identifica os melhores momentos, gera clips otimizados 
              para cada plataforma e ainda sugere legendas animadas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Começar Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Ver Demo
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 glass-card p-2"
          >
            <div className="rounded-xl overflow-hidden bg-[#1A1A2E] aspect-video relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4 glow">
                    <Play className="w-8 h-8 text-primary-400" />
                  </div>
                  <p className="text-gray-400">Dashboard Interativo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Tudo que você precisa para <span className="gradient-text">viralizar</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ferramentas profissionais de edição de vídeo com o poder da IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-primary-500/30 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Planos para <span className="gradient-text">todos os níveis</span>
            </h2>
            <p className="text-gray-400">Escolha o plano ideal para suas necessidades</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 ${i === 1 ? 'border-primary-500' : ''}`}
              >
                {i === 1 && (
                  <div className="text-xs font-medium text-primary-400 mb-2">Mais Popular</div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{plan.credits} credits/mês</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    i === 1 ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Escolher {plan.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#2D2D4A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold">ClipFlow</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 ClipFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

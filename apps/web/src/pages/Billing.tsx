import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Starter',
    price: 15,
    icon: Zap,
    features: ['300 clips/mês', 'HD Export', '5 modelos de legenda', 'Suporte por email'],
    popular: false,
  },
  {
    name: 'Pro',
    price: 39,
    icon: Crown,
    features: ['1.000 clips/mês', '4K Export', '30 modelos de legenda', 'Editor avançado', 'Analytics'],
    popular: true,
  },
  {
    name: 'Business',
    price: 99,
    icon: Building2,
    features: ['Clips ilimitados', '4K Export', 'Legendas personalizadas', 'Team collaboration', 'API Access', 'Priority support'],
    popular: false,
  },
];

export default function Billing() {
  const [currentPlan] = useState('pro');

  const handleSubscribe = (planName: string) => {
    toast.success(`Plano ${planName} selecionado! Redirecionando para pagamento...`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Planos e Billing</h1>
        <p className="text-gray-400 mt-1">Escolha o plano ideal para você</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase();
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 relative ${
                plan.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
                  Mais Popular
                </span>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-primary-500/20' : 'bg-[#2D2D4A]'
                }`}>
                  <Icon className={`w-6 h-6 ${plan.popular ? 'text-primary-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold">${plan.price}<span className="text-gray-400 text-sm">/mês</span></p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isCurrent
                    ? 'bg-green-500/20 text-green-400 cursor-default'
                    : plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {isCurrent ? 'Plano Atual' : 'Assinar Agora'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Histórico de Cobranças</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-[#2D2D4A]">
                <th className="pb-3">Data</th>
                <th className="pb-3">Descrição</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#2D2D4A]/50">
                <td className="py-4">15/01/2024</td>
                <td className="py-4">Plano Pro - Mensal</td>
                <td className="py-4">$39.00</td>
                <td className="py-4"><span className="text-green-400">Pago</span></td>
                <td className="py-4"><button className="text-primary-400 hover:underline">Recibo</button></td>
              </tr>
              <tr className="border-b border-[#2D2D4A]/50">
                <td className="py-4">15/12/2023</td>
                <td className="py-4">Plano Pro - Mensal</td>
                <td className="py-4">$39.00</td>
                <td className="py-4"><span className="text-green-400">Pago</span></td>
                <td className="py-4"><button className="text-primary-400 hover:underline">Recibo</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Seg', views: 1200 },
  { name: 'Ter', views: 1800 },
  { name: 'Qua', views: 1500 },
  { name: 'Qui', views: 2100 },
  { name: 'Sex', views: 2800 },
  { name: 'Sáb', views: 3200 },
  { name: 'Dom', views: 2900 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('7d');

  const stats = [
    { label: 'Total de Views', value: '45.2K', change: '+12.5%' },
    { label: 'Engajamento', value: '8.7%', change: '+2.3%' },
    { label: 'Compartilhamentos', value: '1.2K', change: '+8.1%' },
    { label: 'Novos Seguidores', value: '342', change: '+15.2%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Analytics</h1>
          <p className="text-gray-400 mt-1">Acompanhe o desempenho dos seus clips</p>
        </div>
        <div className="flex gap-2 bg-[#1E1E3F] p-1 rounded-lg">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                period === p ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-green-400 text-sm mt-2">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Views por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4A" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E3F', border: '1px solid #2D2D4A' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="views" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Por Plataforma</h2>
          <div className="space-y-4">
            {[
              { platform: 'YouTube', percent: 45, color: 'bg-red-500' },
              { platform: 'TikTok', percent: 30, color: 'bg-black' },
              { platform: 'Instagram', percent: 15, color: 'bg-pink-500' },
              { platform: 'Facebook', percent: 10, color: 'bg-blue-600' },
            ].map((item) => (
              <div key={item.platform}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.platform}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-2 bg-[#2D2D4A] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

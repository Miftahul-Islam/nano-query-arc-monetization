import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsDashboardProps {
  totalQueries: number;
  totalRevenue: number;
}

export function AnalyticsDashboard({ totalQueries, totalRevenue }: AnalyticsDashboardProps) {
  // Mock data for average response size
  const avgResponseSize = 1.2; // in KB
  const totalBandwidth = (totalQueries * avgResponseSize).toFixed(2);

  // Decorative Activity Wave SVG
  const generateWave = () => {
    let d = "M 0,50 ";
    for (let i = 0; i <= 100; i += 5) {
      const y = 50 + Math.sin(i * 0.2) * 20 + Math.random() * 5;
      d += `L ${i},${y} `;
    }
    return d;
  };

  return (
    <section className="p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide flex-1 min-h-0">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Activity className="w-5 h-5 text-silver-text" />
        <h2 className="text-[14px] font-bold tracking-[2px] uppercase text-white">Network Pulse</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111] border border-border-edge rounded-lg p-5 flex flex-col justify-between ai-response-panel relative overflow-hidden">
          <div className="specular-highlight"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold mb-2">Total Bandwidth</span>
          <div className="text-[24px] font-light text-white tracking-tight">{totalBandwidth} <span className="text-[12px] text-silver-text">MB</span></div>
        </div>

        <div className="bg-[#111] border border-border-edge rounded-lg p-5 flex flex-col justify-between ai-response-panel relative overflow-hidden">
          <div className="specular-highlight"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold mb-2">Cumulative Revenue</span>
          <div className="text-[24px] font-light text-white tracking-tight">{totalRevenue.toFixed(3)} <span className="text-[12px] text-silver-text">USDC</span></div>
        </div>

        <div className="bg-[#111] border border-border-edge rounded-lg p-5 flex flex-col justify-between ai-response-panel relative overflow-hidden">
          <div className="specular-highlight"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold mb-2">Uptime</span>
          <div className="text-[24px] font-light text-[#00FF00] tracking-tight">99.99<span className="text-[12px]">%</span></div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] mt-2 bg-[#111] border border-border-edge rounded-lg p-6 flex flex-col relative ai-response-panel overflow-hidden group">
        <div className="specular-highlight"></div>
        <div className="flex justify-between items-center mb-6 z-10 relative">
           <span className="text-[12px] uppercase tracking-widest text-white font-semibold flex items-center gap-2">
             <Zap className="w-4 h-4 text-silver-text" /> Nanopayment Flow
           </span>
           <span className="text-[10px] text-[#00FF00] font-mono border border-[#00FF00]/30 bg-[#00FF00]/10 px-2 py-0.5 rounded">LIVE ARC FEED</span>
        </div>
        
        <div className="flex-1 w-full relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C0C0C0" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path 
              d={generateWave()} 
              fill="none" 
              stroke="url(#waveGradient)" 
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.path 
              d={generateWave()} 
              fill="none" 
              stroke="#FFF" 
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

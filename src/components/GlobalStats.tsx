import React from 'react';

interface GlobalStatsProps {
  totalSpent: number;
  avgResponseTime: string;
  totalTxs: number;
}

export function GlobalStats({ totalSpent, avgResponseTime, totalTxs }: GlobalStatsProps) {
  return (
    <footer className="flex items-center justify-between px-6 bg-[#0A0A0A] border-t border-border-edge text-[11px] text-[#666] z-10 font-sans tracking-wide">
      <div className="flex gap-[24px]">
        <div>TOTAL SPENT: <span className="text-silver-text font-semibold">{totalSpent.toFixed(3)} USDC</span></div>
        <div>AVG RESPONSE: <span className="text-silver-text font-semibold">{avgResponseTime}</span></div>
        <div>GLOBAL TX: <span className="text-silver-text font-semibold">{totalTxs + 1248350}</span></div>
      </div>
      <div className="flex gap-[24px] items-center border-l border-[#333] pl-6 ml-6">
        <div>FINALITY: <span className="text-silver-text font-semibold">&lt; 1.0s</span></div>
        <div>GAS COST: <span className="text-silver-text font-semibold">0.0000 USDC</span></div>
        <div>THROUGHPUT: <span className="text-silver-text font-semibold">SCALING</span></div>
      </div>
      <div className="flex-1"></div>
      <div className="tracking-[1px] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse"></div>
        <span>ARC L1 RELAY: <span className="text-[#00FF00]">ONLINE</span></span>
      </div>
    </footer>
  );
}

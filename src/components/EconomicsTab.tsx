import React from 'react';
import { DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function EconomicsTab() {
  return (
    <section className="p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide flex-1 min-h-0">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <DollarSign className="w-5 h-5 text-silver-text" />
        <h2 className="text-[14px] font-bold tracking-[2px] uppercase text-white">Economics & Margins</h2>
      </div>

      <div className="bg-[#111] border border-border-edge rounded-lg p-8 flex flex-col gap-6 ai-response-panel relative overflow-hidden">
        <div className="specular-highlight"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">Margin Deep Dive</h3>
          <p className="text-silver-text text-sm">
             Why Arc is the ONLY way to make AI agents economically viable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10 mt-4">
          {/* Ethereum Comparison */}
          <div className="bg-[#1A1A1A] border border-[#ff4444]/30 rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4444]/5 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
             <div className="text-[12px] text-[#ff4444] font-bold uppercase tracking-widest flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" /> Traditional L1 (Ethereum)
             </div>
             <div className="space-y-3 mt-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#A0A0A0]">Revenue per call</span>
                  <span className="text-white font-mono">$0.001</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#A0A0A0]">L1 Gas Cost</span>
                  <span className="text-[#ff4444] font-mono">-$1.48</span>
                </div>
             </div>
             <div className="border-t border-[#331111] pt-4 mt-2 flex flex-col gap-2">
                <div className="flex justify-between font-bold items-center">
                   <span className="text-[#888] uppercase tracking-widest text-[10px]">Net Margin</span>
                   <span className="text-[#ff4444] text-xl">-147,900%</span>
                </div>
                <div className="text-[11px] text-[#ff4444] uppercase tracking-widest font-black mt-2 text-center border border-[#ff4444]/30 bg-[#ff4444]/5 py-2 rounded">
                   Business Fails
                </div>
             </div>
          </div>

          {/* Arc Comparison */}
          <div className="bg-[#1A1A1A] border border-[#00FF00]/30 rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/5 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
             <div className="text-[12px] text-[#00FF00] font-bold uppercase tracking-widest flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4" /> Arc Network
             </div>
             <div className="space-y-3 mt-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#A0A0A0]">Revenue per call</span>
                  <span className="text-white font-mono">$0.001</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#A0A0A0]">Arc USDC Fee</span>
                  <span className="text-[#00FF00] font-mono">-$0.0000</span>
                </div>
             </div>
             <div className="border-t border-[#113311] pt-4 mt-2 flex flex-col gap-2">
                <div className="flex justify-between font-bold items-center">
                   <span className="text-[#888] uppercase tracking-widest text-[10px]">Net Margin</span>
                   <span className="text-[#00FF00] text-xl">99.9%</span>
                </div>
                <div className="text-[11px] text-[#00FF00] uppercase tracking-widest font-black mt-2 text-center border border-[#00FF00]/30 bg-[#00FF00]/5 py-2 rounded">
                   Business Thrives
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

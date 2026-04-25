import React from 'react';
import { Hexagon, Store } from 'lucide-react';
import { WalletState } from '../types';

interface TopNavProps {
  walletState: WalletState;
  balance: number;
  totalTxs: number;
  isMerchantView: boolean;
  setIsMerchantView: (v: boolean) => void;
}

export function TopNav({ walletState, balance, totalTxs, isMerchantView, setIsMerchantView }: TopNavProps) {
  return (
    <nav className="flex items-center justify-between px-6 border-b border-border-edge bg-[#0f0b0a]/80 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#141414] flex items-center justify-center border border-border-edge">
          <Hexagon className="w-5 h-5 text-[#C0C0C0]" />
        </div>
        <span className="text-[18px] font-extrabold tracking-[0.1em] uppercase logo-text">NanoQuery</span>
      </div>
      
      <div className="flex items-center gap-8">
        <button 
          onClick={() => setIsMerchantView(!isMerchantView)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isMerchantView ? 'bg-[#1a1a1a] border-[#333] text-white' : 'border-transparent text-[#888] hover:text-[#C0C0C0]'}`}
        >
          <Store className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-widest font-bold">Merchant View</span>
        </button>
        {walletState !== 'disconnected' && !isMerchantView && (
          <div className="flex gap-8">
            <div className="flex items-center gap-2 text-[12px] text-silver-text">
              <span>Balance:</span>
              <strong className="text-white font-semibold">{balance.toFixed(3)} USDC</strong>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-silver-text">
              <span>Session TX:</span>
              <strong className="text-white font-semibold">{totalTxs}</strong>
            </div>
          </div>
        )}
        <div className="px-2.5 py-1 rounded-[100px] bg-[#1A1A1A] border border-[#333] text-[10px] uppercase tracking-[1px] text-[#A0A0A0] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Arc Testnet v2
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { Wallet, Copy, CheckCircle2, ShieldAlert, CircleDashed, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WalletState, Transaction } from '../types';

interface WalletSidebarProps {
  walletState: WalletState;
  walletAddress: string;
  balance: number;
  transactions: Transaction[];
  isLoadingData: boolean;
  handleConnectWallet: () => void;
  handleDeposit: () => void;
  handleSyncBalance: () => void;
  handleCopy: () => void;
  copied: boolean;
  isMerchantView?: boolean;
  handleRunEconomicProof?: () => void;
  isEconomicProofRunning?: boolean;
}

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function WalletSidebar({
  walletState,
  walletAddress,
  balance,
  transactions,
  isLoadingData,
  handleConnectWallet,
  handleDeposit,
  handleSyncBalance,
  handleCopy,
  copied,
  isMerchantView,
  handleRunEconomicProof,
  isEconomicProofRunning
}: WalletSidebarProps) {
  if (isMerchantView) {
    return (
      <aside className="border-r border-border-edge p-6 flex flex-col overflow-y-auto scrollbar-hide">
        <h3 className="text-[11px] uppercase text-silver-text font-bold mb-4 tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00FF00]" /> Agent Config
        </h3>

        <div className="flex flex-col gap-4">
          <div className="p-5 bg-[#111] border border-border-edge rounded-lg relative overflow-hidden ai-response-panel group">
            <div className="specular-highlight"></div>
            <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold mb-2">Agent Revenue</div>
            <div className="text-[28px] font-light tracking-tight text-[#00FF00]">
              {(transactions.filter(t => t.type === 'query').length * 0.001).toFixed(3)}
              <span className="text-[14px] opacity-70 ml-1 text-white">USDC</span>
            </div>
            <div className="text-[10px] text-silver-text mt-2 font-mono">L1 SETTLED</div>
          </div>

          <div className="bg-[#1A1A1A] p-4 rounded border border-[#333]">
            <h4 className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-semibold mb-2">Revenue Projection</h4>
            <div className="text-[13px] text-white">
              Projected Daily Earnings: <strong className="text-[#00FF00]">1.44 USDC</strong>
            </div>
            <div className="text-[11px] text-[#888] mt-1">
              (based on 1 query/min)
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6">
             <h3 className="text-[11px] uppercase text-[#666] mb-3 tracking-[0.05em]">Agent Status</h3>
             <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></div>
                Active & Listening
             </div>
             <p className="text-[12px] text-[#A0A0A0] mt-2">
               Your API is deployed and ready to accept paid inbound queries.
             </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-r border-border-edge p-6 flex flex-col overflow-y-auto scrollbar-hide">
      <h3 className="text-[11px] uppercase text-[#666] mb-3 tracking-[0.05em]">Wallet & Funds</h3>
      
      {isLoadingData && !walletAddress ? (
        <div className="flex flex-col gap-4">
          <div 
            className="h-24 rounded-[12px] border border-border-edge flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #222 50%, #151515 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <div className="flex flex-col items-center gap-2 z-10">
              <Loader2 className="w-5 h-5 text-silver-text animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] font-bold text-center animate-pulse">
                Finalizing Secure Session...
              </span>
            </div>
          </div>
          <div className="h-12 bg-[#1A1A1A] rounded-[6px] animate-pulse"></div>
        </div>
      ) : walletState === 'disconnected' ? (
        <div className="flex flex-col gap-4">
          <p className="text-[#A0A0A0] text-xs leading-relaxed">Connect to access pay-per-query AI infrastructure. Instantly deploy micro-transactions securely.</p>
          <button 
            onClick={handleConnectWallet}
            className="w-full py-3 px-4 bg-white text-black border-none rounded-[6px] font-semibold text-[13px] hover:bg-gray-200 transition flex justify-center items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-5 bg-bg-panel border border-border-edge rounded-[12px] mb-2">
            <div className="flex justify-between items-center mb-1">
              <div className="text-[28px] font-light tracking-[-0.5px] leading-none">
                {balance.toFixed(3)} <span className="text-[14px] opacity-50 ml-1">USDC</span>
              </div>
              <button 
                onClick={handleSyncBalance}
                title="Sync from Blockchain"
                className="hover:bg-white/10 p-1.5 rounded-full transition"
              >
                <Loader2 className="w-4 h-4 text-[#A0A0A0]" />
              </button>
            </div>
            <div className="font-mono text-[11px] text-[#555] flex justify-between items-center mt-2 pt-2 border-t border-border-edge/50">
              {formatAddress(walletAddress)}
              <button onClick={handleCopy} className="hover:text-white transition-colors">
                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {(walletState === 'zero_balance' || balance < 0.001) && (
            <div className="p-3 border border-red-900/50 bg-[#4a1a1a]/30 rounded">
              <span className="text-[#ff6666] font-mono text-[10px] block mb-2 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" /> Insufficient Funds
              </span>
              <button 
                onClick={handleDeposit}
                className="btn-send w-full py-3 border-none rounded-[6px] font-semibold text-[13px] transition text-black"
              >
                Deposit Test USDC
              </button>
            </div>
          )}
          {walletState === 'funded' && (
             <div className="flex flex-col gap-2">
               <button 
                onClick={handleDeposit}
                className="btn-send w-full py-3 border-none rounded-[6px] font-semibold text-[13px] transition text-black"
               >
                Deposit Test USDC
               </button>

               {!isMerchantView && handleRunEconomicProof && (
                 <button 
                   onClick={handleRunEconomicProof}
                   disabled={isEconomicProofRunning || balance < 0.05}
                   className={`w-full py-3 mt-2 rounded-[6px] flex items-center justify-center gap-2 text-[12px] uppercase font-bold tracking-wider transition-all relative overflow-hidden bg-transparent border ${isEconomicProofRunning ? 'border-[#0088ff] text-[#0088ff]' : 'border-[#333] text-silver-text hover:border-white hover:text-white'}`}
                 >
                   {isEconomicProofRunning ? (
                     <>
                       <div className="w-2 h-2 bg-[#0088ff] rounded-full animate-ping"></div>
                       Running (50x)
                     </>
                   ) : (
                     <>
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       Run 50x Economic Proof
                     </>
                   )}
                 </button>
               )}
             </div>
          )}
          
          <div className="text-[12px] text-[#444] mt-[10px]">
            Auto-pay enabled (0.001 / req)
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-[11px] uppercase text-[#666] mb-3 tracking-[0.05em]">Recent Deposits</h3>
        <div className="flex flex-col gap-2">
          {isLoadingData && !walletAddress ? (
            <div className="flex flex-col gap-3 animate-pulse mt-1">
              <div className="h-8 bg-[#1A1A1A] rounded"></div>
              <div className="h-8 bg-[#1A1A1A] rounded"></div>
            </div>
          ) : (
            <AnimatePresence>
            {transactions.filter(t => t.type === 'deposit').slice(0, 5).map(tx => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between items-center py-2 border-b border-[#1a1a1a]"
              >
                <div className="flex items-center gap-2">
                  {tx.status === 'CONFIRMED' ? <CheckCircle2 className="w-3 h-3 text-silver-text" /> : <CircleDashed className="w-3 h-3 text-[#A0A0A0] animate-spin" />}
                  <span className="font-mono text-xs text-[#E0E0E0]">+{tx.amount} USDC</span>
                </div>
                <span className="font-mono text-[10px] text-[#555]">{new Date(tx.timestamp).toLocaleTimeString()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
}

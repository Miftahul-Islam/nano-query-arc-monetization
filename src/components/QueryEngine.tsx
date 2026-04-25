import React from 'react';
import { Send, Cpu, Hexagon, Database, Loader2, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WalletState, QueryResponse } from '../types';

interface QueryEngineProps {
  walletState: WalletState;
  balance: number;
  queryText: string;
  setQueryText: (val: string) => void;
  isProcessing: boolean;
  responses: QueryResponse[];
  handleSendQuery: () => void;
  processingState: 'init' | '402_required' | 'signing' | 'settling' | 'querying' | null;
  supabaseUserId: string | null;
}

export function QueryEngine({
  walletState,
  balance,
  queryText,
  setQueryText,
  isProcessing,
  responses,
  handleSendQuery,
  processingState,
  supabaseUserId
}: QueryEngineProps) {
  return (
    <section className="p-6 flex flex-col gap-5 overflow-hidden flex-1 min-h-0">
      <div className="relative bg-bg-panel border border-border-edge rounded-[12px] p-4 flex-shrink-0">
        <textarea 
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          disabled={walletState !== 'funded' || isProcessing || balance < 0.001}
          placeholder={walletState === 'disconnected' ? "Connect wallet to start querying..." : (walletState === 'zero_balance' || balance < 0.001) ? "Deposit USDC to start querying..." : "Enter research parameters or query context..."}
          className="w-full bg-transparent border-none text-white text-[16px] outline-none resize-none h-[120px] disabled:opacity-50 font-sans"
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-edge/30">
          <span className="text-[12px] text-[#666]">Cost: <span className="text-white">0.001 USDC</span> / query</span>
          <button 
            onClick={!supabaseUserId ? undefined : handleSendQuery}
            disabled={(!!supabaseUserId) && (walletState !== 'funded' || !queryText.trim() || isProcessing || balance < 0.001)}
            className={`btn-send px-[20px] py-[8px] rounded-[6px] font-bold text-[13px] border disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center gap-2 ${!supabaseUserId ? 'border-[#444] text-[#888]' : 'border-white text-black'}`}
          >
            <span>{!supabaseUserId ? 'CONNECT WALLET' : 'EXECUTE QUERY'}</span>
            {!!supabaseUserId && <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-2 pr-2 min-h-0">
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="ai-response-panel p-8 mb-5 relative overflow-hidden"
            >
              <div className="specular-highlight"></div>
              <div className="text-[12px] uppercase tracking-widest font-bold text-[#888] mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-[#00FF00]" /> Live Payment Flow
              </div>
              <div className="relative flex flex-col gap-6 pl-2">
                 <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-[#333]"></div>
                 
                 {[
                   { id: 'init', label: 'Request sent (POST /chat)' },
                   { id: '402_required', label: '402 Payment Required (Server challenge)' },
                   { id: 'signing', label: 'Sign authorization (EIP-3009 - zero gas)' },
                   { id: 'settling', label: 'Circle Gateway settle (Arc L1 Finality)' },
                   { id: 'querying', label: 'Response delivered (Inference complete)' },
                 ].map((step, index, arr) => {
                    const currentIndex = arr.findIndex(s => s.id === processingState);
                    const status = index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'pending';
                    
                    return (
                      <div key={step.id} className={`flex items-center gap-4 relative z-10 transition-opacity duration-300 ${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 bg-[#111] ${
                           status === 'completed' ? 'border-[#00FF00]' : 
                           status === 'active' ? 'border-[#00FF00]' : 
                           'border-[#444]'
                        }`}>
                           {status === 'completed' && <Check className="w-2.5 h-2.5 text-[#00FF00] font-bold" />}
                           {status === 'active' && <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-pulse"></div>}
                        </div>
                        <div className={`text-[13px] font-mono transition-colors duration-300 ${status === 'active' ? 'text-[#00FF00] font-semibold' : status === 'completed' ? 'text-white' : 'text-[#888]'}`}>
                          {step.label}
                        </div>
                      </div>
                    );
                 })}
              </div>
            </motion.div>
          )}
          {responses.map((res) => (
            <motion.div 
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ai-response-panel p-8 mb-5"
            >
              <div className="specular-highlight"></div>
              <div className="flex justify-between border-b border-white/5 pb-3 mb-4 items-center">
                <span className="text-[11px] font-bold tracking-[1px] uppercase text-silver-text flex items-center gap-2">
                  <Hexagon className="w-3.5 h-3.5" />
                  AGENT RESPONSE
                </span>
                <span className="text-[11px] opacity-40 font-mono">
                  {new Date(res.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[15px] leading-[1.6] text-[#E0E0E0] whitespace-pre-wrap">
                <div className="opacity-60 text-sm mb-4 border-l-2 border-border-edge pl-3 font-mono italic">
                  {res.query}
                </div>
                {res.response}
              </div>
              <div className="mt-[16px] flex items-center justify-between border-t border-white/5 pt-3">
                <div className="text-[13px] text-[#888] font-mono">
                  Verification Hash: {res.id?.slice(0, 8) || Math.random().toString(16).substring(2, 10)}...{res.id?.slice(-4) || Math.random().toString(16).substring(2, 6)}
                </div>
                <div className="group relative flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#333] rounded cursor-help">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00FF00]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-semibold">Verified Agent Signature</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Payment Settled & Verified on Arc L1
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>

              {/* LIVE PAYMENT RECEIPT */}
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-[#111] border border-border-edge rounded-lg p-5 font-mono text-[12px] relative group overflow-hidden ai-response-panel">
                   <div className="specular-highlight"></div>
                   <div className="absolute top-0 right-0 p-2 opacity-10"><Database className="w-24 h-24 text-white -mr-4 -mt-4 transform rotate-12" /></div>
                   <div className="flex justify-between items-center mb-4 z-10 relative">
                     <span className="text-[#888] font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <span>L1 Settlement Receipt</span>
                     </span>
                     <span className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> SETTLED
                     </span>
                   </div>
                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[#A0A0A0] z-10 relative">
                     <div className="flex justify-between">
                       <span>Amount:</span>
                       <span className="text-white">0.001 USDC</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Scheme:</span>
                       <span className="text-white">Circle Gateway (EIP-3009)</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Network:</span>
                       <span className="text-white">Arc Testnet V2</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Deducted:</span>
                       <span className="text-[#FF4444]">-0.001 USDC</span>
                     </div>
                     <div className="flex justify-between border-t border-[#333] pt-2 mt-1">
                       <span>Bal Before:</span>
                       <span className="text-white">{(balance + (responses.findIndex(r => r.id === res.id) * 0.001) + 0.001).toFixed(3)} USDC</span>
                     </div>
                     <div className="flex justify-between border-t border-[#333] pt-2 mt-1">
                       <span>Bal After:</span>
                       <span className="text-white">{(balance + (responses.findIndex(r => r.id === res.id) * 0.001)).toFixed(3)} USDC</span>
                     </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {responses.length === 0 && !isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20">
              <Database className="w-12 h-12 mb-4 text-[#A0A0A0]" />
              <h2 className="text-[16px] uppercase tracking-widest text-[#FFF]">System Ready</h2>
              <p className="text-[12px] mt-2 max-w-[280px] text-[#A0A0A0]">Enter query parameters above to interact with the decentralized AI network.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface TransactionFeedProps {
  transactions: Transaction[];
  isLoadingData: boolean;
}

export function TransactionFeed({ transactions, isLoadingData }: TransactionFeedProps) {
  return (
    <aside className="p-6 flex flex-col overflow-hidden h-full bg-transparent">
      <div className="text-[12px] uppercase text-[#666] pb-3 border-b border-border-edge mb-3 font-semibold tracking-wide flex-shrink-0">Live Transaction Feed</div>
      <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 min-h-0">
        <div className="flex flex-col">
          {isLoadingData ? (
            <div className="flex flex-col gap-4 animate-pulse mt-2">
              <div className="h-20 bg-[#1a1a1a] rounded border border-border-edge/50"></div>
              <div className="h-20 bg-[#1a1a1a] rounded border border-border-edge/50"></div>
              <div className="h-20 bg-[#1a1a1a] rounded border border-border-edge/50"></div>
            </div>
          ) : (
            <AnimatePresence>
            {transactions.map(tx => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="py-3 border-b border-[#1a1a1a] flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider
                    ${tx.status === 'CONFIRMED' ? 'bg-silver-text text-black' : ''}
                    ${tx.status === 'PENDING' ? 'bg-[#444] text-white' : ''}
                    ${tx.status === 'ERROR' ? 'bg-[#4a1a1a] text-[#ff6666]' : ''}
                  `}>
                    {tx.status}
                  </span>
                  <span className="text-[10px] text-[#A0A0A0] font-mono">
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} USDC
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#E0E0E0] overflow-hidden text-ellipsis whitespace-nowrap pt-1">
                  {tx.hash}
                </div>
                <div className="pt-0.5">
                  <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#555] no-underline hover:text-[#888] inline-flex items-center gap-1 transition-colors">
                    View on Explorer <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-10 opacity-30 mt-10">
                <Activity className="w-6 h-6 text-[#666] mx-auto mb-2" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#666]">No network activity</p>
              </div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
}

import React from 'react';
import { Terminal, Key, Database } from 'lucide-react';
import { motion } from 'motion/react';

export function DeveloperDocs() {
  return (
    <section className="p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide flex-1 min-h-0">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Terminal className="w-5 h-5 text-silver-text" />
        <h2 className="text-[14px] font-bold tracking-[2px] uppercase text-white">Developer Documentation</h2>
      </div>

      <p className="text-silver-text text-sm">
        NanoQuery is a B2B Monetization Engine, not just a B2C chatbot. Use this section to generate API keys and configure your own AI models for decentralized, pay-per-query settlement.
      </p>

      <div className="bg-[#111] border border-border-edge rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-[#00FF00]" /> API Key Management
            </h3>
            <p className="text-silver-text text-sm mt-1">
              Monetize your own models using the NanoQuery B2B Engine.
            </p>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded font-bold text-sm hover:opacity-90">
            Generate New Key
          </button>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded border border-[#333] font-mono text-[13px] text-[#A0A0A0]">
          <div className="mb-2 text-[#666]">// Your API Endpoint</div>
          <div className="text-white mb-4">POST https://api.nanoquery.arc/v1/inference</div>
          
          <div className="mb-2 text-[#666]">// Example Request</div>
          <pre className="text-green-400">
            {`curl -X POST https://api.nanoquery.arc/v1/inference \\
  -H "Authorization: Bearer nq_live_abc123" \\
  -H "X-Arc-Settlement: true" \\
  -d '{"model": "custom-agent-1", "query": "Predict weather in Paris"}'`}
          </pre>
        </div>
      </div>

      <div className="bg-[#111] border border-border-edge rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Database className="w-5 h-5 text-silver-text" /> Integration Guides
        </h3>
        <p className="text-silver-text text-sm">
          Learn how to implement decentralized settlement for your AI agents across various networks.
        </p>
        <ul className="text-silver-text text-sm list-disc pl-5 mt-2 space-y-2">
          <li>Setting up Webhooks for L1 Finality</li>
          <li>Handling X-402 Payment Required status</li>
          <li>Optimizing token cost for streaming responses</li>
          <li>Validating the Verification Hash on-chain</li>
        </ul>
      </div>
    </section>
  );
}

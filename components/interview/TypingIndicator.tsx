'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 shadow-lg">
        <ShieldCheck className="w-5 h-5 text-gold-500/50" />
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none shadow-xl flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-gold-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1, 
                delay: i * 0.2 
              }}
            />
          ))}
          <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-[0.2em] ml-2"> Processing Protocol</span>
        </div>
      </div>
    </div>
  );
}
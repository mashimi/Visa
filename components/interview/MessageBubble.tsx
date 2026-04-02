'use client';

import { motion } from 'framer-motion';
import { User, ShieldCheck, Zap, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MessageBubbleProps {
  content: string;
  role: 'USER' | 'ASSISTANT';
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

export function MessageBubble({ content, role, evaluation }: MessageBubbleProps) {
  const isAssistant = role === 'ASSISTANT';

  return (
    <motion.div
      initial={{ opacity: 0, x: isAssistant ? -20 : 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "flex w-full mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] gap-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105",
            isAssistant 
              ? "bg-gradient-to-br from-gold-600 to-gold-400 text-black shadow-gold-500/20" 
              : "bg-white/5 border border-white/10 text-white shadow-white/5"
          )}>
            {isAssistant ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-black text-[var(--fg-muted)]">
            {isAssistant ? "AGENT" : "INTEL"}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className={cn(
            "relative px-6 py-4 rounded-3xl shadow-xl",
            isAssistant 
              ? "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--fg-primary)] rounded-tl-none" 
              : "bg-gold-500 text-black font-medium rounded-tr-none"
          )}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            
            {/* Glossy highlight */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* AI Evaluation - Only for User responses or following Assistant check */}
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-3"
            >
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-emerald-500/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Analysis Result</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-black text-emerald-400">
                    SCORE: {evaluation.score}%
                  </div>
                </div>
                
                <p className="text-xs text-[var(--fg-secondary)] leading-relaxed italic border-l-2 border-emerald-500/30 pl-3">
                  "{evaluation.feedback}"
                </p>

                {evaluation.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3 h-3 text-gold-500" />
                      <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Strategic Enhancements</span>
                    </div>
                    <div className="space-y-1.5">
                      {evaluation.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-2 text-[11px] text-[var(--fg-primary)] opacity-80 leading-snug">
                          <span className="text-gold-500 font-bold opacity-50">•</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
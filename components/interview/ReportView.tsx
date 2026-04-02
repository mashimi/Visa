'use client';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Download, Share2, Award, ClipboardCheck } from 'lucide-react';

interface ReportViewProps {
  report: string;
  onClose: () => void;
}

export function ReportView({ report, onClose }: ReportViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-0 rounded-3xl overflow-hidden shadow-2xl border-gold-500/30"
    >
      <div className="bg-gradient-to-r from-gold-600 to-gold-400 p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center">
            <ClipboardCheck className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-display text-black uppercase tracking-tight">Mission Debriefing</h2>
            <p className="text-black/60 text-xs font-bold uppercase tracking-[0.2em]">Agent Analyst • Case Ref: FINAL-PROTOCOL</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-black/10 hover:bg-black/20 rounded-xl transition-all text-black" title="Download Report">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 bg-black/10 hover:bg-black/20 rounded-xl transition-all text-black" title="Share Mission Logs">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-8 max-h-[500px] overflow-y-auto prose prose-invert prose-gold max-w-none scrollbar-hide">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <div className="p-6 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-8 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm uppercase tracking-widest"
        >
          Close Archive
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="btn-primary px-8 h-12 text-sm font-bold uppercase tracking-widest"
        >
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

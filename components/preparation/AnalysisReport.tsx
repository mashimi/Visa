'use client';
import { AlertTriangle, CheckCircle, Target, ChevronRight } from 'lucide-react';
import { AnalysisResult } from './ApplicationForm';

interface AnalysisReportProps {
  analysis: AnalysisResult;
  onStartInterview: () => void;
  isStarting: boolean;
}

export function AnalysisReport({ analysis, onStartInterview, isStarting }: AnalysisReportProps) {
  return (
    <div className="glass-card p-8 rounded-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gold-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Agent DS-160 • Analysis Complete</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Pre-Interview Intelligence Report</h2>
        <p className="text-[var(--fg-secondary)] text-sm mt-1">
          Review your vulnerabilities before entering the simulation chamber.
        </p>
      </div>

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Red Flags ({analysis.redFlags.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                <span className="text-red-500 mt-0.5 shrink-0">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Strengths ({analysis.strengths.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-300">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Focus Areas */}
      {analysis.suggestedFocusAreas.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Focus Areas to Prepare
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.suggestedFocusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-300">
                <span className="text-blue-500 mt-0.5 shrink-0">{i + 1}.</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onStartInterview}
        disabled={isStarting}
        className="btn-primary w-full h-14 text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20"
      >
        {isStarting ? (
          <>Initializing Interview Session...</>
        ) : (
          <>
            Enter Simulation Chamber
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}

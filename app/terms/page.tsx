'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OperationalTermsPage() {
  return (
    <div className="min-h-screen bg-pattern text-[var(--fg-primary)] selection:bg-gold-500/30 selection:text-white">
      {/* Navigation Protocol */}
      <header className="border-b border-[var(--border)] backdrop-blur-xl bg-[var(--bg-primary)]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-gold-500/20">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">Project Embassy</span>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">RETURN TO TERMINAL</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-24">
        {/* Title Header */}
        <div className="mb-20 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter uppercase italic">
            Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Terms</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-[var(--fg-muted)] font-mono text-sm tracking-widest uppercase">
            <span className="w-8 h-px bg-[var(--border)]"></span>
            SOP-PROTOCOL 2024.V1
            <span className="w-8 h-px bg-[var(--border)]"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Section 01 */}
          <section className="glass-card p-10 relative overflow-hidden group hover:border-gold-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-gold-500/10 transition-colors">01</div>
            <h2 className="text-2xl font-display font-bold text-gold-500 mb-6 tracking-wide uppercase">Simulation Integrity</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              By accessing Project Embassy, you enter an AI-augmented training environment. All responses from Agent VO and debriefs from Agent Analyst are generated using Large Language Models (LLMs). These simulations are designed for strategic preparation and do not constitute legal advice or administrative guarantees from any consulate or embassy.
            </p>
          </section>

          {/* Section 02 */}
          <section className="glass-card p-10 relative overflow-hidden group hover:border-gold-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-gold-500/10 transition-colors">02</div>
            <h2 className="text-2xl font-display font-bold text-gold-500 mb-6 tracking-wide uppercase">Operational Conduct</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed mb-6">
              Users must provide accurate representation within the "PREPARATION" phase. Any attempt to exploit the platform for the generation of deceptive documentation or to bypass consular security protocols is strictly prohibited.
            </p>
            <div className="p-4 bg-black/40 border border-[var(--border)] rounded-xl flex items-start gap-4">
              <svg className="w-6 h-6 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p className="text-sm text-[var(--fg-muted)] font-medium italic">
                Violation of Operational Integrity leads to automatic permanent exclusion from Project Embassy servers.
              </p>
            </div>
          </section>

          {/* Section 03 */}
          <section className="glass-card p-10 relative overflow-hidden group hover:border-gold-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-gold-500/10 transition-colors">03</div>
            <h2 className="text-2xl font-display font-bold text-gold-500 mb-6 tracking-wide uppercase">Proprietary Assets</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              All multi-agent mission definitions, visa-specific personas, and analysis algorithms are the exclusive property of Project Embassy. "Analyst Reports" generated for your case are intended for your individual training and may not be redistributed for commercial purposes.
            </p>
          </section>

          {/* Section 04 */}
          <section className="glass-card p-10 relative overflow-hidden group hover:border-gold-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-gold-500/10 transition-colors">04</div>
            <h2 className="text-2xl font-display font-bold text-gold-500 mb-6 tracking-wide uppercase">Liability Limitations</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              Project Embassy facilitates training. We are not responsible for actual visa outcomes, travel costs, or application fees. The simulation represents a probable model based on current mission parameters supplied at the time of session creation.
            </p>
          </section>
        </div>

        <div className="mt-20 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link href="/register">
            <Button size="lg" className="px-16 text-lg tracking-widest">ACKNOWLEDGE & PROCEED</Button>
          </Link>
          <div className="text-[var(--fg-muted)] font-mono text-xs uppercase tracking-widest">
            Last Protocol Update: AD-04-2024
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[var(--fg-muted)] text-sm tracking-widest uppercase">Project Embassy Operational Security</p>
        </div>
      </footer>
    </div>
  );
}

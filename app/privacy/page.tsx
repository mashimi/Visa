'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PrivacyProtocolPage() {
  return (
    <div className="min-h-screen bg-pattern text-[var(--fg-primary)] selection:bg-blue-500/30 selection:text-white">
      {/* Navigation Protocol */}
      <header className="border-b border-[var(--border)] backdrop-blur-xl bg-[var(--bg-primary)]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-blue-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">Project Embassy</span>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:border-blue-500 hover:text-white">RETURN TO TERMINAL</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-24">
        {/* Title Header */}
        <div className="mb-20 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter uppercase italic">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Protocol</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-[var(--fg-muted)] font-mono text-sm tracking-widest uppercase">
            <span className="w-8 h-px bg-[var(--border)]"></span>
            INFORMATION PRIVACY SECURE-88
            <span className="w-8 h-px bg-[var(--border)]"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Section 01 */}
          <div className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500 shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-blue-500/10 transition-colors">01</div>
            <h2 className="text-2xl font-display font-bold text-blue-400 mb-6 tracking-wide uppercase">Information Collection</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              We operate on a zero-retention philosophy for all input documents and transcriptions. We only collect the bare minimum identifying data necessary for authentication and session recovery via Firebase Authentication. All application data provided within simulators is transiently processed and isolated within your encrypted account vault.
            </p>
          </div>

          {/* Section 02 */}
          <div className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500 shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-blue-500/10 transition-colors">02</div>
            <h2 className="text-2xl font-display font-bold text-blue-400 mb-6 tracking-wide uppercase">Multi-Agent Processing</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed mb-6">
              When processing "MISSION: PREPARATION", your data is piped into an AI inference layer for analysis. We utilize dedicated secure endpoints that prohibit our sub-processors (DeepSeek/OpenAI) from using your data to train universal models. Your strategic preparations remain private to Project Embassy.
            </p>
            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <p className="text-sm text-[var(--fg-muted)] font-medium">
                Protocol: Transcripts are encrypted at rest with AES-256 and accessible only to your specific UID token.
              </p>
            </div>
          </div>

          {/* Section 03 */}
          <div className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500 shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-blue-500/10 transition-colors">03</div>
            <h2 className="text-2xl font-display font-bold text-blue-400 mb-6 tracking-wide uppercase">Vault Sovereignty</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              Users may initiate a "SCRUB PROTOCOL" from the dashboard, which permanently deletes all case files, interview sessions, and mission history from our servers. Once initiated, data recovery is impossible as we do not maintain long-term backups of training data.
            </p>
          </div>

          {/* Section 04 */}
          <div className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500 shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl text-white/5 font-black group-hover:text-blue-500/10 transition-colors">04</div>
            <h2 className="text-2xl font-display font-bold text-blue-400 mb-6 tracking-wide uppercase">Secure Infrastructure</h2>
            <p className="text-lg text-[var(--fg-secondary)] leading-relaxed">
              Infrastructure resides within Google Cloud Platform (GCP) and Firebase. We utilize Cloudflare to mitigate DDoS vectors. AI inference is served via encrypted tunnel TLS 1.3. For information handling inquiries, contact the Embassy Protocol Department.
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link href="/register">
            <Button size="lg" className="px-16 text-lg tracking-widest bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">ACKNOWLEDGMENT RECORDED</Button>
          </Link>
          <div className="text-[var(--fg-muted)] font-mono text-xs uppercase tracking-widest">
            Privacy Standards Update: AD-Q2-2024
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[var(--fg-muted)] text-sm tracking-widest uppercase">Project Embassy Privacy & Identity Department</p>
        </div>
      </footer>
    </div>
  );
}

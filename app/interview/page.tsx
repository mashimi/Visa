'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { ChatInterface } from '@/components/interview/ChatInterface';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentList } from '@/components/documents/DocumentList';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Shield, 
  LogOut, 
  Award, 
  TrendingUp,
  Settings,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

const VISA_TYPES = [
  { id: 'B1_B2', name: 'Tourist (B1/B2)', icon: '✈️' },
  { id: 'F1', name: 'Student (F1)', icon: '🎓' },
  { id: 'H1B', name: 'Work (H1B)', icon: '💼' },
  { id: 'J1', name: 'Exchange (J1)', icon: '🌍' },
];

const MISSIONS = [
  { id: 'MUMBAI', name: 'US Consulate, Mumbai', wait: '128 Days' },
  { id: 'BEIJING', name: 'US Embassy, Beijing', wait: '15 Days' },
  { id: 'LONDON', name: 'US Embassy, London', wait: '45 Days' },
  { id: 'LAGOS', name: 'US Consulate, Lagos', wait: '280 Days' },
];

const PERSONAS = [
  { id: 'NEUTRAL', name: 'Neutral', detail: 'Standard evaluation protocol' },
  { id: 'STRICT', name: 'Strict', detail: 'Intense 214(b) focus' },
  { id: 'HELPFUL', name: 'Helpful', detail: 'Context-seeking inquiry' },
];

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<'interview' | 'documents' | 'records'>('interview');
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('NEUTRAL');
  const [selectedMission, setSelectedMission] = useState<string>('LONDON');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [successRate, setSuccessRate] = useState<number>(0);
  const [denialRisk, setDenialRisk] = useState<number>(15);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const { user, signOut } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/interview/session', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      if (data.sessions) setPastSessions(data.sessions);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'records') {
      fetchRecords();
    }
  }, [activeTab, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-8">
        <div className="text-center glass-card p-12 rounded-3xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-4">Authentication Required</h1>
          <p className="text-[var(--fg-secondary)] max-w-xs mx-auto mb-8">
            Access to the high-fidelity simulator is restricted. Please sign in to establish a secure session.
          </p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  const startNewSession = async (visaType: string) => {
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ visaType })
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setSelectedVisa(visaType);
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  return (
    <div className="min-h-screen bg-pattern text-white">
      <div className="grid-overlay fixed inset-0 pointer-events-none opacity-20"></div>
      
      {/* Navigation Header */}
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight">ALPHA-COMMAND US</h1>
              <span className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.2em]">Department of Security • V-Sim 2.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[var(--fg-secondary)] truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
            <button 
              onClick={signOut}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-1 space-y-1">
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                    activeTab === 'interview' 
                    ? 'bg-gradient-to-r from-gold-500/20 to-transparent border-l-4 border-gold-500 text-gold-500' 
                    : 'text-[var(--fg-secondary)] hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold text-sm">Simulation Chamber</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                    activeTab === 'documents' 
                    ? 'bg-gradient-to-r from-gold-500/20 to-transparent border-l-4 border-gold-500 text-gold-500' 
                    : 'text-[var(--fg-secondary)] hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold text-sm">Document Repository</span>
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                    activeTab === 'records' 
                    ? 'bg-gradient-to-r from-gold-500/20 to-transparent border-l-4 border-gold-500 text-gold-500' 
                    : 'text-[var(--fg-secondary)] hover:bg-white/5'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span className="font-semibold text-sm">Mission Records</span>
                </button>
              </div>
            </div>

            {sessionId && (
              <div className="space-y-4">
                 <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-[var(--fg-muted)] tracking-widest uppercase">Success Probability</h3>
                      <span className="text-xl font-bold text-emerald-400 font-display">{successRate}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${successRate}%` }}
                        className="h-full bg-gradient-to-r from-gold-500 to-emerald-500"
                      />
                    </div>
                    <p className="text-[10px] text-[var(--fg-muted)] mt-4">
                      AI analysis of current session stability.
                    </p>
                 </div>

                 <div className="glass-card p-6 rounded-2xl border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[10px] font-bold text-red-500 tracking-widest uppercase">214(b) Intake Risk</h3>
                       <span className="text-sm font-bold text-red-400">{denialRisk}%</span>
                    </div>
                    <div className="text-[10px] text-[var(--fg-muted)] leading-relaxed">
                       Probability of denial based on "immigrant intent" presumption.
                    </div>
                 </div>
              </div>
            )}

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xs font-bold text-[var(--fg-muted)] tracking-widest uppercase mb-4">Current Objectives</h3>
              <div className="space-y-4">
                {[
                  { label: 'Financial Evidence', done: false },
                  { label: 'Home Ties Protocol', done: true },
                  { label: 'Travel Logic', done: false },
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border ${obj.done ? 'bg-gold-500 border-gold-500' : 'border-[var(--border)]'} flex items-center justify-center`}>
                      {obj.done && <Award className="w-3 h-3 text-black" />}
                    </div>
                    <span className={`text-sm ${obj.done ? 'text-[var(--fg-primary)] line-through' : 'text-[var(--fg-secondary)]'}`}>
                      {obj.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 mb-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Protocol Insight</span>
              </div>
              <p className="text-sm text-[var(--fg-secondary)] leading-relaxed italic">
                "Consular officers focus on section 214(b) - you must overcome the presumption of immigrant intent."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-white/10 opacity-60">
              <h3 className="text-[10px] font-bold text-[var(--fg-muted)] tracking-widest uppercase mb-4">Upcoming Modules</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 grayscale opacity-50">
                    <HelpCircle className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Mock Video Engine</span>
                 </div>
                 <div className="flex items-center gap-3 grayscale opacity-50">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Deep Background Scan</span>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'interview' ? (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {!selectedVisa ? (
                    <div className="space-y-6">
                      <div className="glass-card p-10 rounded-3xl text-center">
                        <h2 className="text-2xl font-bold font-display mb-2">Initialize Simulation</h2>
                        <p className="text-[var(--fg-secondary)] mb-8">Select the visa classification for this protocol</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {VISA_TYPES.map((visa) => (
                            <button
                              key={visa.id}
                              onClick={() => setSelectedVisa(visa.id)}
                              className={`group p-6 rounded-2xl transition-all text-center border-2 ${
                                selectedVisa === visa.id 
                                ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/10' 
                                : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-gold-500/50'
                              }`}
                            >
                              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{visa.icon}</div>
                              <div className="font-bold text-sm">{visa.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                       {selectedVisa && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="glass-card p-8 rounded-3xl">
                            <div className="flex items-center justify-between mb-6">
                               <h3 className="text-lg font-bold font-display">Mission Protocols</h3>
                               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">DS-160 Synced</span>
                               </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                               <div>
                                  <label className="text-[10px] font-bold text-[var(--fg-muted)] uppercase mb-3 block">Officer Persona Profile</label>
                                  <div className="space-y-2">
                                    {PERSONAS.map((p) => (
                                      <button
                                        key={p.id}
                                        onClick={() => setSelectedPersona(p.id)}
                                        className={`w-full flex flex-col p-4 rounded-xl border transition-all text-left ${
                                          selectedPersona === p.id
                                          ? 'bg-gold-500/10 border-gold-500'
                                          : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                      >
                                        <span className="font-bold text-xs text-gold-500">{p.name}</span>
                                        <span className="text-[10px] text-[var(--fg-secondary)] mt-0.5">{p.detail}</span>
                                      </button>
                                    ))}
                                  </div>
                               </div>

                               <div>
                                  <label className="text-[10px] font-bold text-[var(--fg-muted)] uppercase mb-3 block">Selection Mission (Consulate)</label>
                                  <div className="space-y-2">
                                    {MISSIONS.map((m) => (
                                      <button
                                        key={m.id}
                                        onClick={() => setSelectedMission(m.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                          selectedMission === m.id
                                          ? 'bg-blue-500/10 border-blue-500'
                                          : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                      >
                                        <div>
                                           <div className="font-bold text-xs text-blue-400">{m.name}</div>
                                           <div className="text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">Wait: {m.wait}</div>
                                        </div>
                                        {selectedMission === m.id && <Shield className="w-4 h-4 text-blue-400" />}
                                      </button>
                                    ))}
                                  </div>
                               </div>
                            </div>

                            <Button 
                              className="w-full h-14 text-lg font-bold mt-8 shadow-xl shadow-gold-500/20"
                              onClick={() => startNewSession(selectedVisa)}
                            >
                              Execute Alpha Protocol (US-{selectedMission})
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <ChatInterface sessionId={sessionId!} />
                  )}
                </motion.div>
              ) : activeTab === 'documents' ? (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-gold-500" />
                      Manifest Upload
                    </h2>
                    <DocumentUpload />
                  </div>
                  <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6">Archive</h2>
                    <DocumentList />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="records"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-8 rounded-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 font-display">Mission History</h2>
                  {pastSessions.length > 0 ? (
                    <div className="space-y-4">
                      {pastSessions.map((session) => (
                        <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group"
                             onClick={() => {
                               setSessionId(session.id);
                               setSelectedVisa(session.visaType);
                               setActiveTab('interview');
                             }}>
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${session.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gold-500/20 text-gold-500'}`}>
                              <Shield className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="font-bold text-sm tracking-tight">{VISA_TYPES.find(v => v.id === session.visaType)?.name || session.visaType}</div>
                               <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">{new Date(session.startedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                             <div className="text-xs font-bold text-gold-500 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Resume Protocol</div>
                             <div className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded bg-black/40 border border-white/5 ${session.status === 'COMPLETED' ? 'text-emerald-500' : 'text-gold-500'}`}>
                                {session.status}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-8 h-8 text-[var(--fg-muted)]" />
                      </div>
                      <h2 className="text-xl font-bold mb-2 font-display">No Records Found</h2>
                      <p className="text-[var(--fg-secondary)] max-w-xs mx-auto mb-8">
                        Your historical mission logs will appear here after your first completed simulation.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 py-8 border-t border-[var(--border)] mt-10">
        <div className="flex flex-wrap justify-between gap-4 text-[var(--fg-muted)] text-xs font-medium">
          <div className="flex items-center gap-6">
            <span>© 2024 V-SIMULATOR GLOBAL</span>
            <Link href="#" className="hover:text-white transition-colors">PRIVACY PROTOCOL</Link>
            <Link href="#" className="hover:text-white transition-colors">OPERATIONAL TERMS</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
              <span>SYSTEM SECURED</span>
            </div>
            <span>LATENCY: 12ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
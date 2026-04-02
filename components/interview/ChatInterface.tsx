'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { MessageBubble } from './MessageBubble';
import { RecordingButton } from './RecordingButton';
import { TypingIndicator } from './TypingIndicator';
import { ReportView } from './ReportView';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, ShieldCheck, AlertCircle, RefreshCw, Mic, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: any;
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ChatInterface({ sessionId, caseId }: { sessionId: string; caseId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<number>(50); // 0-100
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const fetchSession = async () => {
    // Prevent fetching with null or invalid sessionId
    if (!user || !sessionId || sessionId === 'null' || sessionId === 'undefined') {
      if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
        setError('No valid session ID provided');
      }
      return;
    }
    
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/interview/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMessages(data.messages || []);
      setProgress(data.progress || 0);
      setSentiment(data.overallScore || 50);
      setIsComplete(data.status === 'COMPLETED');
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Only fetch if we have a valid sessionId
    if (sessionId && sessionId !== 'null' && sessionId !== 'undefined') {
      fetchSession();
    } else {
      setError('Invalid session ID');
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [sessionId, user]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a professional sounding US voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google US English')) 
                         || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 0.9; // Lower pitch for consular authority
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    // Validate sessionId before sending
    if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
      setError('Invalid session ID. Please start a new interview session.');
      return;
    }
    
    if (!text.trim() || isComplete || !user || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: text,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ sessionId, answer: text }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: data.nextQuestion,
        createdAt: new Date(),
        evaluation: {
          score: data.score,
          feedback: data.feedback,
          suggestions: data.suggestions
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      speak(data.nextQuestion); // The Officer speaks!
      setProgress(data.progress);
      setSentiment(data.score !== undefined ? data.score : sentiment);
      setIsComplete(data.isComplete);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const generateReport = async () => {
    if (!user || !caseId) return;
    setIsGeneratingReport(true);
    setError(null);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/interview/debrief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ caseId }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setFinalReport(data.finalReport);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleVoiceInput = async (audioBlob: Blob) => {
    // transcription logic would go here
    // for now we'll just simulate or wait for backend
  };

  return (
    <div className="flex flex-col h-[700px] glass-card rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Header Info */}
      <div className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--fg-secondary)] uppercase">Live Protocol Session</span>
            </div>
          </div>
          <div className="h-4 w-[1px] bg-[var(--border)] mx-2"></div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-bold text-[var(--fg-muted)] uppercase tracking-widest">Sentiment</span>
                <div className="flex items-center gap-2">
                   <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          width: `${sentiment}%`,
                          backgroundColor: sentiment > 70 ? '#10b981' : sentiment > 40 ? '#f59e0b' : '#ef4444'
                        }}
                        className="h-full transition-colors duration-500"
                      />
                   </div>
                   <span className={`text-[10px] font-bold ${sentiment > 70 ? 'text-emerald-500' : sentiment > 40 ? 'text-gold-500' : 'text-red-500'}`}>
                      {sentiment > 70 ? 'Positive' : sentiment > 40 ? 'Neutral' : 'Negative'}
                   </span>
                </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-tighter">Progress</span>
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white w-6">{progress}%</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              evaluation={msg.evaluation}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
            <button onClick={fetchSession} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
              <RefreshCw className="w-3 h-3" />
            </button>
          </motion.div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border)]">
        {isComplete ? (
          <>
            {finalReport ? (
              <ReportView report={finalReport} onClose={() => setFinalReport(null)} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-gold-500/10 border border-gold-500/20 rounded-2xl"
              >
                <Zap className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold font-display text-gold-500 mb-2">Protocol Finalized</h3>
                <p className="text-sm text-[var(--fg-secondary)] mb-4">You have successfully completed the interview simulation. Review your global analysis in the dashboard.</p>
                <button
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="btn-primary py-2 px-8 text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Generating Specialist Analysis...
                    </>
                  ) : (
                    'Generate Final Report'
                  )}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-end gap-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-2.5 focus-within:border-gold-500/50 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Declare your travel intentions..."
                className="flex-1 bg-transparent border-none p-3 text-sm text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:ring-0 resize-none max-h-32 min-h-[48px]"
                rows={1}
                disabled={isTyping}
              />
              <div className="flex items-center gap-2 pr-2 pb-1.5">
                <button 
                  onClick={toggleListening}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                   <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                </button>
                <button 
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className={`p-2.5 rounded-xl transition-all ${
                    input.trim() && !isTyping 
                    ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' 
                    : 'bg-white/5 text-[var(--fg-muted)]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative pulse when active */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
        <Zap className="w-24 h-24 text-gold-500 blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

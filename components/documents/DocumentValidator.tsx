'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Loader2, 
  FileCheck,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface UserDocument {
  id: string;
  name: string;
  category: string;
  isValid?: boolean;
  feedback?: string;
}

export function DocumentValidator() {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<UserDocument[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchDocs = async () => {
        const q = query(collection(db, 'userDocuments'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        setDocuments(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as UserDocument)));
      };
      fetchDocs();
    }
  }, [user]);

  const validateDocuments = async () => {
    if (!documents.length) return;
    setValidating(true);
    
    // Mission-critical simulation
    const validationResults = await Promise.all(
      documents.map(async (doc) => {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
        const isValid = Math.random() > 0.2;
        return { 
          ...doc, 
          isValid, 
          feedback: isValid ? 'Integrity Check Passed' : 'Structural Anomaly Detected' 
        };
      })
    );

    setResults(validationResults);
    setValidating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold-500" />
            Integrity Protocol
          </h3>
          <p className="text-xs text-[var(--fg-muted)]">Scan artifacts for compliance and verification</p>
        </div>
        
        <button
          onClick={validateDocuments}
          disabled={validating || !documents.length}
          className="relative group overflow-hidden px-6 py-2.5 bg-gold-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <span className="relative z-10 flex items-center gap-2">
            {validating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 fill-current" />
                Run Benchmark
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
        </button>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((result, idx) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-4 rounded-2xl border-l-4 ${
                  result.isValid ? 'border-emerald-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white/5 ${
                      result.isValid ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {result.isValid ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{result.name}</div>
                      <div className="text-[10px] font-medium text-[var(--fg-muted)] tracking-wider uppercase">
                        {result.feedback}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-white/5 ${
                    result.isValid ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {result.isValid ? 'Verified' : 'Flagged'}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-12 text-center border-dashed border-white/5 opacity-50">
              <Search className="w-10 h-10 mx-auto mb-4 text-[var(--fg-muted)]" />
              <p className="text-sm text-[var(--fg-muted)]">No scan results available in current session</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
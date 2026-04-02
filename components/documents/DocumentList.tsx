'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  FileSearch,
  BadgeCheck,
  MoreVertical
} from 'lucide-react';

interface UserDocument {
  id: string;
  name: string;
  url: string;
  category: string;
  createdAt: any;
  size: number;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'userDocuments'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const docs = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as UserDocument[];
      setDocuments(docs);
      setLoading(false);
    }, (error: Error) => {
      console.error('Document fetch error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gold-500/50 uppercase tracking-[0.2em]">Synchronizing Archive</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {documents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center border border-dashed border-white/5 rounded-3xl"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileSearch className="w-8 h-8 text-[var(--fg-muted)]" />
            </div>
            <h3 className="text-white font-bold mb-1">Archive Empty</h3>
            <p className="text-sm text-[var(--fg-muted)]">No mission-critical documents detected in the current manifest.</p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc, idx) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative glass-card p-4 rounded-2xl border border-white/5 hover:border-gold-500/30 transition-all overflow-hidden"
              >
                {/* Status Glow */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/50" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                      <FileText className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {doc.name}
                        <BadgeCheck className="w-3 h-3 text-gold-500" />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">{doc.category}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] text-[var(--fg-muted)]">{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => window.open(doc.url, '_blank')}
                      className="p-2 hover:bg-white/5 rounded-lg text-[var(--fg-muted)] hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--fg-muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
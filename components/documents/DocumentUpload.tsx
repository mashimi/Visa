'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FilePlus,
  Brain
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadingDocument {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  category: string;
}

export function DocumentUpload() {
  const [uploads, setUploads] = useState<UploadingDocument[]>([]);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categorizeDocument = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('passport') || lower.includes('pp')) return 'Passport';
    if (lower.includes('bank') || lower.includes('statement') || lower.includes('financial')) return 'Financial Proof';
    if (lower.includes('employment') || lower.includes('employer') || lower.includes('job') || lower.includes('salary')) return 'Employment Letter';
    if (lower.includes('itinerary') || lower.includes('travel') || lower.includes('flight') || lower.includes('hotel')) return 'Itinerary';
    return 'Supporting Evidence';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    
    const newFiles = Array.from(e.target.files);
    const newUploadEntries = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'uploading' as const,
      category: categorizeDocument(file.name)
    }));

    setUploads(prev => [...newUploadEntries, ...prev]);

    for (const entry of newUploadEntries) {
      try {
        const idToken = await user.getIdToken();
        const formData = new FormData();
        formData.append('documents', entry.file);

        // Stealth Intelligence Ingest
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${idToken}` },
          body: formData
        });

        if (!response.ok) throw new Error('Protocol rejected mission files');
        
        setUploads(prev => prev.map(u => u.id === entry.id ? { 
          ...u, 
          status: 'completed', 
          progress: 100 
        } : u));

      } catch (err: any) {
        setUploads(prev => prev.map(u => u.id === entry.id ? { 
          ...u, 
          status: 'error', 
          error: err.message || 'Mission artifact transmission failure' 
        } : u));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-teal-400/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative glass-card border-2 border-dashed border-[var(--border)] hover:border-gold-500/50 p-10 rounded-3xl text-center transition-all">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-8 h-8 text-gold-500" />
          </div>
          <h3 className="text-lg font-bold font-display text-white mb-2">Ingest Mission Intelligence</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-1">Upload mission-critical artifacts to be synthesized into Agent context</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-[9px] text-gold-500/50 font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-gold-500/20 rounded bg-gold-500/5">Stealth Ingest Protocol Active • No Binary Storage</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-wider pl-1">Live Manifest Pipeline</h4>
            {uploads.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-4 rounded-2xl border border-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <FilePlus className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[180px]">{upload.file.name}</div>
                      <div className="text-[10px] text-[var(--fg-muted)] font-medium">{upload.category}</div>
                    </div>
                  </div>
                  
                  {upload.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : upload.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
                  )}
                </div>

                <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      upload.status === 'error' ? "bg-red-500" : "bg-gradient-to-r from-gold-600 to-gold-400"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${upload.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
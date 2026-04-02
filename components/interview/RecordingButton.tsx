'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecordingButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function RecordingButton({ onRecordingComplete, disabled }: RecordingButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (disabled) return;
    
    try {
      setIsInitializing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative group">
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute -inset-2 bg-red-500/20 rounded-2xl blur-xl"
          />
        )}
      </AnimatePresence>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isInitializing}
        className={cn(
          "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
          isRecording 
            ? "bg-red-500 text-white shadow-red-500/30 scale-110" 
            : "bg-white/5 border border-white/10 text-[var(--fg-muted)] hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        {isInitializing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <motion.div
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Square className="w-4 h-4 fill-current" />
          </motion.div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Waveform indicator when recording */}
      {isRecording && (
        <div className="absolute top-1/2 left-[calc(100%+12px)] -translate-y-1/2 flex gap-0.5 items-center h-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-red-400 rounded-full"
              animate={{ height: [4, 16, 4] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
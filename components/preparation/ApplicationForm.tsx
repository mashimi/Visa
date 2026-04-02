'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { TravelInfoStep } from './steps/TravelInfoStep';
import { EmploymentInfoStep } from './steps/EmploymentInfoStep';
import { useAuth } from '@/components/auth/FireAuthProvider';
import { getVisaDefinitionById } from '@/lib/ai/visa-definitions';
import { Loader2, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export interface ApplicationData {
  personal?: { fullName: string; nationality: string; maritalStatus: string };
  travel?: { purpose: string; arrivalDate: string; duration: string; usAddress: string };
  employment?: { occupation: string; employerName: string; monthlyIncomeUSD: string };
  financials?: { tripSponsor: string; availableFundsUSD: string };
}

export interface AnalysisResult {
  redFlags: string[];
  strengths: string[];
  suggestedFocusAreas: string[];
}

interface ApplicationFormProps {
  visaId: string;
  missionId: string;
  onAnalysisComplete: (caseId: string, analysis: AnalysisResult) => void;
}

const STEPS = ['Personal', 'Travel', 'Employment'];

export function ApplicationForm({ visaId, missionId, onAnalysisComplete }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const visa = getVisaDefinitionById(visaId);

  const handleNext = (data: any) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(updated);
    }
  };

  const handleSubmit = async (finalData: ApplicationData) => {
    if (!user) return;
    setIsSubmitting(true);
    setError('');
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/preparation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ visaId, missionId, applicationData: finalData }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Analysis failed');
      onAnalysisComplete(result.caseId, result.analysis);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfoStep onNext={handleNext} />;
      case 1: return <TravelInfoStep onNext={handleNext} />;
      case 2: return <EmploymentInfoStep onNext={handleNext} />;
      default: return null;
    }
  };

  if (isSubmitting) {
    return (
      <div className="glass-card p-16 rounded-3xl text-center">
        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
        </div>
        <h3 className="text-2xl font-bold font-display text-white mb-3">Agent DS-160 Analysing...</h3>
        <p className="text-[var(--fg-secondary)] max-w-sm mx-auto">
          Your application data is being reviewed for potential red flags and inconsistencies before the interview.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gold-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Agent DS-160 • Pre-Interview Analysis</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Build Your Case File</h2>
        <p className="text-[var(--fg-secondary)] mt-1 text-sm">
          Preparing for: <span className="text-white font-semibold">{visa?.name || visaId}</span>
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  index < currentStep
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : index === currentStep
                    ? 'border-gold-500 text-gold-500'
                    : 'border-[var(--border)] text-[var(--fg-muted)]'
                }`}
              >
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${
                  index <= currentStep ? 'text-gold-500' : 'text-[var(--fg-muted)]'
                }`}
              >
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 ${index < currentStep ? 'bg-gold-500' : 'bg-[var(--border)]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

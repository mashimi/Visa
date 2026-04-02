'use client';
import { useState } from 'react';

interface PersonalInfoStepProps {
  onNext: (data: { personal: { fullName: string; nationality: string; maritalStatus: string } }) => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const [fullName, setFullName] = useState('');
  const [nationality, setNationality] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ personal: { fullName, nationality, maritalStatus } });
  };

  const inputClass =
    'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--fg-muted)] focus:outline-none focus:border-gold-500 transition-colors';
  const labelClass = 'block text-xs font-bold text-[var(--fg-muted)] uppercase tracking-widest mb-2';

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="As it appears on your passport"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Country of Nationality</label>
        <input
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="e.g., Nigeria, India, Brazil"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Marital Status</label>
        <select
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          className={inputClass}
        >
          <option>Single</option>
          <option>Married</option>
          <option>Divorced</option>
          <option>Widowed</option>
        </select>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn-primary w-full h-12 text-sm font-bold">
          Continue →
        </button>
      </div>
    </form>
  );
}

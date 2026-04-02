'use client';
import { useState } from 'react';

interface EmploymentInfoStepProps {
  onNext: (data: {
    employment: { occupation: string; employerName: string; monthlyIncomeUSD: string };
    financials: { tripSponsor: string; availableFundsUSD: string };
  }) => void;
}

export function EmploymentInfoStep({ onNext }: EmploymentInfoStepProps) {
  const [occupation, setOccupation] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState('');
  const [tripSponsor, setTripSponsor] = useState('Self');
  const [availableFundsUSD, setAvailableFundsUSD] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      employment: { occupation, employerName, monthlyIncomeUSD },
      financials: { tripSponsor, availableFundsUSD },
    });
  };

  const inputClass =
    'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--fg-muted)] focus:outline-none focus:border-gold-500 transition-colors';
  const labelClass = 'block text-xs font-bold text-[var(--fg-muted)] uppercase tracking-widest mb-2';

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div>
        <label className={labelClass}>Occupation / Job Title</label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          placeholder="e.g., Software Engineer, Teacher, Business Owner"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Employer / Company Name</label>
        <input
          type="text"
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
          placeholder="e.g., Tech Solutions Ltd., Self-Employed"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Monthly Income (USD equivalent)</label>
        <input
          type="number"
          value={monthlyIncomeUSD}
          onChange={(e) => setMonthlyIncomeUSD(e.target.value)}
          placeholder="e.g., 4500"
          min="0"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Trip Sponsor</label>
        <select
          value={tripSponsor}
          onChange={(e) => setTripSponsor(e.target.value)}
          className={inputClass}
        >
          <option>Self</option>
          <option>Employer</option>
          <option>Family Member</option>
          <option>Host</option>
          <option>Scholarship / Institution</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Available Funds for Trip (USD)</label>
        <input
          type="number"
          value={availableFundsUSD}
          onChange={(e) => setAvailableFundsUSD(e.target.value)}
          placeholder="e.g., 8000"
          min="0"
          required
          className={inputClass}
        />
      </div>
      <div className="pt-2">
        <button type="submit" className="btn-primary w-full h-12 text-sm font-bold">
          Submit for Analysis →
        </button>
      </div>
    </form>
  );
}

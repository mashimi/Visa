'use client';
import { useState } from 'react';

interface TravelInfoStepProps {
  onNext: (data: { travel: { purpose: string; arrivalDate: string; duration: string; usAddress: string } }) => void;
}

export function TravelInfoStep({ onNext }: TravelInfoStepProps) {
  const [purpose, setPurpose] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [duration, setDuration] = useState('');
  const [usAddress, setUsAddress] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ travel: { purpose, arrivalDate, duration, usAddress } });
  };

  const inputClass =
    'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--fg-muted)] focus:outline-none focus:border-gold-500 transition-colors';
  const labelClass = 'block text-xs font-bold text-[var(--fg-muted)] uppercase tracking-widest mb-2';

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div>
        <label className={labelClass}>Purpose of Travel</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Tourism, Business conference, Visit family"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Intended Arrival Date</label>
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Length of Stay (days)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 14"
          min="1"
          max="365"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Address / Accommodation in Destination</label>
        <input
          type="text"
          value={usAddress}
          onChange={(e) => setUsAddress(e.target.value)}
          placeholder="e.g., Hilton Hotel, 123 Main St, New York"
          required
          className={inputClass}
        />
      </div>
      <div className="pt-2">
        <button type="submit" className="btn-primary w-full h-12 text-sm font-bold">
          Continue →
        </button>
      </div>
    </form>
  );
}

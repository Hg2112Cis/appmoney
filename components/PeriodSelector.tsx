import React from 'react';
import { TimePeriod } from '../types';
import { PERIODS } from '../constants';

interface PeriodSelectorProps {
  currentPeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentPeriod, onChange }) => {
  return (
    <div className="flex bg-surface rounded-2xl p-1 shadow-sm w-full">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id as TimePeriod)}
          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
            currentPeriod === p.id
              ? 'bg-primary text-black shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
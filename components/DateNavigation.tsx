import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimePeriod } from '../types';
import { getPeriodLabel } from '../utils/dateUtils';

interface DateNavigationProps {
  currentDate: Date;
  period: TimePeriod;
  onNavigate: (direction: 1 | -1) => void;
}

export const DateNavigation: React.FC<DateNavigationProps> = ({ currentDate, period, onNavigate }) => {
  return (
    <div className="flex items-center justify-between px-2 py-0">
      <button 
        onClick={() => onNavigate(-1)}
        className="p-1 rounded-full bg-surface text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <h2 className="text-sm font-bold text-white capitalize">
        {getPeriodLabel(currentDate, period)}
      </h2>

      <button 
        onClick={() => onNavigate(1)}
        className="p-1 rounded-full bg-surface text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
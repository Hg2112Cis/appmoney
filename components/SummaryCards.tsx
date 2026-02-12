import React from 'react';
import { PeriodStats } from '../types';

interface SummaryCardsProps {
  stats: PeriodStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-2 px-4">
      <div className="col-span-2 bg-surface p-3 rounded-2xl shadow-lg border border-white/5 relative overflow-hidden flex items-center justify-between">
         {/* Decorative background circle */}
         <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
         
         <div className="z-10">
           <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Balance Total</p>
           <p className={`text-2xl font-bold mt-0.5 ${stats.balance >= 0 ? 'text-white' : 'text-error'}`}>
              {stats.balance >= 0 ? '' : '-'}${Math.abs(stats.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
           </p>
         </div>
      </div>

      <div className="bg-surface p-3 rounded-2xl shadow-md border-l-4 border-income">
        <p className="text-gray-400 text-[10px] uppercase tracking-wide">Ingresos</p>
        <p className="text-income text-base font-bold mt-0.5">
          +${stats.income.toLocaleString()}
        </p>
      </div>

      <div className="bg-surface p-3 rounded-2xl shadow-md border-l-4 border-expense">
        <p className="text-gray-400 text-[10px] uppercase tracking-wide">Gastos</p>
        <p className="text-expense text-base font-bold mt-0.5">
          -${stats.expense.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
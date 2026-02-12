import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { ALL_CATEGORIES } from '../constants';

interface ChartSectionProps {
  transactions: Transaction[];
  activeType: TransactionType;
  onToggle: () => void;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ transactions, activeType, onToggle }) => {
  // Process data for both types
  const { expenseData, incomeData, expenseTotal, incomeTotal } = useMemo(() => {
    const expenses: Record<string, number> = {};
    const incomes: Record<string, number> = {};
    let expTotal = 0;
    let incTotal = 0;

    transactions.forEach(t => {
      const cat = ALL_CATEGORIES.find(c => c.id === t.categoryId);
      if (!cat) return;
      
      const amount = Number(t.amount);
      if (cat.type === 'expense') {
        expenses[cat.id] = (expenses[cat.id] || 0) + amount;
        expTotal += amount;
      } else {
        incomes[cat.id] = (incomes[cat.id] || 0) + amount;
        incTotal += amount;
      }
    });

    const formatData = (map: Record<string, number>) => {
      return Object.keys(map).map(id => {
        const cat = ALL_CATEGORIES.find(c => c.id === id);
        return {
          name: cat?.name || 'Desconocido',
          value: map[id],
          color: cat?.color || '#888',
        };
      }).sort((a, b) => b.value - a.value);
    };

    return {
      expenseData: formatData(expenses),
      incomeData: formatData(incomes),
      expenseTotal: expTotal,
      incomeTotal: incTotal
    };
  }, [transactions]);

  // If no data at all
  if (expenseTotal === 0 && incomeTotal === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-gray-500 text-sm">
        <p>No hay datos en este periodo</p>
      </div>
    );
  }

  // Determine which data is Outer (Active) and which is Inner (Inactive)
  const outerData = activeType === 'expense' ? expenseData : incomeData;
  const innerData = activeType === 'expense' ? incomeData : expenseData;

  return (
    <div className="h-52 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Inner Circle (Inactive Type) */}
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={60}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            opacity={0.3} // Always dim the inner one
          >
            {innerData.map((entry, index) => (
              <Cell key={`cell-inner-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Outer Circle (Active Type) */}
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            opacity={1} // Always bright
          >
            {outerData.map((entry, index) => (
              <Cell key={`cell-outer-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
             formatter={(value: number) => `$${value.toLocaleString()}`}
             contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
             itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Interactive Center */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <button 
          onClick={onToggle}
          className="pointer-events-auto flex flex-col items-center justify-center w-24 h-24 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm transition-all active:scale-95 group border border-white/5"
        >
           {/* Active Value */}
           <div className={`flex flex-col items-center ${activeType === 'expense' ? 'order-1' : 'order-3'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${activeType === 'expense' ? 'text-expense' : 'text-income'}`}>
                {activeType === 'expense' ? 'Gastos' : 'Ingresos'}
              </span>
              <span className={`text-base font-bold ${activeType === 'expense' ? 'text-expense' : 'text-income'}`}>
                ${(activeType === 'expense' ? expenseTotal : incomeTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
           </div>

           {/* Divider */}
           <div className="w-6 h-[1px] bg-white/20 my-0.5 order-2"></div>

           {/* Inactive Value */}
           <div className={`flex flex-col items-center ${activeType === 'expense' ? 'order-3 opacity-50' : 'order-1 opacity-50'}`}>
              <span className="text-[8px] font-medium uppercase tracking-widest text-gray-400">
                {activeType === 'expense' ? 'Ingresos' : 'Gastos'}
              </span>
              <span className="text-xs font-medium text-gray-400">
                ${(activeType === 'expense' ? incomeTotal : expenseTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
           </div>
        </button>
      </div>
    </div>
  );
};
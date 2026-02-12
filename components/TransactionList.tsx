import React, { useState, useMemo } from 'react';
import { Transaction, Category } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { Trash2, Layers, List } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [viewMode, setViewMode] = useState<'categories' | 'history'>('categories');

  // --- Derived State: Grouped Data ---
  const groupedData = useMemo(() => {
    const map = new Map<string, { category: Category; total: number; count: number }>();

    transactions.forEach((t) => {
      const cat = ALL_CATEGORIES.find((c) => c.id === t.categoryId);
      if (!cat) return;

      const current = map.get(cat.id) || { category: cat, total: 0, count: 0 };
      map.set(cat.id, {
        category: cat,
        total: current.total + Number(t.amount),
        count: current.count + 1,
      });
    });

    // Sort by total amount descending
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [transactions]);

  // --- Derived State: Sorted History ---
  const sortedHistory = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-block p-4 rounded-full bg-surface mb-3">
          <span className="text-2xl grayscale opacity-50">💸</span>
        </div>
        <p className="text-gray-500">No hay transacciones para este periodo.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      {/* View Toggle */}
      <div className="flex bg-surface p-1 rounded-xl mb-4">
        <button
          onClick={() => setViewMode('categories')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'categories' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Layers size={16} /> Categorías
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'history' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <List size={16} /> Historial
        </button>
      </div>

      {/* --- CATEGORIES VIEW --- */}
      {viewMode === 'categories' && (
        <div className="space-y-3 animate-fade-in">
          {groupedData.map(({ category, total, count }) => {
             const isExpense = category.type === 'expense';
             return (
              <div key={category.id} className="bg-surface rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${category.color}33` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{category.name}</p>
                    <p className="text-xs text-gray-500">{count} {count === 1 ? 'transacción' : 'transacciones'}</p>
                  </div>
                </div>
                <span className={`font-bold text-lg ${isExpense ? 'text-expense' : 'text-income'}`}>
                  {isExpense ? '-' : '+'}${total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* --- HISTORY VIEW --- */}
      {viewMode === 'history' && (
        <div className="space-y-3 animate-fade-in">
          {sortedHistory.map((transaction) => {
            const category = ALL_CATEGORIES.find((c) => c.id === transaction.categoryId);
            const isExpense = category?.type === 'expense';

            return (
              <div key={transaction.id} className="bg-surface rounded-xl p-4 flex items-center justify-between shadow-sm group">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-opacity-20"
                    style={{ backgroundColor: `${category?.color}33` }}
                  >
                    {category?.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{category?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                      {transaction.note ? ` • ${transaction.note}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-bold ${isExpense ? 'text-expense' : 'text-income'}`}>
                    {isExpense ? '-' : '+'}${transaction.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-gray-600 hover:text-error transition-colors p-2 rounded-full hover:bg-white/5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
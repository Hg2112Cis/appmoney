import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Transaction, TimePeriod, TransactionType } from './types';
import { ALL_CATEGORIES } from './constants';
import { filterTransactionsByPeriod, shiftDate } from './utils/dateUtils';
import { PeriodSelector } from './components/PeriodSelector';
import { DateNavigation } from './components/DateNavigation';
import { SummaryCards } from './components/SummaryCards';
import { ChartSection } from './components/ChartSection';
import { TransactionList } from './components/TransactionList';
import { AddModal } from './components/AddModal';
import { DataModal } from './components/DataModal';

const App: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finvibe_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [period, setPeriod] = useState<TimePeriod>('day');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  
  // PWA Install Prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  // Track which view is active in the chart (Expense or Income)
  const [activeChartType, setActiveChartType] = useState<TransactionType>('expense');

  // Persistence
  useEffect(() => {
    localStorage.setItem('finvibe_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Listen for PWA install event
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handlers
  const handleNavigate = (direction: 1 | -1) => {
    setCurrentDate(prev => shiftDate(prev, period, direction));
  };

  const handleAddTransaction = (amount: number, categoryId: string, note: string, date: string, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      categoryId,
      note,
      date,
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleImportTransactions = (imported: Transaction[]) => {
    // Merge strategy: Add all imported. 
    // Ideally we might check for duplicates by ID, but for simplicity we append.
    // If IDs collide, we can filter.
    setTransactions(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newUnique = imported.filter(t => !existingIds.has(t.id));
      return [...prev, ...newUnique];
    });
  };

  // Derived State
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByPeriod(transactions, currentDate, period);
  }, [transactions, currentDate, period]);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach(t => {
      const cat = ALL_CATEGORIES.find(c => c.id === t.categoryId);
      if (cat?.type === 'income') {
        income += Number(t.amount);
      } else if (cat?.type === 'expense') {
        expense += Number(t.amount);
      }
    });

    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const toggleChartType = () => {
    setActiveChartType(prev => prev === 'expense' ? 'income' : 'expense');
  };

  return (
    <div className="min-h-screen pb-6 bg-background text-gray-100 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top Header - Compact */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-white/5 shadow-md">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FinVibe
          </h1>
          <button 
            onClick={() => setIsDataModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
        
        {/* Compact Controls */}
        <div className="px-4 pb-2 space-y-2">
          <PeriodSelector currentPeriod={period} onChange={setPeriod} />
          <DateNavigation 
            currentDate={currentDate} 
            period={period} 
            onNavigate={handleNavigate} 
          />
        </div>
      </div>

      <div className="pt-3 flex-1 animate-fade-in">
        {/* Dashboard */}
        <div className="mb-3">
          <SummaryCards stats={stats} />
        </div>

        {/* Visualization */}
        <div className="mb-3 px-4">
          <div className="bg-surface rounded-2xl p-2 shadow-sm border border-white/5">
             <ChartSection 
                transactions={filteredTransactions} 
                activeType={activeChartType}
                onToggle={toggleChartType}
             />
          </div>
        </div>

        {/* Add Button - Compact margin */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            Añadir Transacción
          </button>
        </div>

        {/* Transactions */}
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={handleDeleteTransaction} 
        />
      </div>

      {/* Add Modal */}
      <AddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTransaction} 
        initialType={activeChartType}
      />

      {/* Data Management Modal */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        transactions={transactions}
        onImport={handleImportTransactions}
        installPrompt={installPrompt}
        onInstallClear={() => setInstallPrompt(null)}
      />
    </div>
  );
};

export default App;
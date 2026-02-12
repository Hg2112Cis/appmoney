import React, { useState, useEffect } from 'react';
import { X, Check, CalendarClock } from 'lucide-react';
import { TransactionType, RecurrenceFrequency } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, categoryId: string, note: string, date: string, type: TransactionType, recurrence: RecurrenceFrequency) => void;
  initialType?: TransactionType;
}

export const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onSave, initialType = 'expense' }) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>('none');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount('');
      setNote('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      setRecurrence('none');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    
    onSave(parseFloat(amount), categoryId, note, date, type, recurrence);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Nueva Transacción</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
            <X size={20} />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-black/30 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'expense' ? 'bg-expense text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Gasto
          </button>
          <button
            onClick={() => { setType('income'); setCategoryId(''); }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'income' ? 'bg-income text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Ingreso
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">Cantidad</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 font-light">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-background border border-white/10 rounded-xl py-4 pl-10 pr-4 text-3xl font-bold text-white focus:outline-none focus:border-primary placeholder-gray-600"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Categoría</label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                    categoryId === cat.id
                      ? 'bg-white/10 border-primary scale-105'
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">Repetir</label>
              <div className="relative">
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrenceFrequency)}
                  className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="none">No repetir</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensualmente</option>
                  <option value="yearly">Anualmente</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <CalendarClock size={16} />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">Nota (Opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detalles..."
              className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!amount || !categoryId}
            className="w-full py-4 mt-4 bg-primary text-black font-bold text-lg rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};
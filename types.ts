export type TransactionType = 'expense' | 'income';

export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO string
  note: string;
}

export interface PeriodStats {
  income: number;
  expense: number;
  balance: number;
}

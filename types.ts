export type TransactionType = 'expense' | 'income';

export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  endDate?: string; // ISO string - optional end date for the recurrence
  isActive: boolean;
  lastGeneratedDate?: string; // ISO string - tracks when the last occurrence was generated
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO string - the original/creation date
  note: string;
  type: TransactionType;
  recurrence?: RecurrenceConfig; // Complete recurrence configuration
  nextOccurrence?: string; // ISO string for the next trigger date
  parentTransactionId?: string; // If this was generated from a recurring one
}

export interface PeriodStats {
  income: number;
  expense: number;
  balance: number;
}
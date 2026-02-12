import { TimePeriod, RecurrenceFrequency } from '../types';

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getPeriodLabel = (date: Date, period: TimePeriod): string => {
  const locale = 'es-ES'; // Spanish locale as per prompt language context
  
  switch (period) {
    case 'day':
      return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    case 'week': {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay() + 1); // Start Monday
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getDate()} ${start.toLocaleDateString(locale, { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString(locale, { month: 'short' })}`;
    }
    case 'month':
      return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    default:
      return '';
  }
};

export const filterTransactionsByPeriod = <T extends { date: string }>(
  items: T[],
  currentDate: Date,
  period: TimePeriod
): T[] => {
  const targetTime = currentDate.getTime();
  
  return items.filter(item => {
    const itemDate = new Date(item.date);
    const itemTime = itemDate.getTime();

    switch (period) {
      case 'day':
        return itemDate.toDateString() === currentDate.toDateString();
      case 'week': {
        const start = new Date(currentDate);
        const day = start.getDay() || 7; // Get current day number, make Sunday (0) the 7th day
        if (day !== 1) start.setHours(-24 * (day - 1)); // Set to previous Monday
        else start.setHours(0,0,0,0);
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        
        return itemTime >= start.getTime() && itemTime <= end.getTime();
      }
      case 'month':
        return itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear();
      case 'year':
        return itemDate.getFullYear() === currentDate.getFullYear();
      default:
        return false;
    }
  });
};

export const shiftDate = (date: Date, period: TimePeriod, direction: 1 | -1): Date => {
  const newDate = new Date(date);
  switch (period) {
    case 'day':
      newDate.setDate(date.getDate() + direction);
      break;
    case 'week':
      newDate.setDate(date.getDate() + (direction * 7));
      break;
    case 'month':
      newDate.setMonth(date.getMonth() + direction);
      break;
    case 'year':
      newDate.setFullYear(date.getFullYear() + direction);
      break;
  }
  return newDate;
};

export const getNextRecurrenceDate = (dateStr: string, frequency: RecurrenceFrequency): string => {
  const date = new Date(dateStr);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'none':
    default:
      return dateStr;
  }
  
  return formatDate(date);
};
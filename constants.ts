import { Category } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp_asesor', name: 'ASESOR', icon: '⚖️', color: '#FF7043', type: 'expense' },
  { id: 'exp_sustituciones', name: 'SUSTITUCIONES', icon: '🔄', color: '#FFA726', type: 'expense' },
  { id: 'exp_loteria', name: 'LOTERIA', icon: '🎰', color: '#AB47BC', type: 'expense' },
  { id: 'exp_bicicleta', name: 'BICICLETA', icon: '🚲', color: '#26C6DA', type: 'expense' },
  { id: 'exp_salud', name: 'SALUD', icon: '🏥', color: '#EF5350', type: 'expense' },
  { id: 'exp_coche', name: 'COCHE', icon: '🚗', color: '#78909C', type: 'expense' },
  { id: 'exp_restaurante', name: 'RESTAURANTE', icon: '🍴', color: '#FFCA28', type: 'expense' },
  { id: 'exp_ocio', name: 'OCIO', icon: '🎭', color: '#5C6BC0', type: 'expense' },
  { id: 'exp_impuestos', name: 'IMPUESTOS', icon: '💸', color: '#8D6E63', type: 'expense' },
  { id: 'exp_viajes', name: 'VIAJES', icon: '✈️', color: '#42A5F5', type: 'expense' },
  { id: 'exp_ropa', name: 'ROPA', icon: '👕', color: '#EC407A', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'inc_minuta', name: 'MINUTA', icon: '📄', color: '#66BB6A', type: 'income' },
  { id: 'inc_sustituciones', name: 'SUSTITUCIONES', icon: '🔄', color: '#9CCC65', type: 'income' },
  { id: 'inc_costas', name: 'COSTAS', icon: '🏛️', color: '#26A69A', type: 'income' },
  { id: 'inc_turnos', name: 'TURNOS', icon: '📅', color: '#29B6F6', type: 'income' },
  { id: 'inc_devoluciones', name: 'DEVOLUCIONES', icon: '💰', color: '#7E57C2', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const PERIODS = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
  { id: 'year', label: 'Año' },
];
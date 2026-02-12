import { Transaction } from '../types';
import { ALL_CATEGORIES } from '../constants';

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  // Header: ID, Date, Type, Category Name, Amount, Note, Category ID
  const headers = ['ID', 'Fecha', 'Tipo', 'Categoria', 'Cantidad', 'Nota', 'CategoriaID'];
  
  // Rows
  const rows = transactions.map(t => {
    const category = ALL_CATEGORIES.find(c => c.id === t.categoryId);
    const categoryName = category ? category.name : 'Desconocido';
    const type = category ? (category.type === 'expense' ? 'Gasto' : 'Ingreso') : 'Gasto';
    
    // Escape quotes for CSV format (replace " with "") and wrap in quotes
    const cleanNote = t.note ? `"${t.note.replace(/"/g, '""')}"` : '';
    const cleanCatName = `"${categoryName}"`;
    
    return [
      t.id,
      t.date,
      type,
      cleanCatName,
      t.amount.toString(),
      cleanNote,
      t.categoryId
    ].join(',');
  });

  // Combine header and rows
  const csvContent = [headers.join(','), ...rows].join('\n');
  return csvContent;
};

export const parseCSVToTransactions = (csvText: string): Transaction[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return []; // Header only or empty

  const transactions: Transaction[] = [];
  
  // Start from 1 to skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Regex to split by comma, ignoring commas inside quotes
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    // Expected structure based on export:
    // [0]ID, [1]Fecha, [2]Tipo, [3]Categoria, [4]Cantidad, [5]Nota, [6]CategoriaID
    if (cols.length < 5) continue;

    const [id, date, typeStr, catName, amountStr, note, catId] = cols;

    const amount = parseFloat(amountStr);
    if (isNaN(amount)) continue;

    // Resolve Category ID
    let finalCatId = catId;
    
    // If importing from a file where CategoryID might be missing or different, try to match by name
    if (!finalCatId || !ALL_CATEGORIES.find(c => c.id === finalCatId)) {
       const found = ALL_CATEGORIES.find(c => c.name.toLowerCase() === catName.toLowerCase());
       if (found) finalCatId = found.id;
       else finalCatId = 'exp_ocio'; // Default fallback if category unknown
    }

    transactions.push({
      id: id && id.length > 5 ? id : crypto.randomUUID(), // Keep ID if valid, else generate new
      date: date,
      amount: amount,
      categoryId: finalCatId,
      note: note || ''
    });
  }
  
  return transactions;
};
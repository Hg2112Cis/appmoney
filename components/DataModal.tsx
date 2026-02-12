import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, AlertTriangle, Smartphone, Settings } from 'lucide-react';
import { Transaction } from '../types';
import { exportTransactionsToCSV, parseCSVToTransactions } from '../utils/csvUtils';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
  installPrompt?: any;
  onInstallClear?: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({ 
  isOpen, 
  onClose, 
  transactions, 
  onImport,
  installPrompt,
  onInstallClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleExport = () => {
    const csvContent = exportTransactionsToCSV(transactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `FinVibe_Backup_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const parsedTransactions = parseCSVToTransactions(text);
        if (parsedTransactions.length > 0) {
          onImport(parsedTransactions);
          setImportStatus(`¡Éxito! ${parsedTransactions.length} transacciones cargadas.`);
          setTimeout(() => {
             onClose();
             setImportStatus('');
          }, 1500);
        } else {
          setImportStatus('Error: No se encontraron transacciones válidas.');
        }
      } catch (err) {
        setImportStatus('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, discard it
    if (onInstallClear) onInstallClear();
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <Settings className="text-primary" size={24} />
             Ajustes
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* PWA Install Button - Only visible if installable */}
          {installPrompt && (
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 rounded-xl border border-primary/20">
               <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                 <Smartphone size={18} className="text-primary" />
                 Instalar App
               </h3>
               <p className="text-xs text-gray-400 mb-3">Instala FinVibe en tu móvil para usarla sin conexión y a pantalla completa.</p>
               <button 
                 onClick={handleInstall}
                 className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
               >
                 Instalar ahora
               </button>
            </div>
          )}

          {/* Export Section */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
             <h3 className="font-semibold text-gray-200 mb-2">Copia de Seguridad</h3>
             <p className="text-xs text-gray-500 mb-4">Descarga todas tus transacciones en un archivo Excel/CSV para guardarlas o analizarlas.</p>
             <button 
               onClick={handleExport}
               className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
             >
               <Download size={18} />
               Descargar Backup
             </button>
          </div>

          {/* Import Section */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
             <h3 className="font-semibold text-gray-200 mb-2">Restaurar Datos</h3>
             <div className="flex items-start gap-2 mb-4 bg-orange-500/10 p-2 rounded-lg">
                <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-orange-200/80">
                  Al importar, las transacciones se añadirán. Evita duplicados subiendo el mismo archivo dos veces.
                </p>
             </div>
             
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-primary/20"
             >
               <Upload size={18} />
               Importar Backup
             </button>
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileChange}
               accept=".csv,.txt"
               className="hidden"
             />
             {importStatus && (
               <p className={`text-xs text-center mt-2 ${importStatus.includes('Error') ? 'text-error' : 'text-green-400'}`}>
                 {importStatus}
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
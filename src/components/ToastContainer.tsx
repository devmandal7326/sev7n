import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-md border text-xs shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-left duration-200 ${
            toast.type === 'success'
              ? 'bg-neutral-900 border-emerald-800 text-white'
              : toast.type === 'error'
              ? 'bg-neutral-900 border-rose-800 text-white'
              : 'bg-neutral-900 border-neutral-700 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.text}</span>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

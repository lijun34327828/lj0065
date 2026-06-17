import { useBanquetStore } from '@/store/useBanquetStore';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ExportToast() {
  const { exportToast, hideExportToast } = useBanquetStore();

  if (!exportToast.show) return null;

  const isSuccess = exportToast.message.includes('成功');

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
          isSuccess
            ? 'bg-white/95 border-gold-300/60'
            : 'bg-white/95 border-red-300/60'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
        )}
        <span className="font-medium text-ink-700 whitespace-nowrap">
          {exportToast.message}
        </span>
        <button
          onClick={hideExportToast}
          className="ml-2 p-1 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

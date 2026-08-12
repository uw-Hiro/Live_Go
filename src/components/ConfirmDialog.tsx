import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-ink-850 border border-white/10 shadow-card animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg text-ink-600 hover:text-white hover:bg-white/5 p-1.5 transition"
          aria-label="閉じる"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-5">
          <div className="w-10 h-10 rounded-xl bg-coral-500/15 text-coral-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-ink-500 mt-1.5">{message}</p>
          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-ink-500 hover:text-white transition px-4 py-2.5 text-sm font-semibold"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-xl bg-coral-500 hover:bg-coral-600 active:scale-[0.98] transition px-4 py-2.5 text-sm font-semibold text-white"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

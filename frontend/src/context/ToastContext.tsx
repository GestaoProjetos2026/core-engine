import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', durationMs = DEFAULT_DURATION_MS) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismissToast(id), durationMs);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.variant}`} role="status">
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__dismiss"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

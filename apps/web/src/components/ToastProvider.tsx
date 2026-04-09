'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { useTranslation } from '@/i18n/use-translation';

type ToastTone = 'error' | 'info' | 'success';

type ToastInput = Readonly<{
  message: string;
  title?: string;
  tone?: ToastTone;
}>;

type ToastItem = ToastInput & {
  id: number;
  tone: ToastTone;
};

type ToastContextValue = Readonly<{
  dismissToast: (id: number) => void;
  showToast: (toast: ToastInput) => void;
}>;

const toastToneClasses: Record<ToastTone, string> = {
  error:
    'border-[color:rgba(181,69,69,0.18)] bg-[color:rgba(181,69,69,0.96)] text-white shadow-[0_24px_80px_rgba(181,69,69,0.22)]',
  info: 'border-[var(--border)] bg-[var(--card-strong)] text-[var(--foreground)] shadow-[var(--shadow-soft)]',
  success:
    'border-[color:rgba(17,122,86,0.18)] bg-[color:rgba(17,122,86,0.98)] text-white shadow-[0_24px_80px_rgba(17,122,86,0.22)]',
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function ToastProvider({ children }: ToastProviderProps) {
  const { messages } = useTranslation();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);
  const timeoutMapRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: number) => {
    const timeoutId = timeoutMapRef.current.get(id);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutMapRef.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, title, tone = 'info' }: ToastInput) => {
      const id = nextIdRef.current++;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message,
          title,
          tone,
        },
      ]);

      const timeoutId = setTimeout(() => {
        dismissToast(id);
      }, 4200);

      timeoutMapRef.current.set(id, timeoutId);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      dismissToast,
      showToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-[1.6rem] border px-4 py-4 backdrop-blur ${toastToneClasses[toast.tone]}`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                {toast.title ? (
                  <p className="text-sm font-semibold tracking-[0.01em]">{toast.title}</p>
                ) : null}
                <p className={`text-sm leading-6 ${toast.title ? 'mt-1' : ''}`}>{toast.message}</p>
              </div>
              <button
                className="rounded-full px-2 py-1 text-xs font-semibold opacity-80 hover:opacity-100"
                onClick={() => {
                  dismissToast(toast.id);
                }}
                type="button"
              >
                {messages.common.actions.close}
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const AUTO_DISMISS_MS = 4000;
const EXIT_ANIMATION_MS = 250;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearTimers = useCallback((id: string) => {
    const existing = timers.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      clearTimers(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimers],
  );

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      );
      const timeout = setTimeout(() => removeToast(id), EXIT_ANIMATION_MS);
      timers.current.set(id, timeout);
    },
    [removeToast],
  );

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);

      const timeout = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
      timers.current.set(id, timeout);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="true"
            className="fixed inset-x-0 bottom-0 z-99999 flex flex-col items-center gap-2 px-4 pb-4 pointer-events-none sm:items-end sm:right-5 sm:left-auto sm:bottom-5 sm:px-0 sm:pb-0 sm:gap-3"
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                role={toast.type === "error" ? "alert" : "status"}
                className={`pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all duration-250 ease-out sm:w-auto sm:min-w-70 ${
                  toast.leaving
                    ? "opacity-0 translate-y-2 scale-95"
                    : "opacity-100 translate-y-0 scale-100 animate-[toast-in_0.3s_ease-out]"
                } ${
                  toast.type === "success"
                    ? "border-emerald-100 bg-emerald-50/90 text-emerald-800"
                    : "border-red-100 bg-red-50/90 text-red-800"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {toast.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  )}
                  <span className="truncate text-xs font-semibold leading-tight sm:whitespace-normal">
                    {toast.message}
                  </span>
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 cursor-pointer rounded-full p-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

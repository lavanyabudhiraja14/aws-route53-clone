"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastKind = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
};

type ToastContextValue = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<
  ToastKind,
  {
    bar: string;
    icon: string;
    iconGlyph: string;
  }
> = {
  success: {
    bar: "border-[#1d8102]",
    icon: "text-[#1d8102]",
    iconGlyph: "✓",
  },
  error: {
    bar: "border-[#d13212]",
    icon: "text-[#d13212]",
    iconGlyph: "✕",
  },
  warning: {
    bar: "border-[#916300]",
    icon: "text-[#916300]",
    iconGlyph: "!",
  },
  info: {
    bar: "border-[#0073bb]",
    icon: "text-[#0073bb]",
    iconGlyph: "i",
  },
};

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = ++counter.current;

      setToasts((prev) => [
        ...prev,
        {
          id,
          kind,
          title,
          description,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (title, description) =>
        push("success", title, description),

      error: (title, description) =>
        push("error", title, description),

      info: (title, description) =>
        push("info", title, description),

      warning: (title, description) =>
        push("warning", title, description),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-14 z-[99999] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => {
          const style = KIND_STYLES[toast.kind];

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-2 rounded-sm border-l-4 bg-white px-3 py-2.5 text-[13px] shadow-lg ring-1 ring-black/5 ${style.bar}`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${style.icon}`}
              >
                {style.iconGlyph}
              </span>

              <div className="flex-1">
                <div className="font-bold text-[#16191f]">
                  {toast.title}
                </div>

                {toast.description ? (
                  <div className="mt-0.5 text-[#545b64]">
                    {toast.description}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="ml-1 text-base leading-none text-[#545b64] hover:text-[#16191f]"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
"use client";

import { useEffect } from "react";

export function Modal({
  title,
  children,
  onClose,
  footer,
  width = "max-w-xl",
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-16">
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${width} rounded-sm border border-[#d5dbdb] bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-[#eaeded] px-5 py-3">
          <h2 className="text-[16px] font-bold text-[#16191f]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-1 text-xl leading-none text-[#545b64] hover:text-[#16191f]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-[#eaeded] bg-[#fafafa] px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-[13px] font-bold text-[#16191f]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-[#545b64]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-sm border border-[#aab7b8] bg-white px-2 py-1.5 text-[13px] text-[#16191f] outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]";

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-sm bg-[#ec7211] px-3 py-1.5 text-[13px] font-bold text-white hover:bg-[#eb5f07] disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-sm border border-[#545b64] bg-white px-3 py-1.5 text-[13px] font-bold text-[#16191f] hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-sm bg-[#d13212] px-3 py-1.5 text-[13px] font-bold text-white hover:bg-[#b02a0e] disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

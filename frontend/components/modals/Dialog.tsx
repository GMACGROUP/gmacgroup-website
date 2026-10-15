"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  labelledBy?: string;
}

/**
 * Editorial dialog shell: square corners, ink rule on top, Escape to close,
 * focus moved into the panel on open and returned to the trigger on close.
 */
export function Dialog({ open, onClose, eyebrow, title, meta, children, labelledBy = "dialog-title" }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 sm:items-center sm:p-6 modal-backdrop-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[92dvh] w-full max-w-xl overflow-y-auto border-t-4 border-ink bg-paper shadow-2xl modal-panel-in"
      >
        <div className="flex items-start justify-between gap-6 border-b border-rule px-6 pb-5 pt-6 sm:px-8">
          <div>
            {eyebrow && <p className="text-[12px] font-medium uppercase tracking-label text-clay">{eyebrow}</p>}
            <h2 id={labelledBy} className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
              {title}
            </h2>
            {meta && <div className="mt-2 text-sm text-ink-500">{meta}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 shrink-0 p-2 text-ink-400 hover:text-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function money(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`;
}

"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgress = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    setVisible(true);
    setProgress(18);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + Math.random() * 20;
        if (prev < 85) return prev + Math.random() * 5;
        if (prev < 95) return prev + 0.5;
        return prev;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  };

  // Trigger completion whenever the pathname or search parameters change
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept all internal Link clicks and touch/hover events for instant response & prewarming
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.origin);
      const isInternal = url.origin === window.location.origin;
      const isAnchorOnly =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        Boolean(url.hash);
      const isNewTab =
        target.target === "_blank" ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey;

      if (isInternal && !isAnchorOnly && !isNewTab && url.href !== window.location.href) {
        startProgress();
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.origin);
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
        router.prefetch(url.pathname);
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true, capture: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      document.removeEventListener("pointerover", handlePointerOver, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [router]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-red via-brand-cyan to-brand-navy shadow-[0_0_12px_rgba(229,25,36,0.8),0_0_6px_rgba(0,196,255,0.8)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition:
            progress === 100
              ? "width 150ms ease-out, opacity 250ms ease-in"
              : "width 200ms ease-out",
        }}
      />
    </div>
  );
}

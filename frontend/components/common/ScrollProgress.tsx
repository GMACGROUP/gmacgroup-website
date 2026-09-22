"use client";

import { useEffect, useState } from "react";

const CIRCLE_RADIUS = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;

    function updateProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;

      setProgress(nextProgress);
      setIsVisible(window.scrollY > 160);
      frameId = 0;
    }

    function handleScroll() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    }

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`Back to top, ${Math.round(progress * 100)} percent of page read`}
      title="Back to top"
      className={`fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white shadow-[0_8px_24px_rgba(6,28,48,0.35)] ring-2 ring-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-navyDark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={CIRCLE_RADIUS} fill="none" stroke="#7DD3FC" strokeOpacity="0.3" strokeWidth="2.5" />
        <circle
          cx="24"
          cy="24"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="#00C4FF"
          strokeLinecap="round"
          strokeWidth="3"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute inset-2 rounded-full border border-white/10" aria-hidden="true" />
      <svg className="relative h-6 w-6 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="m6 14 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

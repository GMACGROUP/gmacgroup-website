"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CIRCLE_RADIUS = 18;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;

    function updateProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;

      setProgress(nextProgress);
      setIsVisible(window.scrollY > 220);
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

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`Back to top (${Math.round(progress * 100)}% scrolled)`}
      title="Back to top"
      className={`fixed z-40 flex items-center justify-center rounded-full bg-[#07111F]/90 text-white backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300 hover:scale-108 hover:bg-[#07111F] hover:border-cyan-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        /* Mobile: right-5, bottom-20 (above AI widget). Desktop: right-8, bottom-24 */
        "bottom-[74px] right-5 sm:bottom-[82px] sm:right-8 h-11 w-11 sm:h-12 sm:w-12"
      } ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90 p-0.5"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="#334155"
          strokeOpacity="0.4"
          strokeWidth="2.5"
        />
        <circle
          cx="22"
          cy="22"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="#2A8C8C"
          strokeLinecap="round"
          strokeWidth="2.5"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
      <svg
        className="relative h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}


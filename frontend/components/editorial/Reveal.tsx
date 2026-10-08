"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Progressive scroll reveal. Content is fully visible without JavaScript;
 * once this runs it adds the `js` class and fades in elements marked `.reveal`
 * as they enter the viewport. Disabled for visitors who prefer reduced motion.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => {
      // Anything already on screen shows immediately
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

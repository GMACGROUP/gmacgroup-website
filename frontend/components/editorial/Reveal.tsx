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
    document.documentElement.classList.add("js");
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    els.forEach((el) => el.classList.add("is-visible"));
  }, [pathname]);

  return null;
}

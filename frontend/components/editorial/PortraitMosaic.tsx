"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Person = { name: string; photo: string; country: string };

/**
 * Grid of real team portraits in black and white. Every few seconds one face
 * fades into colour, so the opening view feels alive without stock imagery.
 * Hovering a face also brings it into colour. Still for reduced-motion users.
 */
export function PortraitMosaic({ people }: { people: Person[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (people.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((a) => {
        let next = Math.floor(Math.random() * people.length);
        if (next === a) next = (next + 1) % people.length;
        return next;
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [people.length]);

  return (
    <ul className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Some of the Gmac Group team">
      {people.map((p, i) => (
        <li key={p.photo} className={`group relative aspect-[4/5] overflow-hidden bg-white/10 ${i % 4 === 1 || i % 4 === 3 ? "translate-y-4 sm:translate-y-6" : ""}`}>
          <Image
            src={p.photo}
            alt={`${p.name}, ${p.country}`}
            fill
            sizes="(max-width: 1024px) 25vw, 12vw"
            priority={i < 4}
            className={`object-cover transition-[filter] duration-[1200ms] ease-out group-hover:grayscale-0 ${active === i ? "grayscale-0" : "grayscale"}`}
          />
        </li>
      ))}
    </ul>
  );
}

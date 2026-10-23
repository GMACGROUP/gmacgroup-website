"use client";

import { useState } from "react";
import { Portrait } from "@/components/editorial/Portrait";
import type { Speaker } from "@/lib/content/speakers";

const FIRST = 12;

export function PastSpeakers({ speakers }: { speakers: Speaker[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? speakers : speakers.slice(0, FIRST);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
        {shown.map((p) => (
          <li key={p.name} tabIndex={0} className="group outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <Portrait name={p.name} src={p.photo} className="aspect-square w-full" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw" />
            <p className="mt-3 font-medium leading-snug text-ink">{p.name}</p>
            <p className="mt-1 text-[13px] leading-snug text-ink-500">{p.role}</p>
          </li>
        ))}
      </ul>
      {speakers.length > FIRST && (
        <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all} className="btn-secondary mt-10">
          {all ? "Show fewer speakers" : `Show all ${speakers.length} speakers`}
        </button>
      )}
    </>
  );
}

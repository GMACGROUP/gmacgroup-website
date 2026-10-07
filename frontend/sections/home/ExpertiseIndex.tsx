"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { PRACTICE_AREAS } from "@/lib/content/site";

export function ExpertiseIndex() {
  const [active, setActive] = useState(0);
  const area = PRACTICE_AREAS[active];

  return (
    <section className="site-section border-y border-rule bg-stone">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">
              <span className="eyebrow-num">02</span> Expertise
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="display-lg reveal max-w-[20ch]">Six practice areas, and the same specialists move between them.</h2>
            <p className="lede reveal mt-6 max-w-[60ch]">
              The researcher who sizes a labour market also teaches the methods workshop. The team that runs a graduate
              programme also designs the employer&rsquo;s intake pipeline.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <ol className="lg:col-span-7">
            {PRACTICE_AREAS.map((p, i) => (
              <li key={p.slug} className="border-t border-ink/15 last:border-b">
                <Link
                  href={`/expertise/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 sm:py-7"
                >
                  <span className={`text-sm tabular-nums transition-colors ${active === i ? "text-accent" : "text-ink-400"}`}>
                    {p.number}
                  </span>
                  <span>
                    <span className="block font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">{p.title}</span>
                    <span className="mt-2 block max-w-[54ch] text-[15px] leading-relaxed text-ink-500 lg:hidden">{p.short}</span>
                  </span>
                  <Arrow className={`h-5 w-5 transition-all duration-300 ${active === i ? "translate-x-0 text-accent opacity-100" : "-translate-x-2 opacity-0"} group-hover:translate-x-0 group-hover:opacity-100`} />
                </Link>
              </li>
            ))}
          </ol>

          <aside className="hidden lg:col-span-5 lg:block" aria-live="polite">
            <div className="sticky top-28">
              <div className="border border-ink/15 bg-paper p-8">
                <p className="font-display text-[5.5rem] leading-none text-accent" aria-hidden="true">{area.number}</p>
                <p className="mt-6 font-display text-2xl italic leading-snug text-ink">{area.promise}</p>
                <ul className="mt-6 space-y-2.5 text-[15px] text-ink-600">
                  {area.deliverables.slice(0, 4).map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-[0.6em] h-px w-3 shrink-0 bg-ink-400" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-ink/15 pt-5 text-sm">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">Engagement band</dt>
                  <dd className="mt-1 text-ink">{area.band}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">Delivered by</dt>
                  <dd className="mt-1 text-ink">{area.deliveredBy}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

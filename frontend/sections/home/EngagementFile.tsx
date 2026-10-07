"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { ENGAGEMENT_EXAMPLES } from "@/lib/content/site";

export function EngagementFile() {
  const [i, setI] = useState(0);
  const ex = ENGAGEMENT_EXAMPLES[i];

  return (
    <section className="site-section">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">
              <span className="eyebrow-num">04</span> How we engage
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="display-lg reveal max-w-[20ch]">Every engagement starts with the question.</h2>
            <p className="lede reveal mt-6 max-w-[60ch]">
              Four illustrations of how a typical brief is scoped and delivered. They show our approach for each type of
              client and are not client case studies.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-ink">
          <div role="tablist" aria-label="Engagement examples" className="flex flex-wrap border-b border-rule">
            {ENGAGEMENT_EXAMPLES.map((e, k) => (
              <button
                key={e.sector}
                role="tab"
                type="button"
                id={`eng-tab-${k}`}
                aria-selected={i === k}
                aria-controls="eng-panel"
                onClick={() => setI(k)}
                className={`-mb-px border-b-2 px-1 py-4 text-[15px] font-medium transition-colors sm:mr-10 mr-6 ${
                  i === k ? "border-accent text-ink" : "border-transparent text-ink-400 hover:text-ink"
                }`}
              >
                {e.sector}
              </button>
            ))}
          </div>

          <div id="eng-panel" role="tabpanel" aria-labelledby={`eng-tab-${i}`} className="grid gap-10 py-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">{ex.practice}</p>
              <h3 className="mt-3 font-display text-3xl leading-tight">{ex.title}</h3>
            </div>
            <dl className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
              {[
                ["The question", ex.question],
                ["Our approach", ex.approach],
                ["What you receive", ex.receive],
              ].map(([t, d], k) => (
                <div key={t} className="border-t border-rule pt-5">
                  <dt className="flex items-baseline gap-3 text-[12px] font-medium uppercase tracking-label text-ink">
                    <span className="text-accent">{String.fromCharCode(97 + k)}.</span>
                    {t}
                  </dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-ink-500">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <Link href="/how-we-engage" className="link-arrow">
          See all five ways institutions work with us
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

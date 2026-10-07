import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { EVENTS } from "@/lib/content/site";

export function EventsPreview() {
  const flagships = EVENTS.filter((e) => e.tier === "Flagship");
  return (
    <section className="site-section border-t border-rule bg-stone">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-num">05</span> Convenings
            </p>
            <h2 className="display-lg reveal mt-8 max-w-[18ch]">Our convenings open the door.</h2>
          </div>
          <p className="lede max-w-[44ch] lg:text-right">The expertise underneath them is what clients hire.</p>
        </div>

        <div className="mt-16 grid gap-px bg-ink/15 md:grid-cols-3">
          {flagships.map((e, k) => (
            <article key={e.title} className="reveal flex flex-col bg-paper p-8 sm:p-10" style={{ transitionDelay: `${k * 90}ms` }}>
              <p className="flex items-center justify-between text-[12px] font-medium uppercase tracking-label">
                <span className="text-clay">{e.cadence}</span>
                <span className="text-ink-400">Flagship</span>
              </p>
              <h3 className="mt-8 font-display text-[1.75rem] leading-tight">{e.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-500">{e.summary}</p>
              <dl className="mt-8 space-y-3 border-t border-rule pt-5 text-sm">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-ink-400">Format</dt>
                  <dd className="text-ink">{e.format}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-ink-400">Audience</dt>
                  <dd className="text-ink">{e.audience}</dd>
                </div>
              </dl>
              {e.cta && (
                <Link href={e.cta.href} className="link-arrow mt-8">
                  {e.cta.label}
                  <Arrow />
                </Link>
              )}
            </article>
          ))}
        </div>

        <Link href="/events" className="link-arrow mt-10">
          The full calendar of series and workshops
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

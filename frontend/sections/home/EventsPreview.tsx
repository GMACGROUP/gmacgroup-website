import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { EVENTS } from "@/lib/content/site";
import { FORMAT_LABEL, dateLine, type GmacEvent } from "@/lib/events";

export function EventsPreview({ next }: { next?: GmacEvent | null }) {
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

        {next && (
          <Link href={`/events/${next.slug}`} className="group mt-14 flex flex-col gap-4 border-y border-ink py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[12px] font-medium uppercase tracking-label text-clay">Next up</span>
              <span className="font-display text-2xl text-ink group-hover:text-accent">{next.title}</span>
              <span className="text-sm text-ink-500">
                {dateLine(next)} · {FORMAT_LABEL[next.format] ?? next.format}
              </span>
            </p>
            <span className="link-arrow shrink-0">
              Details
              <Arrow />
            </span>
          </Link>
        )}

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

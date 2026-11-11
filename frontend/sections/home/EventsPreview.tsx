import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { EVENTS } from "@/lib/content/site";
import { FORMAT_LABEL, dateLine, type GmacEvent } from "@/lib/events";

export function EventsPreview({ next }: { next?: GmacEvent | null }) {
  const flagships = EVENTS.filter((e) => e.tier === "Flagship");
  return (
    <section className="site-section border-t border-rule bg-sand">
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
          <Link href={`/events/${next.slug}`} className="group mt-10 flex flex-col gap-4 rounded-xl border border-rule/90 bg-white px-6 py-5 shadow-sm hover:shadow-md hover:border-accent/40 transition-all sm:flex-row sm:items-center sm:justify-between">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[12px] font-semibold uppercase tracking-label text-clay">Next up</span>
              <span className="font-display text-2xl text-ink group-hover:text-accent transition-colors">{next.title}</span>
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flagships.map((e, k) => (
            <article
              key={e.title}
              className="reveal flex flex-col justify-between rounded-2xl border border-rule/90 bg-white p-7 sm:p-8 shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all duration-300"
              style={{ transitionDelay: `${k * 90}ms` }}
            >
              <div>
                <p className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-label">
                  <span className="text-clay">{e.cadence}</span>
                  <span className="text-ink-400">Flagship</span>
                </p>
                <h3 className="mt-6 font-display text-[1.6rem] leading-tight text-ink">{e.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">{e.summary}</p>
              </div>

              <div className="mt-8 border-t border-rule/80 pt-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-20 shrink-0 text-ink-400 text-xs uppercase tracking-label font-medium">Format</dt>
                    <dd className="text-ink font-medium text-xs">{e.format}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-20 shrink-0 text-ink-400 text-xs uppercase tracking-label font-medium">Audience</dt>
                    <dd className="text-ink text-xs">{e.audience}</dd>
                  </div>
                </dl>
                {e.cta && (
                  <Link href={e.cta.href} className="link-arrow mt-6 inline-flex">
                    {e.cta.label}
                    <Arrow />
                  </Link>
                )}
              </div>
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

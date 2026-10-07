import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { EventRow } from "@/components/events/EventRow";
import { PastEvents } from "@/components/events/PastEvents";
import { EVENTS } from "@/lib/content/site";
import { getEvents } from "@/lib/api/server";
import { FORMAT_LABEL, dateBlock, dateLine, timeLine } from "@/lib/events";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Gmac Group convenings: the Leadership 2050 Summit, the Investment Pitch Series, research methods workshops and recurring series on employability and positioning.",
  alternates: { canonical: "/events" },
};

function Count({ n }: { n: number }) {
  return <span className="ml-3 align-middle font-sans text-base font-normal tabular-nums text-ink-400">[{n}]</span>;
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getEvents("upcoming"), getEvents("past")]);
  const featured = upcoming.find((e) => e.is_featured) ?? null;
  const rest = upcoming.filter((e) => e.id !== featured?.id);
  const tiers = ["Flagship", "Series", "Workshop"] as const;
  const tierTitle = { Flagship: "Flagship annual events", Series: "Recurring series", Workshop: "Specialist workshops and partnerships" };

  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Events</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Convenings that put the right room together, <em className="font-light italic text-ink-500">then keep it.</em>
            </h1>
            <div className="flex flex-col justify-end gap-5 lg:col-span-4">
              <p className="lede">
                Flagship summits, recurring series and specialist workshops, delivered live and online across Africa.
              </p>
              <a href="#past" className="link-arrow">
                Browse past events
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Featured upcoming */}
      {featured && (
        <section aria-labelledby="featured-title" className="band-blue text-white">
          <div className="wrap grid grid-cols-1 gap-10 py-16 sm:py-20 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="text-[12px] font-medium uppercase tracking-label text-accent-soft">Next flagship</p>
              <p className="mt-6 font-display text-6xl leading-none text-white sm:text-7xl">{dateBlock(featured).top}</p>
              <p className="mt-3 text-[13px] font-medium uppercase tracking-label text-white/60">{dateBlock(featured).bottom}</p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="text-[12px] font-medium uppercase tracking-label text-white/60">
                {FORMAT_LABEL[featured.format] ?? featured.format}
                {featured.series ? ` / ${featured.series}` : ""}
              </p>
              <h2 id="featured-title" className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/75">{featured.summary}</p>
              <p className="mt-4 text-sm text-white/60">
                {dateLine(featured)}
                {timeLine(featured) ? ` · ${timeLine(featured)}` : ""}
                {featured.location ? ` · ${featured.location}` : ""}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {featured.registration_url ? (
                  <a href={featured.registration_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Register
                    <Arrow />
                  </a>
                ) : (
                  <Link href="/contact?topic=sponsorship" className="btn-primary">
                    Enquire about sponsorship
                    <Arrow />
                  </Link>
                )}
                <Link
                  href={`/events/${featured.slug}`}
                  className="inline-flex items-center justify-center gap-2.5 border border-white/30 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white"
                >
                  Event details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section aria-labelledby="upcoming-title" className="site-section !pb-10">
        <div className="wrap">
          <h2 id="upcoming-title" className="display-md">
            Upcoming events
            <Count n={upcoming.length} />
          </h2>
          {rest.length > 0 ? (
            <ul className="mt-8 border-t border-ink">
              {rest.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          ) : (
            <div className="mt-8 border-t border-ink py-10">
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-500">
                {featured
                  ? "More dates for our recurring series and workshops will be announced here."
                  : "New dates are announced here first."}{" "}
                Subscribe to Gmac Insights at the bottom of this page to hear about registrations as they open.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      <section id="past" aria-labelledby="past-title" className="site-section !pt-10 scroll-mt-24">
        <div className="wrap">
          <h2 id="past-title" className="display-md mb-8">
            Past events
            <Count n={past.length} />
          </h2>
          <PastEvents events={past} />
        </div>
      </section>

      {/* Calendar of programmes */}
      <section aria-labelledby="calendar-title" className="site-section border-t border-rule bg-stone">
        <div className="wrap">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Our calendar</p>
            </div>
            <div className="lg:col-span-8">
              <h2 id="calendar-title" className="display-lg max-w-[20ch]">Three tiers, one calendar.</h2>
              <p className="lede mt-6 max-w-[60ch]">
                Annual flagships open to anchor sponsorship, recurring series that build the audience, and specialist
                workshops delivered with partners.
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
            {tiers.map((tier, i) => (
              <div key={tier} className="border-t border-ink pt-6">
                <p className="text-sm tabular-nums text-accent">Tier {i + 1}</p>
                <h3 className="mt-2 font-display text-2xl">{tierTitle[tier]}</h3>
                <ul className="mt-6 space-y-6">
                  {EVENTS.filter((e) => e.tier === tier).map((e) => (
                    <li key={e.title} className="border-b border-rule pb-6 last:border-0">
                      <p className="font-medium text-ink">{e.title}</p>
                      {e.summary && <p className="mt-1.5 text-[15px] leading-relaxed text-ink-500">{e.summary}</p>}
                      {e.cadence !== "Scheduled" && (
                        <p className="mt-2 text-[12px] font-medium uppercase tracking-label text-ink-400">{e.cadence}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship */}
      <section className="bg-ink text-white">
        <div className="wrap flex flex-col gap-10 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-label text-accent-soft">Sponsorship and partnership</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">Put your organisation in the room.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Tiered packages across our flagship convenings and series: naming association, speaking slots, delegate
              access, branded deliverables and post event reporting.
            </p>
          </div>
          <Link href="/contact?topic=sponsorship" className="btn-primary shrink-0">
            Request the sponsorship prospectus
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}

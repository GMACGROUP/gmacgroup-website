import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui/Arrow";
import { getEvent } from "@/lib/api/server";
import { FORMAT_LABEL, dateLine, isPast, timeLine } from "@/lib/events";
import { SITE } from "@/lib/content/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  return {
    title: e.title,
    description: e.summary,
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { title: e.title, description: e.summary, images: e.image_url ? [e.image_url] : undefined },
  };
}

export default async function EventPage({ params }: Props) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  const past = isPast(e);
  const time = timeLine(e);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.summary,
    startDate: e.start_at ?? undefined,
    endDate: e.end_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      e.format === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : e.format === "hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location: e.format === "online" ? { "@type": "VirtualLocation", url: e.registration_url ?? SITE.url } : { "@type": "Place", name: e.location ?? "To be announced" },
    image: e.image_url ? [new URL(e.image_url, SITE.url).toString()] : undefined,
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <article>
      {e.start_at && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/events" className="hover:text-ink">Events</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">{e.title}</span>
          </nav>
          <p className="mt-10 flex flex-wrap items-center gap-3 text-[12px] font-medium uppercase tracking-label">
            <span className={past ? "text-ink-500" : "text-accent"}>{past ? "Past event" : "Upcoming"}</span>
            <span className="text-ink-300" aria-hidden="true">/</span>
            <span className="text-ink-500">{FORMAT_LABEL[e.format] ?? e.format}</span>
            {e.series && (
              <>
                <span className="text-ink-300" aria-hidden="true">/</span>
                <span className="text-ink-500">{e.series}</span>
              </>
            )}
          </p>
          <h1 className="display-lg mt-5 max-w-[22ch]">{e.title}</h1>
          <p className="lede mt-6 max-w-[62ch]">{e.summary}</p>
        </div>
      </header>

      <div className="wrap grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          {e.body ? (
            e.body.split(/\n{2,}/).map((p) => (
              <p key={p.slice(0, 30)} className="mb-6 text-[1.15rem] leading-[1.75] text-ink-700">
                {p}
              </p>
            ))
          ) : (
            <p className="text-[1.15rem] leading-[1.75] text-ink-700">
              {past
                ? "Full details of this event will be added here."
                : "The full programme, speakers and registration details will be published here as they are confirmed."}
            </p>
          )}
          {e.partners && (
            <p className="mt-8 border-t border-rule pt-5 text-sm text-ink-500">
              <span className="font-medium text-ink">In partnership with</span> {e.partners}
            </p>
          )}
          {e.image_url && (
            <figure className="mt-12">
              <a href={e.image_url} target="_blank" rel="noopener noreferrer" className="block border border-rule bg-white p-3 transition-colors hover:border-ink/40">
                <Image src={e.image_url} alt={`Flyer for ${e.title}`} width={1200} height={1200} sizes="(max-width: 1024px) 100vw, 55vw" className="h-auto w-full" />
              </a>
              <figcaption className="mt-3 text-sm text-ink-400">Event flyer. Select to open full size.</figcaption>
            </figure>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="space-y-8 lg:sticky lg:top-28">
            <dl className="border-t border-ink">
              {[
                ["Date", dateLine(e)],
                ...(time ? [["Time", time]] : []),
                ["Format", FORMAT_LABEL[e.format] ?? e.format],
                ...(e.location ? [["Location", e.location]] : []),
              ].map(([t, d]) => (
                <div key={t} className="border-b border-rule py-4">
                  <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">{t}</dt>
                  <dd className="mt-1.5 text-[15px] text-ink">{d}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-3">
              {!past && e.registration_url && (
                <a href={e.registration_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  Register
                  <Arrow />
                </a>
              )}
              {!past && e.start_at && (
                <a href={`/events/${e.slug}/calendar.ics`} className="btn-secondary w-full">
                  Add to calendar
                </a>
              )}
              {past && e.recording_url && (
                <a href={e.recording_url} target="_blank" rel="noopener noreferrer" className="btn-dark w-full">
                  Watch the recording
                  <Arrow />
                </a>
              )}
              {!past && !e.registration_url && (
                <Link href={`/contact?topic=events&event=${encodeURIComponent(e.title)}`} className="btn-secondary w-full">
                  Register interest
                </Link>
              )}
            </div>

            <p className="text-sm leading-relaxed text-ink-500">
              Interested in sponsoring or speaking?{" "}
              <Link href="/contact?topic=sponsorship" className="text-accent underline-offset-4 hover:underline">
                Talk to our partnerships team
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>

      <div className="border-t border-rule">
        <div className="wrap py-10">
          <Link href="/events" className="link-arrow">
            All events
            <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

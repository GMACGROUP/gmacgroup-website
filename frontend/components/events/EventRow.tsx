import Link from "next/link";
import Image from "next/image";
import { Arrow } from "@/components/ui/Arrow";
import { FORMAT_LABEL, dateBlock, dateLine, timeLine, type GmacEvent } from "@/lib/events";

/** Text-first event row: date block, meta line, title, summary, details link. */
export function EventRow({ event, past = false }: { event: GmacEvent; past?: boolean }) {
  const block = dateBlock(event);
  const time = timeLine(event);
  return (
    <li className="group border-b border-rule">
      <Link href={`/events/${event.slug}`} className="grid grid-cols-[5.5rem_1fr] gap-5 py-8 sm:grid-cols-[8.5rem_1fr_auto] sm:gap-8">
        <div className={`text-left ${past ? "text-ink-400" : "text-ink"}`}>
          <p className="whitespace-nowrap font-display text-[1.7rem] leading-none sm:text-[2.2rem]">{block.top}</p>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-label text-ink-500">{block.bottom}</p>
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium uppercase tracking-label">
            <span className={past ? "text-ink-500" : "text-accent"}>{FORMAT_LABEL[event.format] ?? event.format}</span>
            {event.series && (
              <>
                <span className="text-ink-300" aria-hidden="true">/</span>
                <span className="text-ink-500">{event.series}</span>
              </>
            )}
          </p>
          <h3 className="mt-3 font-display text-2xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-[1.7rem]">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-ink-500">
            {dateLine(event)}
            {time ? ` · ${time}` : ""}
            {event.location ? ` · ${event.location}` : ""}
          </p>
          <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-ink-600">{event.summary}</p>
          <span className="link-arrow mt-5 text-sm">
            {past ? (event.recording_url ? "Details and recording" : "Details") : "Details and registration"}
            <Arrow />
          </span>
        </div>

        {event.image_url && (
          <div className="relative hidden h-28 w-28 overflow-hidden border border-rule bg-stone sm:block">
            <Image src={event.image_url} alt="" fill sizes="112px" className="object-cover object-top" />
          </div>
        )}
      </Link>
    </li>
  );
}

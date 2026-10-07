"use client";

import { useMemo, useState } from "react";
import { EventRow } from "@/components/events/EventRow";
import { FORMAT_LABEL, yearOf, type GmacEvent } from "@/lib/events";

const PAGE = 10;

export function PastEvents({ events }: { events: GmacEvent[] }) {
  const [format, setFormat] = useState("all");
  const [series, setSeries] = useState("all");
  const [shown, setShown] = useState(PAGE);

  const seriesList = useMemo(() => Array.from(new Set(events.map((e) => e.series).filter(Boolean))) as string[], [events]);
  const filtered = events.filter((e) => (format === "all" || e.format === format) && (series === "all" || e.series === series));
  const visible = filtered.slice(0, shown);
  const years = Array.from(new Set(visible.map(yearOf)));

  const select = "border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-ink pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500" aria-live="polite">
          Showing {visible.length} of {filtered.length} past {filtered.length === 1 ? "event" : "events"}
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="past-format">Format</label>
          <select id="past-format" className={select} value={format} onChange={(e) => { setFormat(e.target.value); setShown(PAGE); }}>
            <option value="all">All formats</option>
            {Object.entries(FORMAT_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="past-series">Series</label>
          <select id="past-series" className={select} value={series} onChange={(e) => { setSeries(e.target.value); setShown(PAGE); }}>
            <option value="all">All series</option>
            {seriesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 && <p className="py-12 text-ink-500">No past events match these filters.</p>}

      {years.map((y) => (
        <section key={y} aria-label={`Events in ${y}`} className="grid gap-x-10 lg:grid-cols-[8rem_1fr]">
          <h3 className="pt-8 font-display text-2xl text-ink-400 lg:sticky lg:top-28 lg:self-start">{y}</h3>
          <ul>
            {visible.filter((e) => yearOf(e) === y).map((e) => (
              <EventRow key={e.id} event={e} past />
            ))}
          </ul>
        </section>
      ))}

      {shown < filtered.length && (
        <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn-secondary mt-10">
          Show more past events
        </button>
      )}
    </div>
  );
}

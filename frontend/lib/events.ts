/* Shared event types and date formatting (used on server and client). */

export type GmacEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body?: string | null;
  series?: string | null;
  format: "online" | "in_person" | "hybrid" | string;
  location?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  timezone: string;
  all_day: boolean;
  date_label?: string | null;
  partners?: string | null;
  registration_url?: string | null;
  recording_url?: string | null;
  image_url?: string | null;
  is_featured: boolean;
};

export const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  hybrid: "Hybrid",
};

const TZ_ABBR: Record<string, string> = {
  "Africa/Accra": "GMT",
  "Africa/Lagos": "WAT",
  "Africa/Nairobi": "EAT",
  "Africa/Johannesburg": "SAST",
  UTC: "UTC",
};

function parts(iso: string, tz: string) {
  const d = new Date(iso);
  const get = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...o }).format(d);
  return {
    day: get({ day: "numeric" }),
    month: get({ month: "short" }).slice(0, 3),
    monthLong: get({ month: "long" }),
    year: get({ year: "numeric" }),
    weekday: get({ weekday: "long" }),
    time: get({ hour: "2-digit", minute: "2-digit", hour12: false }),
    tzName:
      TZ_ABBR[tz] ??
      new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value ?? tz,
  };
}

export function isPast(e: GmacEvent, now = new Date()) {
  const ref = e.end_at || e.start_at;
  return Boolean(ref && new Date(ref) < now);
}

/** "21 to 24 October 2026", "11 September 2024", or the free text label. */
export function dateLine(e: GmacEvent) {
  if (!e.start_at) return e.date_label ?? "Date to be announced";
  const s = parts(e.start_at, e.timezone);
  if (!e.end_at) return `${s.day} ${s.monthLong} ${s.year}`;
  const en = parts(e.end_at, e.timezone);
  if (s.year !== en.year) return `${s.day} ${s.monthLong} ${s.year} to ${en.day} ${en.monthLong} ${en.year}`;
  if (s.monthLong !== en.monthLong) return `${s.day} ${s.monthLong} to ${en.day} ${en.monthLong} ${s.year}`;
  if (s.day !== en.day) return `${s.day} to ${en.day} ${s.monthLong} ${s.year}`;
  return `${s.day} ${s.monthLong} ${s.year}`;
}

/** "17:00 to 20:00 UTC" (daily for multi-day events) or null for all-day events. */
export function timeLine(e: GmacEvent) {
  if (!e.start_at || e.all_day) return null;
  const s = parts(e.start_at, e.timezone);
  if (!e.end_at) return `${s.time} ${s.tzName}`;
  const en = parts(e.end_at, e.timezone);
  const multiDay = dateLine(e).includes(" to ");
  return `${s.time} to ${en.time} ${s.tzName}${multiDay ? " daily" : ""}`;
}

/** Big calendar block: { top: "21–24", bottom: "Oct 2026" } */
export function dateBlock(e: GmacEvent) {
  if (!e.start_at) return { top: e.date_label?.split(" ")[0]?.slice(0, 3) ?? "TBA", bottom: e.date_label?.split(" ")[1] ?? "" };
  const s = parts(e.start_at, e.timezone);
  const en = e.end_at ? parts(e.end_at, e.timezone) : null;
  const top = en && en.day !== s.day && en.month === s.month ? `${s.day}–${en.day}` : s.day;
  return { top, bottom: `${s.month} ${s.year}` };
}

export function yearOf(e: GmacEvent) {
  return e.start_at ? parts(e.start_at, e.timezone).year : "";
}

import { getEvent } from "@/lib/api/server";
import { SITE } from "@/lib/content/site";

export const revalidate = 300;

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const day = (iso: string, addDays = 0) => {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
};
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** A downloadable calendar entry for an upcoming event. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const e = await getEvent(params.slug);
  if (!e || !e.start_at) return new Response("Not found", { status: 404 });

  const when = e.all_day
    ? [`DTSTART;VALUE=DATE:${day(e.start_at)}`, `DTEND;VALUE=DATE:${day(e.end_at ?? e.start_at, 1)}`]
    : [`DTSTART:${stamp(e.start_at)}`, `DTEND:${stamp(e.end_at ?? e.start_at)}`];

  const url = `${SITE.url}/events/${e.slug}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gmac Group//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.slug}@gmac-group.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    ...when,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(`${e.summary}\n\n${url}`)}`,
    `LOCATION:${esc(e.location ?? (e.format === "online" ? "Online" : "To be announced"))}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${e.slug}.ics"`,
    },
  });
}

import type { MetadataRoute } from "next";
import { PRACTICE_AREAS, SITE } from "@/lib/content/site";
import { getEvents } from "@/lib/api/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const pages = ["", "/expertise", "/how-we-engage", "/research", "/programmes", "/events", "/about", "/team", "/careers", "/contact", "/privacy", "/terms"];
  const events = await getEvents("all");
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...PRACTICE_AREAS.map((a) => ({ url: `${base}/expertise/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}

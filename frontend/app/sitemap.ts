import type { MetadataRoute } from "next";
import { PRACTICE_AREAS, SITE } from "@/lib/content/site";
import { getEvents, getTeam } from "@/lib/api/server";
import { getTeamMemberSlug } from "@/lib/content/team-bios";
import { FOUNDER } from "@/lib/content/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  // Core pages — higher priority for brand + contact pages
  const corePriority: Record<string, number> = {
    "": 1.0,
    "/about": 0.9,
    "/team": 0.85,
    "/contact": 0.85,
    "/expertise": 0.8,
    "/programmes": 0.75,
    "/events": 0.75,
    "/research": 0.75,
    "/how-we-engage": 0.7,
    "/careers": 0.65,
    "/privacy": 0.3,
    "/terms": 0.3,
  };
  const pages = Object.keys(corePriority);

  const [events, teamMembers] = await Promise.all([getEvents("all"), getTeam()]);

  // Team profile pages — helps Google index individual names
  const founderSlug = getTeamMemberSlug(FOUNDER.name);
  const teamSlugs = [
    { slug: founderSlug, isFounder: true },
    ...teamMembers.map((m) => ({ slug: getTeamMemberSlug(m.name), isFounder: false })),
  ];

  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: corePriority[p] ?? 0.7,
    })),
    ...PRACTICE_AREAS.map((a) => ({
      url: `${base}/expertise/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...teamSlugs.map(({ slug, isFounder }) => ({
      url: `${base}/team/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: isFounder ? 0.8 : 0.6,
    })),
    ...events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })),
  ];
}

import "server-only";
import { TEAM_SEED, type TeamMember } from "@/lib/content/team-seed";
import { EVENTS_SEED } from "@/lib/content/events-seed";
import type { GmacEvent } from "@/lib/events";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Server side fetch for public content. Pages are regenerated in the
 * background every `revalidate` seconds, so admin edits appear without a
 * redeploy. If the API is slow or unreachable the fallback is used and the
 * page still renders.
 */
export async function fetchPublic<T>(path: string, fallback: T, revalidate = 300, tags: string[] = [], timeoutMs = 6000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate, tags },
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  const data = await fetchPublic<TeamMember[] | null>("/team", null, 300, ["team"]);
  return Array.isArray(data) && data.length > 0 ? data : TEAM_SEED;
}

export async function getEvents(when: "upcoming" | "past" | "all" = "all"): Promise<GmacEvent[]> {
  const data = await fetchPublic<GmacEvent[] | null>(`/events?when=${when}`, null, 300, ["events"]);
  if (Array.isArray(data)) return data;
  const now = new Date();
  const past = (e: GmacEvent) => Boolean((e.end_at || e.start_at) && new Date((e.end_at || e.start_at) as string) < now);
  if (when === "upcoming") return EVENTS_SEED.filter((e) => !past(e));
  if (when === "past") return EVENTS_SEED.filter(past);
  return EVENTS_SEED;
}

export async function getEvent(slug: string): Promise<GmacEvent | null> {
  const data = await fetchPublic<GmacEvent | null>(`/events/${encodeURIComponent(slug)}`, null, 300, ["events"]);
  return data && (data as GmacEvent).slug ? data : EVENTS_SEED.find((e) => e.slug === slug) ?? null;
}

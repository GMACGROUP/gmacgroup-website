/* Fallback events, used only if the events API is unreachable. Live events are managed in Admin > Events. */
import type { GmacEvent } from "@/lib/events";

export const EVENTS_SEED: GmacEvent[] = [
  {
    id: "seed-l2050-2026",
    slug: "leadership-2050-summit-2026",
    title: "Leadership 2050 Summit 2026",
    summary: "Our flagship convening on leadership, policy and the future of Africa returns as a four day hybrid summit.",
    series: "Leadership 2050",
    format: "hybrid",
    start_at: "2026-10-21T00:00:00Z",
    end_at: "2026-10-24T23:59:00Z",
    timezone: "Africa/Accra",
    all_day: true,
    is_featured: true,
  },
  {
    id: "seed-rm-2025",
    slug: "research-methods-training-and-certification-workshop-2025",
    title: "Research Methods Training and Certification Workshop",
    summary:
      "Mastering research, from ideas to publication: three days on proposals, research design, data collection, ethics, analysis and publication.",
    series: "Research and Analysis Series",
    format: "online",
    location: "Online (Zoom)",
    start_at: "2025-11-27T00:00:00Z",
    end_at: "2025-11-29T23:59:00Z",
    timezone: "Africa/Accra",
    all_day: true,
    image_url: "/images/events/research-methods-workshop-2025.jpg",
    is_featured: false,
  },
  {
    id: "seed-l2050-2024",
    slug: "leadership-2050-summit-2024",
    title: "Leadership 2050 Summit 2024",
    summary:
      "Four evenings of conversation on leadership and the future of Africa, with sixteen speakers from policy, diplomacy, research and enterprise.",
    series: "Leadership 2050",
    format: "online",
    location: "Online (Zoom)",
    start_at: "2024-09-11T17:00:00Z",
    end_at: "2024-09-14T20:00:00Z",
    timezone: "UTC",
    all_day: false,
    image_url: "/images/events/leadership-2050-summit-2024.jpg",
    is_featured: false,
  },
];

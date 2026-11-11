import { HomeHero } from "@/sections/home/HomeHero";
import { Figures } from "@/sections/home/Figures";
import { WhereWeWork } from "@/sections/home/WhereWeWork";
import { TwoDoors } from "@/sections/home/TwoDoors";
import { ExpertiseIndex } from "@/sections/home/ExpertiseIndex";
import { FounderNote } from "@/sections/home/FounderNote";
import { EngagementFile } from "@/sections/home/EngagementFile";
import { EventsPreview } from "@/sections/home/EventsPreview";
import { TeamPreview } from "@/sections/home/TeamPreview";
import { ClosingInvitation } from "@/sections/home/ClosingInvitation";
import { getEvents, getTeam } from "@/lib/api/server";

export const revalidate = 300;

export default async function HomePage() {
  const [team, upcoming] = await Promise.all([getTeam(), getEvents("upcoming")]);
  const next = upcoming.find((e) => e.start_at) ?? upcoming[0] ?? null;
  return (
    <>
      <HomeHero team={team} />
      <Figures team={team} />
      <WhereWeWork />
      <TwoDoors />
      <ExpertiseIndex />
      <FounderNote />
      <EngagementFile />
      <EventsPreview next={next} />
      <TeamPreview team={team} />
      <ClosingInvitation />
    </>
  );
}

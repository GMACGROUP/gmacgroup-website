import { HomeHero } from "@/sections/home/HomeHero";
import { Figures } from "@/sections/home/Figures";
import { TwoDoors } from "@/sections/home/TwoDoors";
import { ExpertiseIndex } from "@/sections/home/ExpertiseIndex";
import { FounderNote } from "@/sections/home/FounderNote";
import { EngagementFile } from "@/sections/home/EngagementFile";
import { EventsPreview } from "@/sections/home/EventsPreview";
import { TeamPreview } from "@/sections/home/TeamPreview";
import { ClosingInvitation } from "@/sections/home/ClosingInvitation";
import { getTeam } from "@/lib/api/server";

export const revalidate = 300;

export default async function HomePage() {
  const team = await getTeam();
  return (
    <>
      <HomeHero />
      <Figures team={team} />
      <TwoDoors />
      <ExpertiseIndex />
      <FounderNote />
      <EngagementFile />
      <EventsPreview />
      <TeamPreview team={team} />
      <ClosingInvitation />
    </>
  );
}

import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { PortraitMosaic } from "@/components/editorial/PortraitMosaic";
import { FOUNDER, SITE } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function HomeHero({ team }: { team: TeamMember[] }) {
  // Real team portraits only, in a fixed, balanced order (women and men alternating on every row).
  // Anyone else with a photo fills in after, so the grid never has gaps.
  const HERO_ORDER = [
    "raphael-sochima-ajana", "victoria-dzifa-atisoe", "richard-klutse", "maureen-mushwimba",
    "favour-ohiemi", "ismail-saani", "apollo-samantha-dorcas", "jude-van-tagoe",
    "atta-gyasi-domson", "yolanda-chibaya", "evans-essene-dzidzienyo", "delasi-kumapley",
  ];
  const all = [
    ...(FOUNDER.photo ? [{ name: FOUNDER.name, photo: FOUNDER.photo, country: FOUNDER.country }] : []),
    ...team.filter((m) => m.photo_url).map((m) => ({ name: m.name, photo: m.photo_url as string, country: m.country })),
  ];
  const slugOf = (photo: string) => photo.split("/").pop()?.replace(/\.[a-z]+$/i, "") ?? "";
  const rank = (photo: string) => {
    const i = HERO_ORDER.indexOf(slugOf(photo));
    return i === -1 ? HERO_ORDER.length : i;
  };
  const withPhotos = [...all].sort((x, y) => rank(x.photo) - rank(y.photo)).slice(0, 12);

  return (
    <section className="band-blue relative overflow-hidden text-white">
      <div className="wrap grid grid-cols-1 items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-6 lg:pr-6">
          <p className="eyebrow !text-white/70">
            <span className="whitespace-nowrap text-accent-soft">Gmac Group</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/30" />
            Research, human capital and investment facilitation
          </p>

          <h1 className="display-xl mt-8 max-w-[14ch] text-white">
            We build the people, <em className="font-light italic text-accent-soft">and</em> the evidence to deploy them.
          </h1>

          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/75 sm:text-xl">{SITE.positioning}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Link href="/contact" className="btn-primary self-start">
              Start a conversation
              <Arrow />
            </Link>
            <Link href="/expertise" className="inline-flex items-center gap-2 text-[15px] font-medium text-white underline-offset-4 hover:underline">
              Explore our expertise
              <Arrow />
            </Link>
          </div>
        </div>

        {withPhotos.length >= 8 && (
          <div className="lg:col-span-6 lg:col-start-7">
            <PortraitMosaic people={withPhotos.slice(0, withPhotos.length >= 12 ? 12 : 8)} />
            <p className="mt-10 text-[13px] text-white/60">
              Our team works from ten countries. <Link href="/team" className="text-white underline underline-offset-4">Meet them</Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

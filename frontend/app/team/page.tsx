import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { AfricaMap } from "@/components/editorial/AfricaMap";
import { PhotoSlot } from "@/components/editorial/PhotoSlot";
import { TeamDirectory } from "@/components/team/TeamDirectory";
import { FOUNDER, TEAMS } from "@/lib/content/site";
import { getTeam } from "@/lib/api/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our team",
  description:
    "The Gmac Group team: colleagues across five specialist teams, working remotely from countries across Africa and beyond.",
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  const members = await getTeam();
  const countries = new Set([...members.map((m) => m.country), FOUNDER.country]).size;

  return (
    <>
      <section className="border-b border-rule">
        <div className="wrap grid grid-cols-1 gap-14 pb-16 pt-14 sm:pt-20 lg:grid-cols-12 lg:pb-20 lg:pt-24">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
              <Link href="/" className="hover:text-ink">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-ink">Team</span>
            </nav>
            <h1 className="display-xl mt-8">
              {TEAMS.length} teams. {countries} countries. <em className="font-light italic text-ink-500">One standard.</em>
            </h1>
            <p className="lede mt-8 max-w-[56ch]">
              {members.length + 1} colleagues working remotely across Africa and beyond. Every engagement is staffed from the
              team that owns the capability.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="border-t border-ink pt-4 text-[12px] font-medium uppercase tracking-label text-ink-500">
              <span className="text-accent">Fig. 2</span>&nbsp;&nbsp;Where the team works from
            </div>
            <AfricaMap className="mt-6" numbered={false} title="Map of Africa marking the countries Gmac Group's team works from." />
            <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-500">
              <span className="inline-block h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
              Team locations. Shaded: our ten focus markets. One colleague works from the United States.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-ink text-white">
        <div className="wrap grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:py-20">
          <PhotoSlot
            src={FOUNDER.photo}
            alt={`Portrait of ${FOUNDER.name}`}
            awaiting="founder portrait"
            tone="dark"
            sizes="(max-width: 1024px) 60vw, 25vw"
            className="aspect-[4/5] w-full max-w-xs lg:col-span-3"
          />
          <div className="flex flex-col justify-end lg:col-span-8 lg:col-start-5">
            <p className="text-[12px] font-medium uppercase tracking-label text-accent-soft">{FOUNDER.role}</p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">{FOUNDER.name}</h2>
            <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-white/70">{FOUNDER.bio[0]}</p>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/70">{FOUNDER.bio[1]}</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <TeamDirectory members={members} />
      </div>

      <section className="site-section">
        <div className="wrap flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <h2 className="display-lg max-w-[18ch]">Want to work with us?</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/opportunities" className="btn-dark">
              Open roles and fellowships
              <Arrow />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

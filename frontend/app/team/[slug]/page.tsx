import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui/Arrow";
import { Portrait } from "@/components/editorial/Portrait";
import { FOUNDER } from "@/lib/content/site";
import { getTeam } from "@/lib/api/server";
import { getTeamMemberSlug, getMemberOverview } from "@/lib/content/team-bios";
import type { TeamMember } from "@/lib/content/team-seed";

export const revalidate = 300;

// Allow founder to also have a profile at /team/raphael-sochima-ajana
const founderMember: TeamMember = {
  id: "founder-raphael",
  name: FOUNDER.name,
  position: FOUNDER.role,
  country: FOUNDER.country,
  team: "Executive Advisory",
  photo_url: FOUNDER.photo,
  is_lead: true,
  bio: FOUNDER.bio.join(" "),
  linkedin_url: "https://www.linkedin.com/company/gmac-group/",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const members = await getTeam();
  const allMembers = [founderMember, ...members];
  const member = allMembers.find((m) => getTeamMemberSlug(m.name) === slug);

  if (!member) {
    return { title: "Team Member Not Found" };
  }

  return {
    title: `${member.name} | Gmac Group`,
    description: `${member.name} is ${member.position} (${member.country}) at Gmac Group.`,
    alternates: { canonical: `/team/${slug}` },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const members = await getTeam();
  const allMembers = [founderMember, ...members];
  const member = allMembers.find((m) => getTeamMemberSlug(m.name) === slug);

  if (!member) {
    notFound();
  }

  const overview = getMemberOverview(member);
  const firstName = member.name.split(" ")[0];

  return (
    <article className="min-h-screen bg-paper">
      {/* ── Hero Profile Header Band (Gmac Group Core Ink & Accent) ── */}
      <header className="border-b border-rule bg-ink text-white">
        <div className="wrap py-12 sm:py-16 lg:py-20">
          <div className="mb-6">
            <Link
              href="/team"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 transition-colors hover:text-white"
            >
              <span aria-hidden="true">←</span>
              <span>Back to Team</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            
            {/* Left: Portrait & Contact */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="overflow-hidden bg-ink-900 shadow-2xl border border-white/15">
                <Portrait
                  name={member.name}
                  src={member.photo_url}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 300px"
                  interactive={true}
                  showBadge={true}
                />
              </div>

              {/* Connect with [Name] */}
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                <span className="text-sm font-medium text-white/80">
                  Connect with {firstName}
                </span>
                <div className="flex items-center gap-2">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn Profile`}
                      className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 text-white transition-colors hover:bg-accent hover:border-accent hover:text-white"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  <a
                    href={`mailto:info@gmac-group.com?subject=Enquiry%20regarding%20${encodeURIComponent(member.name)}`}
                    aria-label={`Send inquiry about ${member.name}`}
                    className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 text-white transition-colors hover:bg-accent hover:border-accent hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Gmac Paper Container with Member Details */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="border border-rule/90 border-t-4 border-t-accent bg-paper p-8 text-ink sm:p-12 shadow-xl">
                <div className="inline-block border-b-2 border-accent pb-1 text-[13px] font-semibold uppercase tracking-label text-accent">
                  {member.is_lead ? "Team Lead" : "Team Member"}
                </div>
                
                <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-5xl lg:text-[3.5rem]">
                  {member.name}
                </h1>

                <p className="mt-4 text-lg font-medium text-ink-700 sm:text-xl">
                  {member.position}
                </p>
                
                <p className="mt-1 text-base text-ink-500">
                  {member.country} · {member.team}
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── Main Bio & Overview Content ──────────────────────── */}
      <section className="site-section">
        <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
          
          {/* Main Prose Overview */}
          <div className="lg:col-span-8 space-y-6 text-[16.5px] leading-relaxed text-ink-700 sm:text-[17px]">
            {overview.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {/* Core Initiatives List */}
            {overview.initiatives.length > 0 && (
              <div className="mt-10 border-t border-rule pt-8">
                <h2 className="font-display text-2xl text-ink font-semibold">
                  Key Programmes & Engagements
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {overview.initiatives.map((init) => (
                    <li
                      key={init}
                      className="flex items-center gap-2.5 rounded border border-rule bg-white px-4 py-3 text-[15px] font-medium text-ink shadow-sm"
                    >
                      <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                      {init}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar: Credentials & Practice */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="border border-rule bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-label text-ink-400">
                Core Practice Area
              </h3>
              <p className="mt-2 font-display text-xl text-ink font-medium">
                {member.team}
              </p>
            </div>

            <div className="border border-rule bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-label text-ink-400">
                Practice Focus & Expertise
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {overview.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="inline-block rounded bg-paper px-3 py-1.5 text-[13px] font-medium text-ink-700 border border-rule/70"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-rule bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-label text-ink-400">
                Education & Credentials
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                {overview.education}
              </p>
            </div>

            <div className="border-t border-rule pt-4">
              <Link href="/team" className="link-arrow font-medium text-accent hover:text-accent-dark">
                ← Back to full team directory
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="wrap flex flex-col justify-between gap-8 py-16 lg:flex-row lg:items-center">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-label text-accent-soft">
              Collaborate
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-white">
              Engage {firstName} and the {member.team} team
            </h2>
          </div>
          <Link href={`/contact?topic=institution&subject=Engagement%20with%20${encodeURIComponent(member.name)}`} className="btn-primary shrink-0">
            Discuss an engagement
            <Arrow />
          </Link>
        </div>
      </section>
    </article>
  );
}

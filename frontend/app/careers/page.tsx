import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { RoleList } from "@/components/catalogue/RoleList";
import { STORY, TEAMS, teamFigures } from "@/lib/content/site";
import { getOpportunities, getTeam } from "@/lib/api/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers",
  description: "Roles, internships and fellowships at Gmac Group, a remote team working across Africa and beyond.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const [roles, team] = await Promise.all([getOpportunities(), getTeam()]);
  const [countries, people] = teamFigures(team);

  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Careers</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Work on the evidence <em className="font-light italic text-ink-500">and the people, at the same time.</em>
            </h1>
            <dl className="grid grid-cols-2 gap-6 self-end lg:col-span-4">
              {[people, countries].map((f) => (
                <div key={f.label} className="border-t border-ink pt-4">
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <span className="block font-display text-5xl font-light tabular-nums">{f.display}</span>
                    <span className="mt-2 block text-[13px] leading-snug text-ink-500">{f.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <section aria-labelledby="roles-title" className="site-section">
        <div className="wrap">
          <p className="eyebrow"><span className="eyebrow-num">01</span> Open roles</p>
          <h2 id="roles-title" className="display-md mt-6">
            {roles.length ? "Roles, internships and fellowships." : "There are no open roles at the moment."}
          </h2>
          <div className="mt-10">
            {roles.length ? (
              <RoleList roles={roles} />
            ) : (
              <div className="grid grid-cols-1 gap-8 border-t border-ink pt-8 lg:grid-cols-12">
                <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-600 lg:col-span-7">
                  Openings are posted here first. If your work fits one of the teams below, you are welcome to send a short note and
                  a CV; we keep speculative applications on file for the next opening.
                </p>
                <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
                  <Link href="/contact?topic=careers&subject=Speculative%20application" className="btn-primary">
                    Send a note
                    <Arrow />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="teams-title" className="site-section border-y border-rule bg-stone">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="eyebrow-num">02</span> How we work</p>
            <h2 id="teams-title" className="display-md mt-6">Remote by design.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-500">{STORY.remote}</p>
            <Link href="/team" className="link-arrow mt-8">
              Meet the team
              <Arrow />
            </Link>
          </div>
          <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {TEAMS.map((t) => (
              <li key={t.name} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ink/15 py-6">
                <span className="tabular-nums text-accent">{t.number}</span>
                <div>
                  <h3 className="font-display text-xl">{t.name}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{t.remit}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow"><span className="eyebrow-num">03</span> Researchers</p>
            <h2 className="display-lg mt-6 max-w-[20ch]">Doctoral or early career researcher?</h2>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink-500">
              We bring researchers onto projects in labour markets, development policy and investment. Tell us your field and the
              methods you use.
            </p>
          </div>
          <Link href="/contact?topic=careers&subject=Research%20network" className="btn-dark self-start lg:self-auto">
            Express interest
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}

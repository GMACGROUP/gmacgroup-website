import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { ProgrammeList } from "@/components/catalogue/ProgrammeList";
import { PRACTICE_AREAS } from "@/lib/content/site";
import { getProgrammes } from "@/lib/api/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Coached employability programmes and training cohorts for graduates, professionals and institutions, delivered on a set calendar.",
  alternates: { canonical: "/programmes" },
};

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();
  const employability = PRACTICE_AREAS.find((p) => p.slug === "employability-programmes")!;
  const capacity = PRACTICE_AREAS.find((p) => p.slug === "institutional-capacity-building")!;

  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Programmes</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Structured routes <em className="font-light italic text-ink-500">from application to offer.</em>
            </h1>
            <p className="lede self-end lg:col-span-4">
              Coached programmes and training cohorts for individuals, and the same provision delivered at scale for universities
              and employers.
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="open-title" className="site-section">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow"><span className="eyebrow-num">01</span> Open for enrolment</p>
              <h2 id="open-title" className="display-md mt-6">
                {programmes.length ? "Current cohorts." : "No cohorts are open right now."}
              </h2>
            </div>
            <Link href="/events" className="link-arrow">
              Workshops and events
              <Arrow />
            </Link>
          </div>
          <div className="mt-10">
            {programmes.length ? (
              <ProgrammeList programmes={programmes} />
            ) : (
              <div className="grid grid-cols-1 gap-8 border-t border-ink pt-8 lg:grid-cols-12">
                <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-600 lg:col-span-7">
                  New cohorts are announced here and on our events calendar. Register your interest and we will write to you when
                  enrolment opens.
                </p>
                <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
                  <Link href="/contact?topic=programmes&subject=Programme%20interest" className="btn-primary">
                    Register interest
                    <Arrow />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="covers-title" className="site-section border-y border-rule bg-stone">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="eyebrow-num">02</span> For individuals</p>
            <h2 id="covers-title" className="display-md mt-6">What a programme covers.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-500">{employability.whoFor}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-[17px] leading-relaxed text-ink-600">{employability.whatItIs}</p>
            <ul className="mt-10 border-t border-ink">
              {employability.deliverables.map((d, i) => (
                <li key={d} className="grid grid-cols-[3rem_1fr] border-b border-ink/15 py-4 text-[15px] text-ink">
                  <span className="tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="inst-title" className="site-section">
        <div className="wrap">
          <p className="eyebrow"><span className="eyebrow-num">03</span> For institutions</p>
          <h2 id="inst-title" className="display-lg mt-6 max-w-[22ch]">Buy a cohort, or build the capability in house.</h2>
          <div className="mt-12 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
            {[employability, capacity].map((p) => (
              <Link key={p.slug} href={`/expertise/${p.slug}`} className="group bg-paper py-8 sm:pr-10 [&:nth-child(2)]:sm:pl-10">
                <p className="text-sm tabular-nums text-accent">{p.number}</p>
                <h3 className="mt-3 font-display text-2xl group-hover:text-accent">{p.title}</h3>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-500">{p.short}</p>
                <span className="link-arrow mt-5">
                  Read more
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[22ch] font-display text-4xl leading-tight text-white sm:text-5xl">
            Running provision for a university or employer?
          </h2>
          <Link href="/contact?topic=programmes" className="btn-primary self-start lg:self-auto">
            Talk to the programmes team
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}

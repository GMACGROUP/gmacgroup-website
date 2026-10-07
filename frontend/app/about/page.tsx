import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { AfricaMap } from "@/components/editorial/AfricaMap";
import { PhotoSlot } from "@/components/editorial/PhotoSlot";
import { FIGURES, FOUNDER, PARTNERS, PRINCIPLES, SECTORS, SITE, STORY, TEAMS, WHY_GMAC } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About",
  description: SITE.positioning,
  alternates: { canonical: "/about" },
};

function Label({ n, children, dark }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`eyebrow ${dark ? "!text-white/60" : ""}`}>
      <span className={`eyebrow-num ${dark ? "!text-accent-soft" : ""}`}>{n}</span>
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ── Opening ─────────────────────────────────────────── */}
      <header className="border-b border-rule">
        <div className="wrap pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">About</span>
          </nav>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-9">
              Build the people. Build the evidence. <em className="font-light italic text-ink-500">At the same time.</em>
            </h1>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 border-t border-ink pt-8 lg:grid-cols-12">
            <p className="text-[12px] font-medium uppercase tracking-label text-ink-400 lg:col-span-3">Who we are</p>
            <p className="font-display text-2xl leading-snug text-ink sm:text-[1.75rem] lg:col-span-8">{SITE.positioning}</p>
          </div>
        </div>
      </header>

      {/* ── Story ───────────────────────────────────────────── */}
      <section className="site-section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Label n="01">Our story</Label>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[1.2rem] leading-[1.75] text-ink-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-accent">
              {STORY.opening}
            </p>
            <p className="mt-6 text-[1.2rem] leading-[1.75] text-ink-700">{STORY.growth}</p>
            <p className="mt-6 text-[1.2rem] leading-[1.75] text-ink-700">{STORY.research}</p>
            <p className="mt-6 text-[1.2rem] leading-[1.75] text-ink-700">{STORY.vision}</p>
          </div>

          {/* Margin note, as in a printed report */}
          <aside className="lg:col-span-3">
            <div className="border-l border-accent pl-5 lg:sticky lg:top-28">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-400">Note</p>
              <p className="mt-3 font-display text-xl italic leading-snug text-ink-600">
                Our convenings open the door. The expertise underneath them is what clients hire.
              </p>
            </div>
          </aside>
        </div>

        {/* How the firm grew: a typographic sequence, no icons */}
        <div className="wrap mt-20">
          <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">
            <span className="text-accent">Fig. 1</span>&nbsp;&nbsp;How the firm grew
          </p>
          <ol className="mt-6 grid border-t border-ink sm:grid-cols-5">
            {STORY.stages.map((s, i) => (
              <li
                key={s}
                className={`relative border-b border-rule py-6 sm:border-b-0 sm:py-8 sm:pr-6 ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}
              >
                <span className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className={`mt-3 font-display leading-tight text-ink ${i === STORY.stages.length - 1 ? "text-3xl" : "text-2xl"}`}>{s}</p>
                {i < STORY.stages.length - 1 && (
                  <span aria-hidden="true" className="absolute right-0 top-1/2 hidden translate-x-1/2 bg-paper px-1 text-ink-300 sm:block">
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Founder ─────────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="wrap grid grid-cols-1 gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <Label n="02" dark>A word from the founder</Label>
            <PhotoSlot
              src={FOUNDER.photo}
              alt={`Portrait of ${FOUNDER.name}`}
              awaiting="founder portrait"
              tone="dark"
              sizes="(max-width: 1024px) 80vw, 30vw"
              className="mt-10 aspect-[4/5] w-full max-w-sm"
            />
            <p className="mt-5 font-medium text-white">{FOUNDER.name}</p>
            <p className="text-sm text-white/60">{FOUNDER.role}</p>
          </div>
          <div className="flex flex-col lg:col-span-7 lg:col-start-6 lg:pt-14">
            <p className="font-display text-[2rem] font-light leading-[1.15] text-white sm:text-5xl">
              We set out to build capability, and the evidence to direct it.
            </p>
            <div className="mt-12 space-y-5 border-t border-white/15 pt-8">
              {FOUNDER.bio.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-[62ch] text-[16px] leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ──────────────────────────────────────── */}
      <section className="site-section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label n="03">How we work</Label>
            <h2 className="display-lg mt-8">Six commitments we hold ourselves to.</h2>
          </div>
          <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="grid grid-cols-1 gap-2 border-b border-rule py-7 sm:grid-cols-[4rem_14rem_1fr] sm:gap-6">
                <span className="font-display text-2xl font-light tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-xl leading-snug text-ink">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-500">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Remote by design ────────────────────────────────── */}
      <section className="border-y border-rule bg-stone">
        <div className="wrap grid grid-cols-1 gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <Label n="04">Remote by design</Label>
            <h2 className="display-lg mt-8">The team assembles around a brief, not a building.</h2>
            <p className="lede mt-6">
              Five specialist teams work across time zones, convene in person for flagship events, and are assigned to each
              engagement from the team that owns the capability.
            </p>
            <dl className="mt-10 grid grid-cols-2 border-t border-ink/20">
              {FIGURES.slice(1).concat([{ value: 5, display: String(TEAMS.length), label: "Specialist teams, each with a named lead" }]).map((f, i) => (
                <div key={f.label} className={`border-b border-ink/20 py-5 pr-4 ${i % 2 === 1 ? "border-l pl-5" : ""}`}>
                  <dd className="font-display text-4xl text-ink">{f.display}</dd>
                  <dt className="mt-1 text-sm leading-snug text-ink-500">{f.label}</dt>
                </div>
              ))}
            </dl>
            <Link href="/team" className="btn-dark mt-10">
              Meet the team
              <Arrow />
            </Link>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <AfricaMap numbered={false} title="Map of Africa marking Gmac Group's focus markets and the countries the team works from." />
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-500">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 border border-accent bg-[#D5E3F3]" aria-hidden="true" />
                Focus markets
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
                Team locations
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Gmac Group ──────────────────────────────────── */}
      <section className="site-section">
        <div className="wrap">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label n="05">Why Gmac Group</Label>
            </div>
            <h2 className="display-lg lg:col-span-8">What clients get from working with us.</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {WHY_GMAC.map((w) => (
              <div key={w.title} className="border-b border-rule py-8">
                <h3 className="font-display text-xl leading-snug text-ink">{w.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sectors and partners ────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="wrap grid grid-cols-1 gap-14 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">Sectors we are built to serve</p>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2 font-display text-2xl leading-relaxed text-ink sm:text-[1.75rem]">
              {SECTORS.map((sector, i) => (
                <li key={sector} className="flex items-baseline gap-3">
                  {sector}
                  {i < SECTORS.length - 1 && <span className="text-accent" aria-hidden="true">/</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">Working alongside</p>
            <ul className="mt-6 border-t border-ink">
              {PARTNERS.map((p) => (
                <li key={p.name} className="border-b border-rule py-5">
                  <p className="font-display text-2xl text-ink">{p.name}</p>
                  <p className="mt-1 text-sm text-ink-500">{p.role}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-400">Company registration and compliance documentation are available on request.</p>
          </div>
        </div>
      </section>

      {/* ── Invitation ──────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="wrap flex flex-col gap-10 py-20 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[18ch] font-display text-4xl leading-[1.08] text-white sm:text-5xl">
            Tell us the decision you are trying to make.
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Start a conversation
              <Arrow />
            </Link>
            <Link href="/expertise" className="inline-flex items-center justify-center gap-2.5 border border-white/30 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white">
              Our expertise
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

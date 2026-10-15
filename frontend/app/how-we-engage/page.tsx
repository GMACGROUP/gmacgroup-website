import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { ENGAGEMENT_EXAMPLES, ENGAGEMENT_MODELS, PRACTICE_AREAS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "How we engage",
  description:
    "Five ways institutions work with Gmac Group, each beginning with a scoping conversation and a written statement of scope, deliverables and price.",
  alternates: { canonical: "/how-we-engage" },
};

const STEPS = [
  { title: "Scoping conversation", body: "A short call to understand the decision you need to make and whether we are the right people." },
  { title: "Written scope", body: "Deliverables, milestones and a price band, stated plainly before any work begins." },
  { title: "Delivery", body: "Staffed from the team that owns the capability, with review points agreed up front." },
  { title: "Handover", body: "Documented methodology and data, so your team can run the next round without us." },
];

export default function HowWeEngagePage() {
  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">How we engage</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Clear scope, <em className="font-light italic text-ink-500">from the first conversation.</em>
            </h1>
            <p className="lede self-end lg:col-span-4">
              Procurement teams can evaluate us without a discovery process. Every route below begins the same way.
            </p>
          </div>
        </div>
      </header>

      {/* Process */}
      <section aria-labelledby="process-title" className="site-section">
        <div className="wrap">
          <p className="eyebrow"><span className="eyebrow-num">01</span> The process</p>
          <h2 id="process-title" className="sr-only">The process</h2>
          <ol className="mt-10 grid grid-cols-1 border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`border-b border-rule py-8 sm:pr-8 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "sm:border-l sm:pl-8" : ""}`}>
                <p className="font-display text-5xl font-light text-accent">{i + 1}</p>
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Models */}
      <section aria-labelledby="models-title" className="site-section border-y border-rule bg-sand">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="eyebrow-num">02</span> Partnership models</p>
            <h2 id="models-title" className="display-md mt-6">Five routes. Most first engagements start with the first.</h2>
          </div>
          <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <li key={m.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-ink/15 py-7">
                <span className="font-display text-2xl font-light tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl">{m.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Examples */}
      <section aria-labelledby="examples-title" className="site-section">
        <div className="wrap">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow"><span className="eyebrow-num">03</span> Illustrations</p>
            </div>
            <div className="lg:col-span-8">
              <h2 id="examples-title" className="display-lg max-w-[20ch]">How a typical engagement is scoped.</h2>
              <p className="lede mt-5 max-w-[60ch]">
                These illustrate our approach and deliverables for each type of client. They are not client case studies.
              </p>
            </div>
          </div>
          <div className="mt-14 space-y-px bg-ink/15">
            {ENGAGEMENT_EXAMPLES.map((ex) => {
              const area = PRACTICE_AREAS.find((p) => p.title === ex.practice);
              return (
                <article key={ex.title} className="grid grid-cols-1 gap-8 bg-paper py-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <p className="text-[12px] font-medium uppercase tracking-label text-clay">{ex.sector}</p>
                    <h3 className="mt-3 font-display text-2xl leading-snug">{ex.title}</h3>
                    {area && (
                      <Link href={`/expertise/${area.slug}`} className="mt-3 inline-block text-sm text-accent hover:underline">
                        {ex.practice}
                      </Link>
                    )}
                  </div>
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
                    {[["The question", ex.question], ["Our approach", ex.approach], ["What you receive", ex.receive]].map(([t, d]) => (
                      <div key={t} className="border-t border-rule pt-4">
                        <dt className="text-sm font-medium text-ink">{t}</dt>
                        <dd className="mt-2 text-[15px] leading-relaxed text-ink-500">{d}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[20ch] font-display text-4xl leading-tight text-white sm:text-5xl">Tell us the decision you are trying to make.</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact?topic=institution" className="btn-primary">
              Start a conversation
              <Arrow />
            </Link>
            <p className="self-center text-sm text-white/60">Company registration and compliance documents available on request.</p>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui/Arrow";
import { PRACTICE_AREAS, ENGAGEMENT_EXAMPLES, FOCUS_MARKETS } from "@/lib/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRACTICE_AREAS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PRACTICE_AREAS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.promise} ${p.short}`,
    alternates: { canonical: `/expertise/${p.slug}` },
  };
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params;
  const idx = PRACTICE_AREAS.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = PRACTICE_AREAS[idx];
  const next = PRACTICE_AREAS[(idx + 1) % PRACTICE_AREAS.length];
  const example = ENGAGEMENT_EXAMPLES.find((e) => e.practice === p.title);

  return (
    <article>
      <header className="border-b border-rule">
        <div className="wrap pb-16 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/expertise" className="hover:text-ink">Expertise</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">{p.title}</span>
          </nav>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <p className="font-display text-7xl font-light leading-none text-accent lg:col-span-2 lg:text-8xl">{p.number}</p>
            <div className="lg:col-span-9">
              <h1 className="display-lg">{p.title}</h1>
              <p className="mt-6 font-display text-2xl italic leading-snug text-ink-500 sm:text-3xl">{p.promise}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap grid grid-cols-1 gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <section>
            <h2 className="eyebrow">What it is</h2>
            <p className="mt-6 text-xl leading-relaxed text-ink-700 sm:text-[1.35rem]">{p.whatItIs}</p>
          </section>

          <section className="mt-16">
            <h2 className="eyebrow">What we deliver</h2>
            <ol className="mt-6 border-t border-ink">
              {p.deliverables.map((d, i) => (
                <li key={d} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-rule py-4 text-[16px] text-ink">
                  <span className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {d}
                </li>
              ))}
            </ol>
          </section>

          {p.slug === "investment-facilitation" && (
            <section className="mt-16">
              <h2 className="eyebrow">Current focus markets</h2>
              <p className="mt-6 font-display text-2xl leading-relaxed">{FOCUS_MARKETS.join(" · ")}</p>
            </section>
          )}

          {example && (
            <section className="mt-16 bg-stone p-8 sm:p-10">
              <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">Illustrative engagement, not a client case study</p>
              <h2 className="mt-3 font-display text-2xl">{example.title}</h2>
              <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  ["The question", example.question],
                  ["Our approach", example.approach],
                  ["What you receive", example.receive],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="text-sm font-medium text-ink">{t}</dt>
                    <dd className="mt-2 text-[15px] leading-relaxed text-ink-500">{d}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-28 space-y-8">
            <dl className="border-t border-ink">
              {[
                ["Who it is for", p.whoFor],
                ["Engagement band", p.band],
                ["Delivered by", p.deliveredBy],
              ].map(([t, d]) => (
                <div key={t} className="border-b border-rule py-5">
                  <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">{t}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink">{d}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="border-l-2 border-accent pl-5 font-display text-lg italic leading-snug text-ink-600">
              {p.note}
            </blockquote>
            <Link href={`/contact?topic=${p.slug}`} className="btn-primary w-full">
              Discuss a brief
              <Arrow />
            </Link>
          </div>
        </aside>
      </div>

      <Link href={`/expertise/${next.slug}`} className="group block border-t border-rule bg-ink text-white">
        <div className="wrap flex items-center justify-between gap-6 py-12">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-label text-white/50">Next practice area</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{next.title}</p>
          </div>
          <Arrow className="h-8 w-8 transition-transform group-hover:translate-x-2" />
        </div>
      </Link>
    </article>
  );
}

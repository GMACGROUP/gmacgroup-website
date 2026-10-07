import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { ENGAGEMENT_MODELS, PRACTICE_AREAS, PRINCIPLES } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Expertise",
  description:
    "Six practice areas: applied research and policy consulting, institutional capacity building, human capital and workforce consulting, employability programmes, signature events, and investment facilitation.",
  alternates: { canonical: "/expertise" },
};

export default function ExpertisePage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="wrap pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Expertise</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Gmac Group builds human capability, <em className="font-light italic text-ink-500">and the evidence institutions need to deploy it.</em>
            </h1>
            <p className="lede self-end lg:col-span-4">
              Each practice area has its own scope, delivery team and pricing band, stated plainly so a procurement team can
              read it without a call.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-6">
        <ol>
          {PRACTICE_AREAS.map((p) => (
            <li key={p.slug} className="border-b border-rule">
              <Link href={`/expertise/${p.slug}`} className="group grid gap-6 py-10 lg:grid-cols-12 lg:py-14">
                <span className="font-display text-5xl font-light text-accent lg:col-span-1">{p.number}</span>
                <div className="lg:col-span-5">
                  <h2 className="font-display text-3xl leading-tight sm:text-[2.25rem] group-hover:text-accent transition-colors">{p.title}</h2>
                  <p className="mt-3 font-display text-lg italic text-ink-500">{p.promise}</p>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="text-[15px] leading-relaxed text-ink-600">{p.short}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">Engagement band</dt>
                      <dd className="mt-1 text-ink">{p.band}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-label text-ink-400">Delivered by</dt>
                      <dd className="mt-1 text-ink">{p.deliveredBy}</dd>
                    </div>
                  </dl>
                  <span className="link-arrow mt-6">
                    Scope and deliverables
                    <Arrow />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="site-section border-t border-rule bg-stone">
        <div className="wrap">
          <p className="eyebrow">Our philosophy</p>
          <h2 className="display-lg mt-6 max-w-[20ch]">Six commitments that hold across every practice area.</h2>
          <div className="mt-14 grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="bg-stone p-8">
                <span className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">How institutions work with us</p>
            <h2 className="display-lg mt-6">Five routes, each beginning with a scoping conversation.</h2>
            <Link href="/contact" className="btn-primary mt-10">
              Start a conversation
              <Arrow />
            </Link>
          </div>
          <ol className="border-t border-ink lg:col-span-6 lg:col-start-7">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <li key={m.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-rule py-6">
                <span className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-sans text-[17px] font-medium text-ink">{m.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-500">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { PARTNERS, SITE } from "@/lib/content/site";

const marqueePartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

export function ClosingInvitation() {
  return (
    <>
      <section aria-label="Partners" className="border-y border-rule bg-paper overflow-hidden py-5 sm:py-6">
        <div className="wrap flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 overflow-hidden">
          <div className="shrink-0 flex items-center gap-2.5 pr-2 sm:pr-8 sm:border-r sm:border-rule">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <span className="text-[12px] font-semibold uppercase tracking-label text-ink-500 whitespace-nowrap">
              Working alongside
            </span>
          </div>

          <div className="marquee-mask relative flex-1 overflow-hidden">
            <div className="animate-marquee-track flex items-center gap-4 sm:gap-6 py-1">
              {marqueePartners.map((p, idx) => (
                <div
                  key={`${p.name}-${idx}`}
                  title={p.role}
                  className="group shrink-0 flex items-center gap-3 rounded-full border border-rule/90 bg-white/90 px-5 py-2.5 shadow-[0_2px_8px_-4px_rgba(14,26,43,0.06)] transition-all duration-200 hover:border-accent hover:shadow-md hover:bg-white cursor-default"
                >
                  <span className="h-2 w-2 rounded-full bg-accent/80 transition-transform group-hover:scale-125 group-hover:bg-accent" aria-hidden="true" />
                  <span className="font-display text-[16px] sm:text-[17px] text-ink font-normal tracking-tight whitespace-nowrap">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <span className="eyebrow-num">07</span> An invitation
            </p>
            <h2 className="display-xl reveal mt-8 max-w-[16ch]">Tell us the decision you are trying to make.</h2>
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-4">
            <p className="lede">
              Or the capability you are trying to build. We will tell you plainly whether we are the right people, and what it
              would take.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/contact" className="btn-primary self-start">
                Start a conversation
                <Arrow />
              </Link>
              <a href={`mailto:${SITE.email}`} className="link-arrow text-[15px] font-medium text-ink hover:text-accent">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

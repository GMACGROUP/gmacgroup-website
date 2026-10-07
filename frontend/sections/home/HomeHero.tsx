import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { AfricaMap } from "@/components/editorial/AfricaMap";
import { FOCUS_MARKETS, SITE } from "@/lib/content/site";

export function HomeHero() {
  return (
    <section className="relative border-b border-rule">
      <div className="wrap grid grid-cols-1 gap-14 pb-16 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-24">
        <div className="lg:col-span-7 lg:pr-8">
          <p className="eyebrow">
            <span className="eyebrow-num">Gmac Group</span>
            <span aria-hidden="true" className="h-px w-8 bg-ink-300" />
            Research, human capital and investment facilitation
          </p>

          <h1 className="display-xl mt-8 max-w-[14ch] text-ink">
            We build the people, <em className="font-light italic text-accent">and</em> the{" "}
            <span className="ink-sweep">evidence</span> to deploy them.
          </h1>

          <p className="lede mt-8 max-w-[56ch]">{SITE.positioning}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/contact" className="btn-primary">
              Start a conversation
              <Arrow />
            </Link>
            <Link href="/expertise" className="link-arrow">
              Explore our expertise
              <Arrow />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border-t border-ink pt-4">
            <p className="flex items-baseline justify-between text-[12px] font-medium uppercase tracking-label text-ink-500">
              <span>
                <span className="text-accent">Fig. 1</span>&nbsp;&nbsp;Where we work
              </span>
              <span>Ten focus markets</span>
            </p>
          </div>
          <div className="pattern-dots mt-6 bg-sky p-5 sm:p-6">
            <AfricaMap />
          </div>
        </div>
      </div>
      {/* Focus markets, scrolling. Decorative duplicate of the list in the map key. */}
      <div className="overflow-hidden border-t border-rule bg-white py-4" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {FOCUS_MARKETS.map((m) => (
                <li key={m} className="flex items-center gap-10 pr-10 font-display text-2xl text-ink-600">
                  {m}
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

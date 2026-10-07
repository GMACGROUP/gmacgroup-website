import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { AfricaMap } from "@/components/editorial/AfricaMap";
import { SITE } from "@/lib/content/site";

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
            We build the people, <em className="font-light italic text-ink-500">and</em> the evidence to deploy them.
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
          <AfricaMap className="mt-6" />
        </div>
      </div>
    </section>
  );
}

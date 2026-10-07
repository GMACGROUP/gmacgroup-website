import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { PhotoSlot } from "@/components/editorial/PhotoSlot";
import { FOUNDER } from "@/lib/content/site";

export function FounderNote() {
  return (
    <section className="site-section bg-ink text-white">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow !text-white/60">
            <span className="eyebrow-num !text-accent-soft">03</span> Founding principle
          </p>
          <PhotoSlot
            src={FOUNDER.photo}
            alt={`Portrait of ${FOUNDER.name}`}
            awaiting="founder portrait"
            tone="dark"
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="mt-10 aspect-[4/5] w-full max-w-sm"
          />
        </div>
        <div className="flex flex-col justify-between lg:col-span-8">
          <blockquote className="reveal">
            <p className="font-display text-[2rem] font-light leading-[1.15] text-white sm:text-5xl lg:text-[3.6rem]">
              <span className="text-accent-soft">&ldquo;</span>
              {FOUNDER.quote}
              <span className="text-accent-soft">&rdquo;</span>
            </p>
            <footer className="mt-10 flex items-center gap-4 text-[15px]">
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <span>
                <span className="font-medium text-white">{FOUNDER.name}</span>
                <span className="text-white/60">, {FOUNDER.role}</span>
              </span>
            </footer>
          </blockquote>
          <div className="mt-14 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2">
            <p className="text-[15px] leading-relaxed text-white/70">
              Gmac Group began with a gap visible from both sides of the same room. Graduates were leaving university with
              credentials but without a route into work. Institutions were making decisions about those same graduates on
              evidence that was thin, imported or out of date.
            </p>
            <div className="flex flex-col justify-between gap-6">
              <p className="text-[15px] leading-relaxed text-white/70">
                The firm works remotely by design. The team assembles around a brief rather than a building.
              </p>
              <Link href="/about" className="link-arrow !text-white hover:!text-accent-soft">
                Read our story
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

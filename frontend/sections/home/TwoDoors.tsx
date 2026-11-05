import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { AUDIENCES } from "@/lib/content/site";

export function TwoDoors() {
  return (
    <section className="site-section">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">
              <span className="eyebrow-num">01</span> Who we serve
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="display-lg reveal max-w-[18ch]">Two audiences. One standard.</h2>
            <p className="lede reveal mt-6 max-w-[58ch]">
              A funder, a procurement lead and a recent graduate should each know within a moment which door is theirs.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Institutions */}
          <div className="reveal relative flex flex-col justify-between rounded-2xl bg-ink p-8 text-white sm:p-10 lg:col-span-7 border border-white/10 shadow-elevate border-t-4 border-t-accent-soft">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-label text-accent-soft">Institutions</p>
              <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl leading-tight">Organisations making decisions that have to hold.</h3>
              <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {AUDIENCES.institutions.map((a) => (
                  <li key={a.who} className="border-t border-white/15 py-4 transition-colors">
                    <p className="font-medium text-white">{a.who}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-white/70">{a.need}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/contact?topic=institution" className="btn-primary">
                Discuss a brief
                <Arrow />
              </Link>
            </div>
          </div>

          {/* Individuals */}
          <div className="reveal relative flex flex-col justify-between rounded-2xl border border-rule/90 bg-white p-8 sm:p-10 lg:col-span-5 shadow-card hover:shadow-card-hover border-t-4 border-t-accent transition-all duration-300">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-label text-accent">Individuals</p>
              <h3 className="mt-4 font-display text-3xl sm:text-4xl leading-tight text-ink">People investing in their own next step.</h3>
              <ul className="mt-8 space-y-1">
                {AUDIENCES.individuals.map((a) => (
                  <li key={a.who} className="border-t border-rule py-4">
                    <p className="font-medium text-ink">{a.who}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{a.need}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/programmes" className="btn-secondary">
                Find a programme
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

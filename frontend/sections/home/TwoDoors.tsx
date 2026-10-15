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

        <div className="mt-16 grid lg:grid-cols-12">
          {/* Institutions */}
          <div className="reveal bg-navy p-8 text-white sm:p-12 lg:col-span-7">
            <p className="text-[12px] font-medium uppercase tracking-label text-accent-soft">Institutions</p>
            <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">Organisations making decisions that have to hold.</h3>
            <ul className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {AUDIENCES.institutions.map((a) => (
                <li key={a.who} className="border-t border-white/15 py-5">
                  <p className="font-medium text-white">{a.who}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">{a.need}</p>
                </li>
              ))}
            </ul>
            <Link href="/contact?topic=institution" className="btn-primary mt-8">
              Discuss a brief
              <Arrow />
            </Link>
          </div>

          {/* Individuals */}
          <div className="reveal border border-t-0 border-rule bg-white p-8 sm:p-12 lg:col-span-5 lg:border-l-0 lg:border-t">
            <p className="text-[12px] font-medium uppercase tracking-label text-accent">Individuals</p>
            <h3 className="mt-4 font-display text-3xl sm:text-4xl">People investing in their own next step.</h3>
            <ul className="mt-10">
              {AUDIENCES.individuals.map((a) => (
                <li key={a.who} className="border-t border-rule py-5">
                  <p className="font-medium text-ink">{a.who}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-500">{a.need}</p>
                </li>
              ))}
            </ul>
            <Link href="/programmes" className="btn-secondary mt-8">
              Find a programme
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

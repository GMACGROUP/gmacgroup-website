import Link from "next/link";
import Image from "next/image";

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}

const stats = [
  { value: "2,000+", label: "Participants trained" },
  { value: "30+", label: "Countries reached" },
  { value: "10", label: "Research hubs" },
  { value: "22", label: "Specialists on the team" },
];

export function Hero() {
  return (
    <section className="relative bg-white">
      <div className="wrap grid items-stretch gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-24">
        {/* Copy */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="eyebrow">Human capital · Research · Investment</p>

          <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.04] text-ink sm:text-6xl lg:text-[4.25rem]">
            Building people.
            <br />
            <span className="text-ink-400">Building evidence.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-500">
            GMAC Group advises institutions, employers and investors across Africa. We connect talent to opportunity
            through applied research, workforce programmes and investment facilitation.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/contact" className="btn-primary">
              Start a conversation
              <ArrowRight />
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore our work
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <Image
              src="/images/hero-banner.jpg"
              alt="City skyline"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative bg-ink p-6 text-white sm:absolute sm:-bottom-6 sm:-left-8 sm:max-w-sm lg:-left-12">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-soft">Based in Accra</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/85">
              Working across ten focus markets, with specialists in Ghana, Nigeria, Zambia, Tanzania and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="border-y border-line">
        <dl className="wrap grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 sm:py-10 ${i % 2 === 1 ? "pl-6 sm:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              } ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="stat-number">{s.value}</dd>
              <dd className="mt-2 text-sm text-ink-500">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

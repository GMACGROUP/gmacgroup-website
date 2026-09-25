import Link from "next/link";
import Image from "next/image";

export function EcosystemSection() {
  const practiceAreas = [
    {
      number: "01",
      title: "Applied Research and Policy Consulting",
      description: "Decision-ready evidence, produced inside the markets it describes.",
      badge: "Research",
      image: "/images/service-policy-research.jpg",
      accent: "bg-brand-navy",
      badgeColor: "bg-blue-50 text-brand-navy border-blue-200",
    },
    {
      number: "02",
      title: "Institutional Capacity Building",
      description: "Training systems your institution can own, operate, and sustain.",
      badge: "Capacity",
      image: "/images/service-capacity-building.jpg",
      accent: "bg-brand-red",
      badgeColor: "bg-red-50 text-brand-red border-red-200",
    },
    {
      number: "03",
      title: "Human Capital and Workforce Consulting",
      description: "Workforce decisions made with a real view of the talent market.",
      badge: "Workforce",
      image: "/images/service-workforce-consulting.jpg",
      accent: "bg-cyan-600",
      badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
    },
    {
      number: "04",
      title: "Employability Programmes",
      description: "Structured routes from university application to career progression.",
      badge: "Employability",
      image: "/images/service-employability.jpg",
      accent: "bg-emerald-500",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      number: "05",
      title: "Signature Events and Workshops",
      description: "High-impact convenings that put the right stakeholders in the room.",
      badge: "Events",
      image: "/images/service-signature-events.jpg",
      accent: "bg-violet-500",
      badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      number: "06",
      title: "Investment Facilitation",
      description: "Connecting global capital to screened, investable African projects.",
      badge: "Investment",
      image: "/images/service-investment-capital.jpg",
      accent: "bg-amber-500",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  return (
    <section className="bg-slate-50 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mb-10 sm:mb-12 lg:mb-14">
          <span className="section-label bg-red-50 border border-red-200/80 text-brand-red mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
            What we do
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-serif text-slate-900 tracking-tight leading-[1.12]">
            Six practice areas. One standard.
          </h2>
          <p className="mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
            We build people, and we build the evidence institutions need to deploy them well. The same specialists work on both sides, which is why our advice holds up.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((item) => (
            <article
              key={item.number}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card hover:shadow-card-hover hover:border-brand-navy/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <span className="text-3xl font-extrabold leading-none text-white/40 font-sans tracking-tight drop-shadow-sm">
                    {item.number}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm group-hover:bg-brand-red group-hover:border-brand-red transition-colors">
                    Explore →
                  </span>
                </div>
              </div>

              <div className={`h-1.5 w-full ${item.accent} transition-all duration-300 group-hover:h-2`} />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-xl sm:text-[22px] font-bold font-serif text-slate-900 group-hover:text-brand-navy transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-1">
                  {item.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/services"
                    className="inline-flex items-center text-xs sm:text-sm font-bold text-brand-navy group-hover:text-brand-red transition-colors group/link"
                  >
                    <span>Explore practice area</span>
                    <span className="ml-1.5 transform transition-transform group-hover/link:translate-x-1.5">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


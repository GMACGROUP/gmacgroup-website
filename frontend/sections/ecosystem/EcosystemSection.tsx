import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, ClockIcon, MicroscopeIcon, FileTextIcon, AwardIcon } from "@/components/common/Icons";

export function EcosystemSection() {
  const practiceAreas = [
    {
      number: "01",
      title: "Applied Research and Policy Consulting",
      description: "Decision-ready evidence, produced inside the markets it describes.",
      badge: "Research",
      image: "/images/research-evidence.svg",
      accent: "bg-brand-navy",
    },
    {
      number: "02",
      title: "Institutional Capacity Building",
      description: "Training systems your institution can own and run.",
      badge: "Capacity",
      image: "/images/services-lab.jpg",
      accent: "bg-brand-red",
    },
    {
      number: "03",
      title: "Human Capital and Workforce Consulting",
      description: "Workforce decisions made with a real view of the talent market.",
      badge: "Workforce",
      image: "/images/workforce-network.svg",
      accent: "bg-brand-cyan",
    },
    {
      number: "04",
      title: "Employability Programmes",
      description: "Structured routes from application to offer.",
      badge: "Employability",
      image: "/images/insights-graduates.jpg",
      accent: "bg-emerald-500",
    },
    {
      number: "05",
      title: "Signature Events and Workshops",
      description: "Convenings that put the right room together.",
      badge: "Events",
      image: "/images/about-team.jpg",
      accent: "bg-violet-500",
    },
    {
      number: "06",
      title: "Investment Facilitation",
      description: "Connecting investors to screened, investable African projects.",
      badge: "Investment",
      image: "/images/investment-bridge.svg",
      accent: "bg-amber-500",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mb-10 lg:mb-12">
          <span className="section-label bg-red-50 border border-red-200/80 text-brand-red mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
            What we do
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-serif text-slate-900 tracking-tight leading-[1.12]">
            Six practice areas. One standard.
          </h2>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
            We build people, and we build the evidence institutions need to deploy them well. The same specialists work on both sides, which is why our advice holds up.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {practiceAreas.map((item) => (
            <article
              key={item.number}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card hover:shadow-card-hover hover:border-brand-navy/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="badge bg-white/95 text-slate-800 border border-white/80 shadow-sm font-bold text-[10px] uppercase tracking-[0.12em]">
                    {item.badge}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="text-[2.5rem] font-extrabold leading-none text-white/30 font-sans tracking-tight">
                    {item.number}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm group-hover:bg-brand-red group-hover:border-brand-red transition-colors">
                    Explore →
                  </span>
                </div>
              </div>

              <div className={`h-1.5 w-full ${item.accent} transition-all duration-300 group-hover:h-2`} />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-xl sm:text-[22px] font-bold font-serif text-slate-900 group-hover:text-brand-navy transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 flex-1">
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

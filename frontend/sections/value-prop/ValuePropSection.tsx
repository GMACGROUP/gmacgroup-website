import Link from "next/link";
import {
  AcademicCapIcon,
  MicroscopeIcon,
  BriefcaseIcon,
  TrendingUpIcon,
} from "@/components/common/Icons";

export function ValuePropSection() {
  const audienceCards = [
    {
      title: "Funders",
      subtitle: "Development agencies & funders",
      body: "Baseline studies, evaluations, and labour market evidence you can defend.",
      href: "/services",
      cta: "Commission research",
      icon: MicroscopeIcon,
      image: "/images/audience-funders.jpg",
      badgeColor: "bg-cyan-500/20 text-cyan-200 border-cyan-400/30",
      accentBorder: "group-hover:border-cyan-400/50",
      accentGlow: "from-cyan-500/15 via-transparent to-transparent",
      iconBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-white",
      tags: ["Baseline Diagnostics", "Impact Evaluation", "Labour Evidence"],
    },
    {
      title: "Employers",
      subtitle: "Employers building a workforce",
      body: "Graduate intake, talent assessment, and workforce strategy built on a real view of the market.",
      href: "/services",
      cta: "Build your workforce",
      icon: BriefcaseIcon,
      image: "/images/audience-employers.jpg",
      badgeColor: "bg-rose-500/20 text-rose-200 border-rose-400/30",
      accentBorder: "group-hover:border-rose-400/50",
      accentGlow: "from-rose-500/15 via-transparent to-transparent",
      iconBg: "bg-rose-500/20 text-rose-300 border-rose-400/30 group-hover:bg-brand-red group-hover:text-white",
      tags: ["Graduate Intake", "Skills Diagnostics", "Workforce Strategy"],
    },
    {
      title: "Investors",
      subtitle: "Investors seeking projects",
      body: "Screened deal flow, sector studies, and investment-ready projects across ten focus markets.",
      href: "/services",
      cta: "Find investable projects",
      icon: TrendingUpIcon,
      image: "/images/audience-investors.jpg",
      badgeColor: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
      accentBorder: "group-hover:border-emerald-400/50",
      accentGlow: "from-emerald-500/15 via-transparent to-transparent",
      iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30 group-hover:bg-emerald-500 group-hover:text-white",
      tags: ["Deal Origination", "Sector Deep-Dives", "Market Analysis"],
    },
    {
      title: "Professionals",
      subtitle: "Professionals & graduates",
      body: "Employability programmes, research methods training, and positioning for your next step.",
      href: "/programmes",
      cta: "Grow your career",
      icon: AcademicCapIcon,
      image: "/images/audience-professionals.jpg",
      badgeColor: "bg-purple-500/20 text-purple-200 border-purple-400/30",
      accentBorder: "group-hover:border-purple-400/50",
      accentGlow: "from-purple-500/15 via-transparent to-transparent",
      iconBg: "bg-purple-500/20 text-purple-300 border-purple-400/30 group-hover:bg-purple-500 group-hover:text-white",
      tags: ["Career Readiness", "Applied Research", "Executive Cohorts"],
    },
  ];

  return (
    <section className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80 border-b border-slate-200/80 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-100/30 via-cyan-100/20 to-red-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 lg:mb-14">
          <span className="section-label bg-cyan-50 border border-cyan-200/90 text-cyan-800 shadow-xs mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            How can we help?
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-serif text-slate-900 tracking-tight leading-[1.12]">
            Find the door that is yours.
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Institutions and investors first, professionals second. Tell us the decision you are trying to make.
          </p>
        </div>

        {/* 4 Audience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {audienceCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/60 bg-[#07111F] shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${card.accentBorder} min-h-[440px] sm:min-h-[460px] xl:min-h-[475px]`}
              >
                {/* Background Image with smooth hover scale */}
                <div
                  role="img"
                  aria-label={`${card.title} audience`}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{ backgroundImage: `url("${card.image}")` }}
                />

                {/* Multi-layered Dark Vignette Overlay for 100% Crisp Legibility */}
                <div className="absolute inset-0 bg-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06111E] via-[#06111E]/90 via-55% to-[#06111E]/30" />
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card Top: Badges & Icon */}
                <div className="relative z-10 flex items-center justify-between gap-2 p-5 sm:p-6">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${card.badgeColor}`}>
                    {card.title}
                  </span>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md shadow-sm transition-all duration-300 group-hover:scale-110 ${card.iconBg}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Card Bottom: Text Content, Tags, and Button */}
                <div className="relative z-10 flex flex-col justify-end p-5 sm:p-6 pt-0">
                  <h3 className="break-words font-serif text-xl sm:text-[22px] font-bold leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {card.subtitle}
                  </h3>
                  <p className="mt-2.5 break-words text-xs sm:text-sm leading-relaxed text-slate-200/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {card.body}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-white/20 bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-slate-100 backdrop-blur-md shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Action Button */}
                  <Link
                    href={card.href}
                    className="group/btn mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-white/30 bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-98"
                  >
                    <span className="truncate pr-2">{card.cta}</span>
                    <span className="text-brand-red font-bold transition-transform duration-200 group-hover/btn:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}




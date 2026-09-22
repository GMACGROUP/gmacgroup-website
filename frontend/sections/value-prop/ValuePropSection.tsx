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
      badgeColor: "bg-blue-50 text-brand-navy border-blue-200/90",
      accentGradient: "from-blue-600 to-cyan-500",
      iconBg: "bg-blue-50 text-brand-navy group-hover:bg-brand-navy group-hover:text-white",
      tags: ["Baseline Diagnostics", "Impact Evaluation", "Labour Evidence"],
    },
    {
      title: "Employers",
      subtitle: "Employers building a workforce",
      body: "Graduate intake, talent assessment, and workforce strategy built on a real view of the market.",
      href: "/services",
      cta: "Build your workforce",
      icon: BriefcaseIcon,
      badgeColor: "bg-red-50 text-brand-red border-red-200/90",
      accentGradient: "from-brand-red to-amber-500",
      iconBg: "bg-red-50 text-brand-red group-hover:bg-brand-red group-hover:text-white",
      tags: ["Graduate Intake", "Skills Diagnostics", "Workforce Strategy"],
    },
    {
      title: "Investors",
      subtitle: "Investors seeking projects",
      body: "Screened deal flow, sector studies, and investment-ready projects across ten focus markets.",
      href: "/services",
      cta: "Find investable projects",
      icon: TrendingUpIcon,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
      accentGradient: "from-emerald-500 to-teal-400",
      iconBg: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
      tags: ["Deal Origination", "Sector Deep-Dives", "Market Analysis"],
    },
    {
      title: "Professionals",
      subtitle: "Professionals & graduates",
      body: "Employability programmes, research methods training, and positioning for your next step.",
      href: "/programmes",
      cta: "Grow your career",
      icon: AcademicCapIcon,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/90",
      accentGradient: "from-purple-600 to-indigo-500",
      iconBg: "bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white",
      tags: ["Career Readiness", "Applied Research", "Executive Cohorts"],
    },
  ];


  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80 border-b border-slate-200/80 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-100/30 via-cyan-100/20 to-red-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-14">
          <span className="section-label bg-cyan-50 border border-cyan-200/90 text-cyan-800 shadow-xs mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            How can we help?
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold font-serif text-slate-900 tracking-tight leading-[1.12]">
            Find the door that is yours.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Institutions and investors first, professionals second. Tell us the decision you are trying to make.
          </p>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {audienceCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Top Accent Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${card.accentGradient} transition-all duration-300 group-hover:h-2`} />

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  {/* Top Badge & Icon Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`badge ${card.badgeColor}`}>
                      {card.title}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center transition-all duration-300 shadow-xs`}>
                      <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 group-hover:text-brand-navy transition-colors font-serif leading-snug">
                    {card.subtitle}
                  </h3>

                  {/* Card Body */}
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {card.body}
                  </p>

                  {/* Feature Tags for scannability */}
                  <div className="mt-4 flex flex-wrap gap-1.5 flex-1 items-end">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sleek CTA Link Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={card.href}
                      className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-brand-navy text-slate-800 hover:text-white font-bold text-xs sm:text-sm border border-slate-200/70 hover:border-brand-navy shadow-xs transition-all duration-200 group/btn"
                    >
                      <span>{card.cta}</span>
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function UsersIconComponent({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}



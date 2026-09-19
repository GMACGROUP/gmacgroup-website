import Link from "next/link";
import Image from "next/image";
import { AcademicCapIcon, MicroscopeIcon, BriefcaseIcon, GlobeIcon } from "@/components/common/Icons";

export function Hero() {
  const pillars = [
    {
      icon: AcademicCapIcon,
      title: "Cohort Pathways",
      subtitle: "Experiential Learning & Careers",
      color: "text-brand-cyan",
    },
    {
      icon: MicroscopeIcon,
      title: "Applied Research",
      subtitle: "Econometric & Policy Studies",
      color: "text-white",
    },
    {
      icon: BriefcaseIcon,
      title: "Executive Advisory",
      subtitle: "Human Capital Strategy",
      color: "text-brand-red",
    },
    {
      icon: GlobeIcon,
      title: "Pan-African Reach",
      subtitle: "Accra Hub & Global Network",
      color: "text-brand-cyan",
    },
  ];

  return (
    <section className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-navyDeep">
      {/* Background Image with Layered Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="GMAC GROUP - Connecting Talent to Opportunity"
          fill
          priority
          className="object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000"
        />
        {/* Navy & Cyan Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDeep/95 via-brand-navy/85 to-brand-navyDeep/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navyDeep via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28 text-center text-white">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-cyan text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase mb-5 sm:mb-6 shadow-glow">
          <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
          <span className="w-2 h-2 rounded-full bg-brand-red -ml-4" />
          Human Capital • Applied Research • Advisory
        </div>

        {/* Main Heading & Slogan */}
        <h1 className="text-[2.5rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto">
          <span className="italic font-serif font-normal block text-white drop-shadow-md">
            Connecting Talent to Opportunity
          </span>
          <span className="mt-2 text-lg sm:text-3xl lg:text-4xl font-sans font-bold text-slate-100 block opacity-95">
            Empowering the Next Generation of Global Impact
          </span>
        </h1>

        {/* Narrative Description */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-xl text-slate-200 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-sm">
          GMAC GROUP bridges learners, researchers, and forward-thinking institutions with actionable pathways from capability to career achievement.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          <Link
            href="/programmes"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-redDark shadow-elevate-red hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Explore Programmes
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Our Services
          </Link>
          <Link
            href="/opportunities"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-brand-cyan hover:text-white bg-brand-navyDeep/60 hover:bg-brand-navy/60 backdrop-blur-md border border-brand-cyan/30 hover:border-brand-cyan/60 transition-all duration-200"
          >
            Browse Opportunities →
          </Link>
        </div>

        {/* Institutional Pillars Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${p.color}`} />
                  <span className={`text-xs sm:text-sm md:text-base font-extrabold ${p.color}`}>{p.title}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-300 font-medium leading-relaxed">{p.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

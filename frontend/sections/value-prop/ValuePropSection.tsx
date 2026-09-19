import Link from "next/link";
import { AcademicCapIcon, MicroscopeIcon, BriefcaseIcon } from "@/components/common/Icons";

export function ValuePropSection() {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Top Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-600 text-[11px] font-bold tracking-wider uppercase shadow-xs">
            <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            WHAT WE DO
          </span>
        </div>

        {/* Two-Column Balanced Header */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-10 lg:mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072448] tracking-tight leading-tight">
              More than a talent platform. <br className="hidden sm:inline" />
              <span className="text-brand-navy font-serif font-normal italic">Empowering human capital & research.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              We bridge the systemic gap between capability and career achievement through cohort-based talent development, empirical research, and institutional advisory.
            </p>
          </div>
        </div>

        {/* 3 Domain Pillar Cards (matching reference layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Education & Employability */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-card hover:border-brand-navy/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header: Icon on left, 01 on right */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                  <AcademicCapIcon className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-sans tracking-tight">
                  01
                </span>
              </div>

              {/* Title & Body */}
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2.5">
                Education & Employability
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Cohort-based Career Readiness Labs, experiential skills workshops, and direct employer pipelines that prepare graduates for immediate workplace relevance.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/programmes" className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 group/link">
                <span>Explore Programmes</span>
                <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Applied Research & Fellowships (Featured Navy Card) */}
          <div className="group relative bg-[#072448] text-white rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-elevate hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden border border-brand-navy">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header: Icon on left, 02 on right */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-brand-cyan group-hover:scale-105 transition-transform">
                  <MicroscopeIcon className="w-5 h-5 text-brand-cyan" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white/25 font-sans tracking-tight">
                  02
                </span>
              </div>

              {/* Title & Body */}
              <h3 className="text-xl font-bold text-white mt-6 mb-2.5">
                Applied Research & Policy
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Econometric baseline studies, labor market diagnostics, and fellowship programs pairing emerging scholars with experienced policy researchers.
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
              <Link href="/research" className="text-xs font-bold text-brand-cyan hover:text-white transition-colors inline-flex items-center gap-1 group/link">
                <span>Discover Research Center</span>
                <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Strategic Consulting & Advisory */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-card hover:border-brand-navy/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header: Icon on left, 03 on right */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                  <BriefcaseIcon className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-sans tracking-tight">
                  03
                </span>
              </div>

              {/* Title & Body */}
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2.5">
                Consulting & Advisory
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Partnering with universities, enterprises, and governments on workforce diagnostics, talent architecture, and institutional capacity building.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/services" className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 group/link">
                <span>View Advisory Services</span>
                <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

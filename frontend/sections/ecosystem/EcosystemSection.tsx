import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, ClockIcon, MicroscopeIcon, FileTextIcon, AwardIcon } from "@/components/common/Icons";

export function EcosystemSection() {
  const liveOpportunities = [
    {
      id: "opportunity-research-fellowship",
      title: "Research & Policy Impact Fellowship",
      type: "Fellowship",
      badgeCls: "bg-purple-50 text-purple-700 border-purple-200",
      organization: "GMAC Applied Research Center",
      location: "Accra / Hybrid",
      deadline: "Oct 15, 2026",
    },
    {
      id: "opportunity-strategy-associate",
      title: "Human Capital Strategy Associate",
      type: "Employment",
      badgeCls: "bg-blue-50 text-brand-navy border-blue-200",
      organization: "GMAC Advisory Practice",
      location: "Accra / Global Remote",
      deadline: "Nov 01, 2026",
    },
    {
      id: "opportunity-research-internship",
      title: "Graduate Analytics & Econometrics Internship",
      type: "Internship",
      badgeCls: "bg-red-50 text-brand-red border-red-200",
      organization: "GMAC Innovation Labs",
      location: "Accra / Hybrid",
      deadline: "Oct 30, 2026",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-[11px] font-bold tracking-wider uppercase mb-2">
              OPPORTUNITIES & RESEARCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Active Cohorts & Evidence-Led Insights
            </h2>
          </div>
          <Link
            href="/opportunities"
            className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <span>View All Openings</span>
            <span>→</span>
          </Link>
        </div>

        {/* Dynamic Asymmetric Grid: 7 cols Opportunities / 5 cols Research Spotlight */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Live Openings List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {liveOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-card hover:border-brand-navy/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${opp.badgeCls} text-[10px] font-bold uppercase`}>
                      {opp.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                      <ClockIcon className="w-3 h-3 text-slate-400" />
                      Closes {opp.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-navy transition-colors">
                    {opp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{opp.organization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPinIcon className="w-3 h-3 text-brand-cyan" />
                      {opp.location}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/opportunities?opportunity=${encodeURIComponent(opp.id)}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-xs transition-all shrink-0 text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}

            {/* Quick Talent Network Box */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navyDeep text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-cyan shrink-0">
                  <AwardIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Join the GMAC Fellowship Network</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Receive early cohort notifications & research briefs</p>
                </div>
              </div>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-navy bg-white hover:bg-slate-100 transition-all shrink-0 text-center"
              >
                Join Network
              </Link>
            </div>
          </div>

          {/* Right Column: Featured Research Spotlight */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="group relative flex-1 bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-elevate transition-all duration-300 overflow-hidden flex flex-col justify-between">
              
              {/* Photo Banner */}
              <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/research-center.jpg"
                  alt="GMAC Research Center Study"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="badge bg-blue-600 text-white font-bold text-[10px] shadow-sm">
                    Flagship Working Paper
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-brand-cyan font-semibold">
                    <MicroscopeIcon className="w-4 h-4" />
                    <span>Applied Workforce Economics</span>
                  </div>
                </div>
              </div>

              {/* Research Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug group-hover:text-brand-navy transition-colors">
                    The Future of Work & Graduate Labor Transitions in Sub-Saharan Africa
                  </h3>
                  <p className="mt-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Comprehensive empirical assessment evaluating skill mismatches, institutional agility, and emerging technology adoption across key regional labor markets.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Lead: <strong className="text-slate-800">GMAC Research Faculty</strong>
                  </span>
                  <Link
                    href="/research"
                    className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1"
                  >
                    <span>Read Executive Summary</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

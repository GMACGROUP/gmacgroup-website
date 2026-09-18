import Link from "next/link";
import Image from "next/image";
import { MicroscopeIcon, FileTextIcon } from "@/components/common/Icons";

export function ResearchSection() {
  const highlights = [
    {
      title: "The Future of Work and Graduate Transitions",
      type: "Ongoing Study",
      accent: "bg-brand-navy",
      summary:
        "Comprehensive empirical assessment examining how learners navigate evolving African and global labor markets, skill mismatches, and emerging technology disruptions.",
      lead: "GMAC Research Team",
      badge: "Flagship Initiative",
      icon: MicroscopeIcon,
      image: "/images/research-center.jpg",
    },
    {
      title: "Institutional Capacity & Workforce Readiness Index",
      type: "Working Paper",
      accent: "bg-brand-red",
      summary:
        "A diagnostic framework evaluating organizational agility, talent retention strategies, and cross-sector training efficacy across higher education.",
      lead: "Policy & Human Capital Unit",
      badge: "Policy Brief",
      icon: FileTextIcon,
      image: "/images/insights-graduates.jpg",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-100 text-brand-red border border-red-200 mb-3">
            Evidence-Based Insights
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Applied Research & Policy Impact
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Generating actionable evidence to inform education policy, workforce development, and institutional strategy.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                {/* Photo Banner */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-brand-navy border border-blue-200 shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs text-white font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                      {item.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">GMAC Research Working Paper</span>
                  </div>
                </div>

                {/* Top Accent Strip */}
                <div className={`h-1 w-full ${item.accent}`} />

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 font-serif leading-snug group-hover:text-brand-navy transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed flex-1">
                    {item.summary}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Lead: <strong className="text-slate-900 font-bold">{item.lead}</strong>
                    </span>
                    <Link
                      href="/research"
                      className="text-sm font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 group/link"
                    >
                      <span>Read More</span>
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-brand-navy hover:text-white bg-white hover:bg-brand-navy border border-slate-300 hover:border-brand-navy shadow-card transition-all"
          >
            Explore Research Projects, Publications & Experts →
          </Link>
        </div>
      </div>
    </section>
  );
}

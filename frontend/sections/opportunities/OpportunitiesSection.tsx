import Link from "next/link";
import Image from "next/image";
import { MapPinIcon } from "@/components/common/Icons";

export function OpportunitiesSection() {
  const opportunities = [
    {
      id: "opp-1",
      title: "Research & Policy Impact Fellowship",
      type: "fellowship",
      accent: "bg-purple-600",
      organization: "GMAC GROUP Research Center",
      location: "Accra / Hybrid",
      description:
        "Join an elite cohort conducting baseline workforce transition studies and institutional capacity diagnostics.",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300 font-bold",
      image: "/images/service-policy-research.jpg",
    },
    {
      id: "opp-2",
      title: "Human Capital Strategy Associate",
      type: "employment",
      accent: "bg-brand-navy",
      organization: "GMAC Consulting Practice",
      location: "Accra / Global Remote",
      description:
        "Partner with cross-functional advisory teams supporting enterprise talent acquisition and executive development.",
      badgeColor: "bg-blue-100 text-brand-navy border-blue-300 font-bold",
      image: "/images/service-workforce-consulting.jpg",
    },
    {
      id: "opp-3",
      title: "Graduate Research & Analytics Internship",
      type: "internship",
      accent: "bg-brand-red",
      organization: "GMAC Applied Labs",
      location: "Accra / Hybrid",
      description:
        "High-velocity internship for emerging quantitative analysts and social science graduates.",
      badgeColor: "bg-red-100 text-brand-red border-red-300 font-bold",
      image: "/images/service-employability.jpg",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-100 text-brand-red border border-red-200 mb-3">
              Careers & Fellowships
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Connecting You to Your Next Horizon
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              Explore open internships, fellowships, and career opportunities across our ecosystem.
            </p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-white bg-brand-red hover:bg-brand-redDark shadow-elevate-red transition-all shrink-0"
          >
            Browse All Openings →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Photo Banner */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`badge ${item.badgeColor} capitalize shadow-sm`}>
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold text-slate-200 text-[11px] truncate max-w-[180px]">{item.organization}</span>
                  <span className="flex items-center gap-1 font-semibold text-brand-cyan shrink-0">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Top Accent Strip */}
              <div className={`h-1 w-full ${item.accent}`} />

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold text-slate-900 font-serif leading-snug group-hover:text-brand-navy transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center text-sm font-bold text-brand-navy hover:text-brand-red transition-colors group/link"
                  >
                    <span>Apply Now</span>
                    <span className="ml-1.5 group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

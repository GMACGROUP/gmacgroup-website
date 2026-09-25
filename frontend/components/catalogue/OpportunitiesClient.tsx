"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Opportunity } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { ApplicationModal } from "@/components/modals/ApplicationModal";
import { GlobeIcon, BriefcaseIcon, AwardIcon, BuildingIcon, MapPinIcon, ClockIcon } from "@/components/common/Icons";

const typeTabs = [
  { key: "all", label: "All Opportunities", icon: GlobeIcon },
  { key: "internship", label: "Internships", icon: BriefcaseIcon },
  { key: "fellowship", label: "Fellowships", icon: AwardIcon },
  { key: "employment", label: "Direct Employment", icon: BuildingIcon },
];

const typeBadges: Record<string, string> = {
  internship: "bg-red-50 text-brand-red border-red-200",
  fellowship: "bg-purple-50 text-purple-700 border-purple-200",
  employment: "bg-blue-50 text-brand-navy border-blue-200",
  other: "bg-slate-100 text-slate-600 border-slate-200",
};

const typeAccents: Record<string, string> = {
  internship: "bg-brand-red",
  fellowship: "bg-purple-600",
  employment: "bg-brand-navy",
  other: "bg-slate-400",
};

const typeImages: Record<string, string> = {
  internship: "/images/service-employability.jpg",
  fellowship: "/images/service-policy-research.jpg",
  employment: "/images/service-workforce-consulting.jpg",
  other: "/images/service-capacity-building.jpg",
};

export default function OpportunitiesClient({ opportunities: allOpportunities }: { opportunities: Opportunity[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedOpportunityId = searchParams?.get("opportunity") ?? null;
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const opportunities = typeFilter === "all"
    ? allOpportunities
    : allOpportunities.filter((opportunity) => opportunity.type === typeFilter);

  useEffect(() => {
    if (!requestedOpportunityId) return;
    const requestedOpportunity = allOpportunities.find((item) => item.id === requestedOpportunityId);
    if (!requestedOpportunity) return;
    setSelectedOpportunity(requestedOpportunity);
    router.replace(pathname ?? "/opportunities", { scroll: false });
  }, [allOpportunities, pathname, requestedOpportunityId, router]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Career & Fellowships"
        title="Connecting Talent to Opportunity"
        subtitle="Discover internships, professional roles, and high-impact research fellowships across GMAC GROUP and our global network."
      />
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        <div className="-mx-4 mb-10 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max flex-nowrap items-center justify-center gap-2 sm:min-w-0 sm:flex-wrap">
            {typeTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setTypeFilter(tab.key);
                  }}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    typeFilter === tab.key
                      ? "bg-brand-navy text-white border-brand-navy shadow-elevate"
                      : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy/40 hover:text-brand-navy"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {opportunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map((opp) => {
              const accent = typeAccents[opp.type] || typeAccents.other;
              const badgeCls = typeBadges[opp.type] || typeBadges.other;
              const imageSrc = typeImages[opp.type] || typeImages.other;
              const isClosed = Boolean(opp.deadline && new Date(opp.deadline).getTime() < Date.now());

              return (
                <article
                  key={opp.id}
                  className={`group relative flex flex-col rounded-2xl border shadow-card transition-all duration-300 overflow-hidden ${isClosed ? "bg-slate-100 border-slate-300 opacity-75" : "bg-white border-slate-200 hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1"}`}
                >
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100 sm:h-36">
                    <Image
                      src={imageSrc}
                      alt={opp.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
                      <span className={`badge px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[11px] ${isClosed ? "bg-slate-700 text-white border-slate-500" : badgeCls} capitalize shadow-sm`}>
                        {isClosed ? "Closed" : opp.type}
                      </span>
                    </div>
                    {opp.deadline && (
                      <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
                        <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                          <ClockIcon className="h-3 w-3 text-brand-cyan sm:h-3.5 sm:w-3.5" />
                          Closes {new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2 text-[10px] text-slate-200 sm:bottom-3 sm:left-4 sm:right-4 sm:gap-4 sm:text-xs">
                      {opp.organization && (
                        <span className="flex items-center gap-1 font-semibold truncate">
                          <BuildingIcon className="h-3 w-3 shrink-0 text-slate-300 sm:h-3.5 sm:w-3.5" />
                          <span className="truncate">{opp.organization}</span>
                        </span>
                      )}
                      {opp.location && (
                        <span className="flex items-center gap-1 font-semibold shrink-0">
                          <MapPinIcon className="h-3 w-3 shrink-0 text-brand-cyan sm:h-3.5 sm:w-3.5" />
                          {opp.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`h-1 w-full ${accent}`} />
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <h2 className="mb-2 text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-brand-navy sm:text-lg">
                      {opp.title}
                    </h2>
                    {opp.description && (
                      <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{opp.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 sm:mt-6 sm:gap-3 sm:pt-5">
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        disabled={isClosed}
                        className="btn-primary px-3 py-2 text-[10px] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:px-5 sm:py-2.5 sm:text-xs"
                      >
                        {isClosed ? "Closed" : "Apply for Opening →"}
                      </button>
                      <Link
                        href={`/contact?subject=Opportunity Inquiry: ${encodeURIComponent(opp.title)}`}
                        className="text-[10px] font-bold text-slate-500 transition-colors hover:text-brand-navy sm:text-xs"
                      >
                        Enquire Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state mt-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-ice text-brand-navy flex items-center justify-center mb-5 border border-blue-100">
              <GlobeIcon className="w-6 h-6 text-brand-navy" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">No Openings Available</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              No open positions in this category right now. Join our talent network to be first to know.
            </p>
            <Link href="/register" className="btn-primary mt-5">Join Talent Network →</Link>
          </div>
        )}
      </section>
      <ApplicationModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api/client";
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
  internship: "/images/services-lab.jpg",
  fellowship: "/images/research-center.jpg",
  employment: "/images/services-advisory.jpg",
  other: "/images/about-team.jpg",
};

function OpportunitiesPageContent() {
  const searchParams = useSearchParams();
  const requestedOpportunityId = searchParams.get("opportunity");
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    setLoading(true);
    const endpoint = "/opportunities/";
    apiClient
      .get<Opportunity[]>(endpoint)
      .then((data) => setAllOpportunities(data))
      .catch(() => setAllOpportunities([]))
      .finally(() => setLoading(false));
  }, []);

  const opportunities = typeFilter === "all"
    ? allOpportunities
    : allOpportunities.filter((opportunity) => opportunity.type === typeFilter);

  useEffect(() => {
    if (!requestedOpportunityId || loading) return;
    const requestedOpportunity = opportunities.find((item) => item.id === requestedOpportunityId);
    if (requestedOpportunity) setSelectedOpportunity(requestedOpportunity);
  }, [loading, opportunities, requestedOpportunityId]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Career & Fellowships"
        title="Connecting Talent to Opportunity"
        subtitle="Discover internships, professional roles, and high-impact research fellowships across GMAC GROUP and our global network."
      />

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
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

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden"
              >
                <div className="h-40 skeleton-shimmer" />
                <div className="p-7">
                  <div className="flex justify-between mb-5">
                    <div className="w-28 h-6 skeleton-shimmer rounded-full" />
                    <div className="w-24 h-5 skeleton-shimmer rounded" />
                  </div>
                  <div className="w-4/5 h-6 skeleton-shimmer rounded mb-3" />
                  <div className="w-full h-3 skeleton-shimmer rounded mb-2" />
                  <div className="w-5/6 h-3 skeleton-shimmer rounded mb-6" />
                  <div className="w-1/3 h-9 skeleton-shimmer rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Opportunities Grid */}
        {!loading && opportunities.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map((opp) => {
              const accent = typeAccents[opp.type] || typeAccents.other;
              const badgeCls = typeBadges[opp.type] || typeBadges.other;
              const imageSrc = typeImages[opp.type] || typeImages.other;

              return (
                <article
                  key={opp.id}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Photo Banner */}
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={opp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${badgeCls} capitalize shadow-sm`}>
                        {opp.type}
                      </span>
                    </div>
                    {opp.deadline && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1.5 text-xs text-white font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                          <ClockIcon className="w-3.5 h-3.5 text-brand-cyan" />
                          Closes {new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-4 text-xs text-slate-200">
                      {opp.organization && (
                        <span className="flex items-center gap-1 font-semibold truncate">
                          <BuildingIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          <span className="truncate">{opp.organization}</span>
                        </span>
                      )}
                      {opp.location && (
                        <span className="flex items-center gap-1 font-semibold shrink-0">
                          <MapPinIcon className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                          {opp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* top accent strip */}
                  <div className={`h-1 w-full ${accent}`} />

                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-navy transition-colors font-serif leading-snug mb-2.5">
                      {opp.title}
                    </h2>

                    {opp.description && (
                      <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-3">
                        {opp.description}
                      </p>
                    )}

                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        className="btn-primary text-xs px-5 py-2.5 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                      >
                        Apply for Opening →
                      </button>
                      <Link
                        href={`/contact?subject=Opportunity Inquiry: ${encodeURIComponent(opp.title)}`}
                        className="text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
                      >
                        Enquire Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && opportunities.length === 0 && (
          <div className="empty-state mt-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-ice text-brand-navy flex items-center justify-center mb-5 border border-blue-100">
              <GlobeIcon className="w-6 h-6 text-brand-navy" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">No Openings Available</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              No open positions in this category right now. Join our talent network to be first to know.
            </p>
            <Link href="/register" className="btn-primary mt-5">
              Join Talent Network →
            </Link>
          </div>
        )}
      </section>

      {/* Application Modal */}
      <ApplicationModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OpportunitiesPageContent />
    </Suspense>
  );
}

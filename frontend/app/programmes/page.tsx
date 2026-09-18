"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Programme } from "@/types";
import { ProgrammeCard } from "@/components/cards/ProgrammeCard";
import { PageHeader } from "@/components/common/PageHeader";
import { EnrolmentModal } from "@/components/modals/EnrolmentModal";
import { BookOpenIcon, AcademicCapIcon, WrenchIcon, BriefcaseIcon, BuildingIcon } from "@/components/common/Icons";

const filterTabs = [
  { key: "all", label: "All Programmes", icon: BookOpenIcon },
  { key: "student", label: "Student Pathways", icon: AcademicCapIcon },
  { key: "training", label: "Specialized Training", icon: WrenchIcon },
  { key: "professional_development", label: "Professional Dev", icon: BriefcaseIcon },
  { key: "institutional", label: "Institutional Capacity", icon: BuildingIcon },
];

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  useEffect(() => {
    setLoading(true);
    const endpoint = category === "all" ? "/programmes/" : `/programmes/?category=${category}`;
    apiClient
      .get<Programme[]>(endpoint)
      .then((data) => setProgrammes(data))
      .catch(() => setProgrammes([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Talent Development"
        title="Development Programmes"
        subtitle="Practical, cohort-based pathways connecting emerging talent and experienced professionals to transformative careers."
      />

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">

        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    category === tab.key
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

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden"
              >
                <div className="h-44 skeleton-shimmer" />
                <div className="p-7">
                  <div className="w-24 h-5 skeleton-shimmer rounded-full mb-4" />
                  <div className="w-3/4 h-6 skeleton-shimmer rounded mb-3" />
                  <div className="w-full h-3 skeleton-shimmer rounded mb-2" />
                  <div className="w-5/6 h-3 skeleton-shimmer rounded mb-6" />
                  <div className="w-1/3 h-8 skeleton-shimmer rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Programmes Grid */}
        {!loading && programmes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((p) => (
              <ProgrammeCard
                key={p.id}
                programme={p}
                onEnrol={(prog) => setSelectedProgramme(prog)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && programmes.length === 0 && (
          <div className="empty-state mt-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-5 border border-red-100">
              <AcademicCapIcon className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              No Programmes Active
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              No programmes are currently running in this category. New cohorts are enrolled periodically.
            </p>
            <Link href="/contact" className="btn-primary mt-5">
              Request Custom Cohort Advisory →
            </Link>
          </div>
        )}
      </section>

      {/* Enrolment Modal */}
      <EnrolmentModal
        programme={selectedProgramme}
        isOpen={Boolean(selectedProgramme)}
        onClose={() => setSelectedProgramme(null)}
      />
    </div>
  );
}

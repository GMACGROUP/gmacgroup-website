"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function ProgrammesClient({ programmes: allProgrammes }: { programmes: Programme[] }) {
  const [category, setCategory] = useState("all");
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const programmes = category === "all"
    ? allProgrammes
    : allProgrammes.filter((programme) => programme.category === category);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Talent Development"
        title="Development Programmes"
        subtitle="Practical, cohort-based pathways connecting emerging talent and experienced professionals to transformative careers."
      />
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        <div className="-mx-4 mb-10 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max flex-nowrap items-center gap-2 sm:min-w-0 sm:flex-wrap sm:justify-center">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
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
        {programmes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => (
              <ProgrammeCard key={programme.id} programme={programme} onEnrol={setSelectedProgramme} />
            ))}
          </div>
        ) : (
          <div className="empty-state mt-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-5 border border-red-100">
              <AcademicCapIcon className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">No Programmes Active</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              No programmes are currently running in this category. New cohorts are enrolled periodically.
            </p>
            <Link href="/contact" className="btn-primary mt-5">Request Custom Cohort Advisory →</Link>
          </div>
        )}
      </section>
      <EnrolmentModal
        programme={selectedProgramme}
        isOpen={Boolean(selectedProgramme)}
        onClose={() => setSelectedProgramme(null)}
      />
    </div>
  );
}
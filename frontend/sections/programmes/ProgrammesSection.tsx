"use client";

import { useState } from "react";
import Link from "next/link";
import { ProgrammeCard } from "@/components/cards/ProgrammeCard";
import { EnrolmentModal } from "@/components/modals/EnrolmentModal";
import { Programme } from "@/types";
import { ArrowRight } from "@/sections/hero/Hero";

export function ProgrammesSection() {
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  const sampleProgrammes = [
    {
      id: "programme-career-readiness",
      title: "Career Readiness Lab",
      category: "student" as const,
      description:
        "A rigorous, hands-on pathway designed to equip upcoming graduates and early-career talent with workplace intelligence, critical thinking, and industry preparedness.",
      start_date: null,
      end_date: null,
    },
    {
      id: "programme-research-skills",
      title: "Applied Research & Analytical Methods",
      category: "training" as const,
      description:
        "Comprehensive training in rigorous study design, qualitative & quantitative data synthesis, and actionable evidence-to-policy communication.",
      start_date: null,
      end_date: null,
    },
    {
      id: "programme-exec-leadership",
      title: "Executive Talent & Strategic HR Lab",
      category: "professional_development" as const,
      description:
        "Advanced human-capital development for leaders tasked with scaling teams, optimising workforce performance, and fostering institutional excellence.",
      start_date: null,
      end_date: null,
    },
  ];

  return (
    <section className="site-section bg-white">
      <div className="wrap">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Programmes</p>
            <h2 className="section-title mt-5">Flagship development programmes</h2>
            <p className="section-subtitle mt-5">
              Cohort based programmes that build practical skills for graduates, researchers and leaders.
            </p>
          </div>
          <Link href="/programmes" className="link-arrow shrink-0">
            All programmes
            <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {sampleProgrammes.map((programme) => (
            <ProgrammeCard
              key={programme.id}
              programme={programme}
              onEnrol={setSelectedProgramme}
            />
          ))}
        </div>
      </div>

      <EnrolmentModal
        programme={selectedProgramme}
        isOpen={Boolean(selectedProgramme)}
        onClose={() => setSelectedProgramme(null)}
      />
    </section>
  );
}

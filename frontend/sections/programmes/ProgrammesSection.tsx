import Link from "next/link";
import { ProgrammeCard } from "@/components/cards/ProgrammeCard";

export function ProgrammesSection() {
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
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="section-label text-brand-red block mb-2">
              Featured Pathways
            </span>
            <h2 className="section-title">
              Flagship Development Programmes
            </h2>
            <p className="section-subtitle mt-3">
              Curated, high-impact cohorts engineered to accelerate talent growth and drive institutional innovation.
            </p>
          </div>
          <Link
            href="/programmes"
            className="btn-secondary whitespace-nowrap"
          >
            All Programmes →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sampleProgrammes.map((programme) => (
            <ProgrammeCard key={programme.id} programme={programme} />
          ))}
        </div>
      </div>
    </section>
  );
}

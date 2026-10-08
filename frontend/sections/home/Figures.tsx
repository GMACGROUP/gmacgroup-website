import { FIGURES, teamFigures } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function Figures({ team }: { team: TeamMember[] }) {
  const figures = [...FIGURES, ...teamFigures(team)];
  return (
    <section aria-label="Gmac Group in figures" className="bg-teal text-white">
      <dl className="wrap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f, i) => (
          <div
            key={f.label}
            className={`reveal border-white/25 py-10 sm:py-12 ${i > 0 ? "border-t sm:border-t-0" : ""} ${
              i % 2 === 1 ? "sm:border-l sm:pl-8" : ""
            } ${i > 1 ? "sm:border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <dd className="stat-number text-white">{f.display}</dd>
            <dt className="mt-3 max-w-[26ch] text-[15px] leading-snug text-white/90">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { FIGURES, teamFigures } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function Figures({ team }: { team: TeamMember[] }) {
  const figures = [...FIGURES, ...teamFigures(team)];
  return (
    <section aria-label="Gmac Group in figures" className="bg-teal text-white">
      <dl className="wrap grid grid-cols-1 divide-y divide-white/20 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {figures.map((f, i) => (
          <div
            key={f.label}
            className={`reveal py-10 sm:py-12 ${
              i % 2 === 1 ? "sm:border-l sm:border-white/25 sm:pl-8" : ""
            } ${
              i >= 2 ? "sm:border-t sm:border-white/25" : ""
            } ${
              i > 0 ? "lg:border-l lg:border-white/25 lg:border-t-0 lg:pl-8" : ""
            } ${
              i === 0 ? "lg:pl-0" : ""
            }`}
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

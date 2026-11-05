import { FIGURES, teamFigures } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function Figures({ team }: { team: TeamMember[] }) {
  const figures = [...FIGURES, ...teamFigures(team)];
  return (
    <section aria-label="Gmac Group in figures" className="bg-teal text-white py-12 sm:py-14">
      <div className="wrap">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className="reveal rounded-xl border border-white/20 bg-white/10 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.14] hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <dd className="stat-number !text-white text-4xl sm:text-5xl font-display font-medium tracking-tight">
                {f.display}
              </dd>
              <dt className="mt-3 text-[14.5px] leading-relaxed text-white/85">
                {f.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

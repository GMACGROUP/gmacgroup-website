import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Portrait } from "@/components/editorial/Portrait";
import { TEAMS } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function TeamPreview({ team }: { team: TeamMember[] }) {
  const countries = new Set([...team.map((m) => m.country), "Ghana"]).size;
  const people = team.length + 1;
  const featured = [...team].sort((a, b) => Number(Boolean(b.photo_url)) - Number(Boolean(a.photo_url))).slice(0, 6);

  return (
    <section className="site-section">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">
            <span className="eyebrow-num">06</span> Our people
          </p>
          <h2 className="display-lg reveal mt-8">
            {people} colleagues. {TEAMS.length} teams. {countries} countries.
          </h2>
          <p className="lede reveal mt-6">
            Every engagement is delivered by the team that owns the capability, never by generalists stretched across all
            of them.
          </p>
          <ul className="mt-10 border-t border-ink">
            {TEAMS.map((t) => {
              const n = team.filter((m) => m.team === t.name).length;
              return (
                <li key={t.name} className="flex items-baseline justify-between gap-4 border-b border-rule py-4 text-[15px]">
                  <span className="text-ink">{t.name}</span>
                  <span className="tabular-nums text-ink-400">{n}</span>
                </li>
              );
            })}
          </ul>
          <Link href="/team" className="btn-dark mt-10">
            Meet the team
            <Arrow />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 self-center lg:col-span-7 lg:col-start-6">
          {featured.map((m, k) => (
            <div
              key={m.id}
              className={`group reveal rounded-xl border border-rule/80 bg-white p-2.5 sm:p-3 shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all duration-300 ${
                k % 3 === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="overflow-hidden rounded-lg bg-stone/40">
                <Portrait
                  name={m.name}
                  src={m.photo_url}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 18vw"
                />
              </div>
              <div className="px-1 pt-3 pb-1">
                <p className="text-[14.5px] font-bold text-ink group-hover:text-accent transition-colors leading-snug">{m.name}</p>
                <p className="mt-0.5 text-xs text-ink-500 leading-snug">
                  {m.position}, {m.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

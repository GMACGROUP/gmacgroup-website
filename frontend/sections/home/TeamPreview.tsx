import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Portrait } from "@/components/editorial/Portrait";
import { TEAMS } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function TeamPreview({ team }: { team: TeamMember[] }) {
  const countries = new Set(team.map((m) => m.country)).size;
  const featured = [...team].sort((a, b) => Number(Boolean(b.photo_url)) - Number(Boolean(a.photo_url))).slice(0, 6);

  return (
    <section className="site-section">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">
            <span className="eyebrow-num">06</span> Our people
          </p>
          <h2 className="display-lg reveal mt-8">
            {team.length} colleagues. {TEAMS.length} teams. {countries} countries.
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
                  <span className="flex items-baseline gap-4">
                    <span className="text-sm tabular-nums text-accent">{t.number}</span>
                    <span className="text-ink">{t.name}</span>
                  </span>
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

        <div className="grid grid-cols-2 gap-4 self-end sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {featured.map((m, k) => (
            <Link key={m.id} href="/team" className={`group reveal block ${k % 3 === 1 ? "sm:translate-y-10" : ""}`}>
              <Portrait name={m.name} src={m.photo_url} className="aspect-[3/4] w-full" sizes="(max-width: 640px) 50vw, 18vw" />
              <p className="mt-3 text-[15px] font-medium text-ink">{m.name}</p>
              <p className="text-sm text-ink-500">
                {m.position}, {m.country}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

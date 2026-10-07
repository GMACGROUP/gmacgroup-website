"use client";

import { useMemo, useState } from "react";
import { Portrait } from "@/components/editorial/Portrait";
import { TEAMS } from "@/lib/content/site";
import type { TeamMember } from "@/lib/content/team-seed";

export function TeamDirectory({ members }: { members: TeamMember[] }) {
  const [filter, setFilter] = useState<string>("All");
  const groups = useMemo(
    () =>
      TEAMS.map((t) => ({ ...t, members: members.filter((m) => m.team === t.name) })).filter(
        (g) => g.members.length > 0 && (filter === "All" || g.name === filter)
      ),
    [members, filter]
  );

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-5 border-b border-rule bg-paper/95 px-5 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div role="tablist" aria-label="Filter by team" className="flex gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8">
          {["All", ...TEAMS.map((t) => t.name)].map((name) => {
            const count = name === "All" ? members.length : members.filter((m) => m.team === name).length;
            const active = filter === name;
            return (
              <button
                key={name}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setFilter(name)}
                className={`-mb-px flex shrink-0 items-baseline gap-2 border-b-2 py-4 text-[14.5px] transition-colors ${
                  active ? "border-accent text-ink" : "border-transparent text-ink-500 hover:text-ink"
                }`}
              >
                {name}
                <span className="text-xs tabular-nums text-ink-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.name} aria-labelledby={`team-${g.number}`} className="grid gap-10 border-b border-rule py-14 lg:grid-cols-12 lg:py-20">
          <header className="lg:col-span-3">
            <p className="text-sm tabular-nums text-accent">Unit {g.number}</p>
            <h2 id={`team-${g.number}`} className="mt-3 font-display text-3xl leading-tight">
              {g.name}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-500">{g.remit}</p>
          </header>

          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:col-span-9 xl:grid-cols-4">
            {g.members.map((m) => (
              <li key={m.id} className="group">
                <Portrait name={m.name} src={m.photo_url} className="aspect-[4/5] w-full" sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 220px" />
                <div className="mt-4 border-t border-ink/15 pt-3">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-xl leading-tight text-ink">{m.name}</span>
                    {m.is_lead && (
                      <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-label text-clay">Lead</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-ink-600">{m.position}</p>
                  <p className="mt-1 text-sm text-ink-400">{m.country}</p>
                  {m.linkedin_url && (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-accent hover:underline"
                    >
                      LinkedIn<span className="sr-only"> profile of {m.name}</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

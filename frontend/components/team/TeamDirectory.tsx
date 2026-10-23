"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Portrait } from "@/components/editorial/Portrait";
import { TEAMS } from "@/lib/content/site";
import { getTeamMemberSlug } from "@/lib/content/team-bios";
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
        <section key={g.name} aria-labelledby={`team-${g.number}`} className="grid grid-cols-1 gap-10 border-b border-rule py-14 lg:grid-cols-12 lg:py-20">
          <header className="lg:col-span-3">
            <h2 id={`team-${g.number}`} className="font-display text-3xl leading-tight">
              {g.name}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-500">{g.remit}</p>
          </header>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
            {g.members.map((m) => {
              const memberSlug = getTeamMemberSlug(m.name);
              return (
                <li
                  key={m.id}
                  className="group flex flex-col justify-between border border-rule/80 bg-white p-5 shadow-[0_2px_12px_-4px_rgba(14,26,43,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <div>
                    <Link href={`/team/${memberSlug}`} className="block overflow-hidden bg-stone/40">
                      <Portrait
                        name={m.name}
                        src={m.photo_url}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
                      />
                    </Link>

                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/team/${memberSlug}`}
                          className="font-display text-[1.35rem] font-bold leading-snug text-accent transition-colors hover:text-accent-dark sm:text-[1.5rem]"
                        >
                          {m.name}
                        </Link>
                        {m.is_lead && (
                          <span className="shrink-0 rounded bg-clay/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-label text-clay">
                            Lead
                          </span>
                        )}
                      </div>
                      
                      <p className="mt-2 text-[14.5px] leading-snug text-ink-700">
                        {m.position}
                      </p>
                      <p className="mt-1 text-[13.5px] text-ink-500">
                        {m.country}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-rule pt-4">
                    <Link
                      href={`/team/${memberSlug}`}
                      className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent transition-all hover:text-accent-dark group-hover:gap-2.5"
                    >
                      Learn More
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

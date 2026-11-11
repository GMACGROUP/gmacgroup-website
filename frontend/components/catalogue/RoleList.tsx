"use client";

import { useEffect, useState } from "react";
import type { Opportunity } from "@/types";
import { ApplicationModal, ROLE_TYPE } from "@/components/modals/ApplicationModal";
import { Arrow } from "@/components/ui/Arrow";

export function RoleList({ roles }: { roles: Opportunity[] }) {
  const [active, setActive] = useState<Opportunity | null>(null);

  // Deep link: /careers?apply=<id> opens the form directly.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("apply");
    if (id) setActive(roles.find((r) => r.id === id) ?? null);
  }, [roles]);

  return (
    <>
      <ol className="border-t border-ink">
        {roles.map((r) => {
          const closed = Boolean(r.deadline && new Date(r.deadline).getTime() < Date.now());
          return (
            <li key={r.id} id={r.id} className="grid grid-cols-1 gap-6 border-b border-rule py-9 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[12px] font-medium uppercase tracking-label text-clay">{ROLE_TYPE[r.type] || "Opportunity"}</p>
                <p className="mt-3 text-sm text-ink-500">{r.location || "Remote"}</p>
              </div>
              <div className="lg:col-span-6">
                <h3 className="font-display text-2xl leading-snug sm:text-[28px]">{r.title}</h3>
                {r.description && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-600">{r.description}</p>}
                {r.deadline && (
                  <p className="mt-3 text-sm tabular-nums text-ink-500">
                    Apply by {new Date(r.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
              <div className="lg:col-span-3 lg:text-right">
                {closed ? (
                  <span className="text-sm text-ink-400">Applications closed</span>
                ) : (
                  <button type="button" onClick={() => setActive(r)} className="btn-primary">
                    Apply
                    <Arrow />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <ApplicationModal opportunity={active} isOpen={Boolean(active)} onClose={() => setActive(null)} />
    </>
  );
}

"use client";

import { useState } from "react";
import type { Programme } from "@/types";
import { EnrolmentModal } from "@/components/modals/EnrolmentModal";
import { money } from "@/components/modals/Dialog";
import { Arrow } from "@/components/ui/Arrow";

const CATEGORY: Record<string, string> = {
  student: "Students and graduates",
  professional_development: "Professional development",
  training: "Training",
  institutional: "Institutions",
};

function d(iso?: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
}

function priceLine(p: Programme) {
  const offers = p.offers || [];
  if (!offers.length) return null;
  const paid = offers.filter((o) => o.amount > 0);
  const free = offers.some((o) => o.amount === 0);
  if (!paid.length) return "No fee";
  const min = Math.min(...paid.map((o) => o.amount));
  return `${free ? "Free option; paid options from" : "From"} ${money(min, paid[0].currency)}`;
}

export function ProgrammeList({ programmes }: { programmes: Programme[] }) {
  const [active, setActive] = useState<Programme | null>(null);
  return (
    <>
      <ol className="border-t border-ink">
        {programmes.map((p) => {
          const closed = Boolean(p.end_date && new Date(p.end_date).getTime() < Date.now());
          const price = priceLine(p);
          return (
            <li key={p.id} className="grid grid-cols-1 gap-6 border-b border-rule py-9 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[12px] font-medium uppercase tracking-label text-clay">{CATEGORY[p.category] || "Programme"}</p>
                {(p.start_date || p.end_date) && (
                  <p className="mt-3 text-sm tabular-nums text-ink-500">
                    {[d(p.start_date), d(p.end_date)].filter(Boolean).join(" to ")}
                  </p>
                )}
              </div>
              <div className="lg:col-span-6">
                <h3 className="font-display text-2xl leading-snug sm:text-[28px]">{p.title}</h3>
                {p.description && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-600">{p.description}</p>}
                {price && <p className="mt-3 text-sm text-ink-500">{price}</p>}
              </div>
              <div className="lg:col-span-3 lg:text-right">
                {closed ? (
                  <span className="text-sm text-ink-400">Enrolment closed</span>
                ) : (
                  <button type="button" onClick={() => setActive(p)} className="btn-primary">
                    Enrol
                    <Arrow />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <EnrolmentModal programme={active} isOpen={Boolean(active)} onClose={() => setActive(null)} />
    </>
  );
}

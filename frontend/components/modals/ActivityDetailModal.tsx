"use client";

import { Opportunity, Programme } from "@/types";
import { AcademicCapIcon, BriefcaseIcon, XMarkIcon } from "@/components/common/Icons";

type ActivityPreview = {
  kind: "programme" | "opportunity";
  title: string;
  status: string;
  createdAt: string;
};

interface ActivityDetailModalProps {
  preview: ActivityPreview | null;
  details: Programme | Opportunity | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function ActivityDetailModal({
  preview,
  details,
  loading,
  error,
  onClose,
}: ActivityDetailModalProps) {
  if (!preview) return null;

  const isProgramme = preview.kind === "programme";
  const programme = isProgramme ? (details as Programme | null) : null;
  const opportunity = !isProgramme ? (details as Opportunity | null) : null;
  const offers = details?.offers || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className={`h-2 ${isProgramme ? "bg-gradient-to-r from-brand-cyan via-brand-navy to-brand-red" : "bg-gradient-to-r from-brand-red via-brand-cyan to-brand-navy"}`} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close activity details"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 pr-10">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isProgramme ? "bg-brand-ice text-brand-navy" : "bg-red-50 text-brand-red"}`}>
              {isProgramme ? <AcademicCapIcon className="h-5 w-5" /> : <BriefcaseIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {isProgramme ? "Enrolled programme" : "Submitted application"}
              </p>
              <h2 className="mt-1 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{preview.title}</h2>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">{preview.status || "Active"}</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
              {isProgramme ? "Enrolled" : "Submitted"} {new Date(preview.createdAt).toLocaleDateString()}
            </span>
          </div>

          {loading && <div className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100" />}
          {error && <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

          {!loading && !error && details && (
            <div className="mt-8 space-y-6">
              {details.description && <p className="text-base leading-relaxed text-slate-600">{details.description}</p>}

              <dl className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-2">
                {isProgramme && programme && (
                  <>
                    <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</dt><dd className="mt-1 capitalize text-sm font-semibold text-slate-800">{programme.category.replaceAll("_", " ")}</dd></div>
                    {programme.start_date && <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Starts</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{new Date(programme.start_date).toLocaleDateString()}</dd></div>}
                    {programme.end_date && <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Ends</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{new Date(programme.end_date).toLocaleDateString()}</dd></div>}
                  </>
                )}
                {!isProgramme && opportunity && (
                  <>
                    <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</dt><dd className="mt-1 capitalize text-sm font-semibold text-slate-800">{opportunity.type}</dd></div>
                    {opportunity.organization && <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Organisation</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{opportunity.organization}</dd></div>}
                    {opportunity.location && <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{opportunity.location}</dd></div>}
                    {opportunity.deadline && <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Deadline</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{new Date(opportunity.deadline).toLocaleDateString()}</dd></div>}
                  </>
                )}
              </dl>

              {offers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Available offers</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {offers.map((offer) => (
                      <div key={offer.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-bold text-slate-900">{offer.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{offer.amount === 0 ? "No fee" : `${offer.currency} ${offer.amount}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
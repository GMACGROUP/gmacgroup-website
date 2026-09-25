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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative max-h-[calc(100dvh-5rem)] w-[min(100%,38rem)] overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
        <div className={`h-2 ${isProgramme ? "bg-gradient-to-r from-brand-cyan via-brand-navy to-brand-red" : "bg-gradient-to-r from-brand-red via-brand-cyan to-brand-navy"}`} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close activity details"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-2.5 pr-9">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isProgramme ? "bg-brand-ice text-brand-navy" : "bg-red-50 text-brand-red"}`}>
              {isProgramme ? <AcademicCapIcon className="h-4 w-4" /> : <BriefcaseIcon className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                {isProgramme ? "Enrolled programme" : "Submitted application"}
              </p>
              <h2 className="mt-0.5 text-lg font-bold leading-snug text-slate-900 sm:text-xl">{preview.title}</h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">{preview.status || "Active"}</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
              {isProgramme ? "Enrolled" : "Submitted"} {new Date(preview.createdAt).toLocaleDateString()}
            </span>
          </div>

          {loading && <div className="mt-6 h-32 animate-pulse rounded-2xl bg-slate-100" />}
          {error && <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {!loading && !error && details && (
            <div className="mt-6 space-y-5">
              {details.description && <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">{details.description}</p>}

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-slate-200 py-4">
                {isProgramme && programme && (
                  <>
                    <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</dt><dd className="mt-0.5 capitalize text-sm font-semibold text-slate-800">{programme.category.replaceAll("_", " ")}</dd></div>
                    {programme.start_date && <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starts</dt><dd className="mt-0.5 text-sm font-semibold text-slate-800">{new Date(programme.start_date).toLocaleDateString()}</dd></div>}
                    {programme.end_date && <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ends</dt><dd className="mt-0.5 text-sm font-semibold text-slate-800">{new Date(programme.end_date).toLocaleDateString()}</dd></div>}
                  </>
                )}
                {!isProgramme && opportunity && (
                  <>
                    <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</dt><dd className="mt-0.5 capitalize text-sm font-semibold text-slate-800">{opportunity.type}</dd></div>
                    {opportunity.organization && <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organisation</dt><dd className="mt-0.5 text-sm font-semibold text-slate-800">{opportunity.organization}</dd></div>}
                    {opportunity.location && <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</dt><dd className="mt-0.5 text-sm font-semibold text-slate-800">{opportunity.location}</dd></div>}
                    {opportunity.deadline && <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deadline</dt><dd className="mt-0.5 text-sm font-semibold text-slate-800">{new Date(opportunity.deadline).toLocaleDateString()}</dd></div>}
                  </>
                )}
              </dl>

              {offers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Available offers</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {offers.map((offer) => (
                      <div key={offer.type} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-sm font-bold text-slate-900">{offer.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{offer.amount === 0 ? "No fee" : `${offer.currency} ${offer.amount}`}</p>
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
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import { OfferType, Programme } from "@/types";
import { AcademicCapIcon, CheckCircleIcon, XMarkIcon } from "@/components/common/Icons";

interface EnrolmentModalProps {
  programme: Programme | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EnrolmentModal({
  programme,
  isOpen,
  onClose,
  onSuccess,
}: EnrolmentModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerType, setOfferType] = useState<OfferType>("free");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    notes: "",
  });

  useEffect(() => {
    if (user && typeof user === "object") {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        organization: user.organization || prev.organization,
      }));
    }
    setSubmitted(false);
    setError(null);
    setOfferType(programme?.offers?.[0]?.type || "free");
  }, [user, isOpen, programme]);

  if (!isOpen || !programme) return null;

  const isClosed = Boolean(programme.end_date && new Date(programme.end_date).getTime() < Date.now());

  if (isClosed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop-in">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center modal-panel-in" role="dialog" aria-modal="true">
          <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100" aria-label="Close modal">
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <AcademicCapIcon className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">Enrolment is closed</h2>
          <p className="mt-2 text-sm text-slate-600">The dates for {programme.title} have passed. This form is no longer available.</p>
          <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-navy hover:bg-brand-navyDark">Close</button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!programme) return;
    setSubmitting(true);
    setError(null);

    try {
      const offer = programme.offers?.find((item) => item.type === offerType);
      if (offer && offer.amount > 0) {
        const payment = await apiClient.post<{ checkout_url?: string }>("/payments/initialize", {
          target_type: "programme",
          target_id: programme.id,
          offer_type: offer.type,
          email: formData.email,
          full_name: formData.full_name,
          details: formData,
        });
        if (payment.checkout_url) window.location.assign(payment.checkout_url);
        return;
      }
      await apiClient.post(`/programmes/${programme.id}/enrol`, { ...formData, offer_type: offerType });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enrol in programme");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop-in">
      <div
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 modal-panel-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Gradient Stripe */}
        <div className="h-2 bg-gradient-to-r from-brand-red via-brand-cyan to-brand-navy" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-2 text-brand-red text-xs font-bold uppercase tracking-wider">
                <AcademicCapIcon className="w-4 h-4" />
                <span>Cohort Enrolment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
                Enrol in {programme.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Category: <span className="capitalize font-semibold">{programme.category?.replace("_", " ")}</span>
                {programme.start_date && (
                  <span> • Starts {new Date(programme.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                )}
              </p>

              {programme.offers && programme.offers.length > 0 && (
                <label className="block mb-5">
                  <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Choose an offer</span>
                  <select
                    value={offerType}
                    onChange={(event) => setOfferType(event.target.value as OfferType)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                  >
                    {programme.offers.map((offer) => (
                      <option key={offer.type} value={offer.type}>
                        {offer.amount === 0 ? offer.label : `${offer.label} - ${offer.currency} ${offer.amount}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="e.g. Ama Osei"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="ama@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 24 123 4567"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Institution / Employer
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      placeholder="e.g. University of Ghana / Org"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Cohort Goals & Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Tell us what you hope to achieve through this programme..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900 resize-none"
                  />
                </div>

                {error && (
                  <p className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center">
                    {error}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-red hover:bg-brand-redDark shadow-md hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan transition-all disabled:opacity-50"
                  >
                    {submitting ? "Processing Enrolment..." : "Confirm Cohort Enrolment →"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                Enrolment Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                You have been registered for <strong>{programme.title}</strong>. Check your inbox at{" "}
                <strong>{formData.email}</strong> for cohort access details and session timetable.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-sm transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

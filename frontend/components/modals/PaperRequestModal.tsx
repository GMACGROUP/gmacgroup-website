"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import { Publication } from "@/types";
import { BookOpenIcon, CheckCircleIcon, XMarkIcon } from "@/components/common/Icons";

interface PaperRequestModalProps {
  publication: Publication | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaperRequestModal({
  publication,
  isOpen,
  onClose,
}: PaperRequestModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    organization: "",
    purpose: "Academic Research / Policy Review",
  });

  useEffect(() => {
    if (user && typeof user === "object") {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        organization: user.organization || prev.organization,
      }));
    }
    setSubmitted(false);
    setError(null);
  }, [user, isOpen, publication]);

  if (!isOpen || !publication) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!publication) return;
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/research/request-publication", {
        publication_id: publication.id,
        publication_title: publication.title,
        ...formData,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request publication");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Gradient Stripe */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-brand-navy to-brand-cyan" />

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
              <div className="flex items-center gap-2 mb-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <BookOpenIcon className="w-4 h-4" />
                <span>Working Paper Request</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
                Request Working Paper
              </h2>
              <div className="bg-purple-50/70 rounded-xl p-3.5 border border-purple-100 mt-2 mb-6">
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {publication.title}
                </p>
                {publication.authors && publication.authors.length > 0 && (
                  <p className="text-[11px] text-purple-900 mt-1 font-medium">
                    Authors: {publication.authors.join(", ")}
                  </p>
                )}
              </div>

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
                      placeholder="e.g. Dr. Kwame Mensah"
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
                      placeholder="kwame@university.edu"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Institution / Think Tank
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      placeholder="e.g. Policy Institute / Faculty"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Primary Purpose
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData({ ...formData, purpose: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all text-slate-900"
                    >
                      <option value="Academic Research">Academic Research</option>
                      <option value="Policy & Institutional Advisory">Policy & Advisory</option>
                      <option value="Government / Development Agency">Government / Multilateral</option>
                      <option value="Graduate Study">Graduate Study / Thesis</option>
                      <option value="Corporate Workforce Planning">Corporate Planning</option>
                    </select>
                  </div>
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
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? "Requesting PDF..." : "Request Working Paper →"}
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
                Working Paper Dispatched!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                A digital pre-print copy of <strong>{publication.title}</strong> has been queued for delivery to{" "}
                <strong>{formData.email}</strong>.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

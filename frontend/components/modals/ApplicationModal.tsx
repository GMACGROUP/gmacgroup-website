"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import type { OfferType, Opportunity } from "@/types";
import { Dialog, money } from "@/components/modals/Dialog";
import { DocumentUploadDropzone } from "@/components/forms/DocumentUploadDropzone";
import { Arrow } from "@/components/ui/Arrow";

interface ApplicationModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ROLE_TYPE: Record<string, string> = {
  internship: "Internship",
  employment: "Role",
  fellowship: "Fellowship",
  other: "Opportunity",
};

export function ApplicationModal({ opportunity, isOpen, onClose, onSuccess }: ApplicationModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerType, setOfferType] = useState<OfferType>("free");
  const [form, setForm] = useState({
    applicant_name: "",
    applicant_email: "",
    phone: "",
    linkedin_url: "",
    resume_url: "",
    cover_note: "",
  });

  useEffect(() => {
    if (user && typeof user === "object") {
      setForm((f) => ({
        ...f,
        applicant_name: user.full_name || f.applicant_name,
        applicant_email: user.email || f.applicant_email,
        phone: user.phone || f.phone,
      }));
    }
    setSubmitted(false);
    setError(null);
    setOfferType(opportunity?.offers?.[0]?.type || "free");
  }, [user, isOpen, opportunity]);

  if (!isOpen || !opportunity) return null;

  const closed = Boolean(opportunity.deadline && new Date(opportunity.deadline).getTime() < Date.now());
  const offer = opportunity.offers?.find((o) => o.type === offerType);
  const paid = Boolean(offer && offer.amount > 0);
  const meta = [
    opportunity.location,
    opportunity.deadline &&
      `Apply by ${new Date(opportunity.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
  ]
    .filter(Boolean)
    .join(" · ");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!opportunity) return;
    if (form.linkedin_url && !/^https:\/\//.test(form.linkedin_url)) {
      setError("Profile links must start with https://");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (offer && offer.amount > 0) {
        const payment = await apiClient.post<{ checkout_url?: string }>("/payments/initialize", {
          target_type: "opportunity",
          target_id: opportunity.id,
          offer_type: offer.type,
          email: form.applicant_email,
          full_name: form.applicant_name,
          details: form,
        });
        if (payment.checkout_url) window.location.assign(payment.checkout_url);
        return;
      }
      await apiClient.post(`/opportunities/${opportunity.id}/apply`, { ...form, offer_type: offerType });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      eyebrow={submitted ? "Application received" : ROLE_TYPE[opportunity.type] || "Opportunity"}
      title={submitted ? `Thank you, ${form.applicant_name.split(" ")[0] || "for applying"}.` : opportunity.title}
      meta={!submitted && meta ? meta : undefined}
    >
      {closed ? (
        <div>
          <p className="text-[15px] leading-relaxed text-ink-600">
            Applications for this opportunity have closed. You are welcome to send a speculative note for future roles.
          </p>
          <Link href="/contact?topic=careers" className="btn-primary mt-6">
            Write to us
            <Arrow />
          </Link>
        </div>
      ) : submitted ? (
        <div role="status">
          <p className="text-[15px] leading-relaxed text-ink-600">
            Your application for <strong className="font-medium text-ink">{opportunity.title}</strong> has reached our team. A
            confirmation is on its way to {form.applicant_email}. We reply to every applicant once the shortlist is decided.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {opportunity.offers && opportunity.offers.length > 1 && (
            <fieldset>
              <legend className="field-label">Choose an option</legend>
              <div className="mt-1 divide-y divide-rule border border-ink/20 bg-white">
                {opportunity.offers.map((o) => (
                  <label key={o.type} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="offer" value={o.type} checked={offerType === o.type} onChange={() => setOfferType(o.type)} className="accent-[#0B5CAD]" />
                      <span className="text-ink">{o.label}</span>
                    </span>
                    <span className="tabular-nums text-ink-500">{o.amount > 0 ? money(o.amount, o.currency) : "No fee"}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ap-name" className="field-label">Full name *</label>
              <input id="ap-name" required autoComplete="name" className="field" value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ap-email" className="field-label">Email *</label>
              <input id="ap-email" type="email" required autoComplete="email" className="field" value={form.applicant_email} onChange={(e) => setForm({ ...form, applicant_email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ap-phone" className="field-label">Phone <span className="font-normal text-ink-400">(optional)</span></label>
              <input id="ap-phone" type="tel" autoComplete="tel" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ap-link" className="field-label">LinkedIn <span className="font-normal text-ink-400">(optional)</span></label>
              <input id="ap-link" type="url" placeholder="https://" className="field" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label htmlFor="ap-note" className="field-label">Why this, and why now? *</label>
            <textarea id="ap-note" required rows={5} maxLength={4000} className="field" value={form.cover_note} onChange={(e) => setForm({ ...form, cover_note: e.target.value })} />
            <p className="mt-1.5 text-[13px] text-ink-400">A short note is enough: what you have done that is relevant, and what you want to learn.</p>
          </div>

          <DocumentUploadDropzone value={form.resume_url} onChange={(url) => setForm((f) => ({ ...f, resume_url: url }))} />

          <p className="text-[13px] leading-relaxed text-ink-400">
            We use your application only to assess it and keep it for up to twelve months, as described in our{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-4">privacy notice</Link>.
          </p>

          {error && (
            <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? "Sending..." : paid && offer ? `Continue to payment, ${money(offer.amount, offer.currency)}` : "Submit application"}
              <Arrow />
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

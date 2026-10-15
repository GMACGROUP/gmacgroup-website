"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import type { OfferType, Programme } from "@/types";
import { Dialog, money } from "@/components/modals/Dialog";
import { Arrow } from "@/components/ui/Arrow";

interface EnrolmentModalProps {
  programme: Programme | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORY: Record<string, string> = {
  student: "Student programme",
  professional_development: "Professional development",
  training: "Training",
  institutional: "Institutional programme",
};

function fmt(d?: string | null) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
}

export function EnrolmentModal({ programme, isOpen, onClose, onSuccess }: EnrolmentModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerType, setOfferType] = useState<OfferType>("free");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", organization: "", notes: "" });

  useEffect(() => {
    if (user && typeof user === "object") {
      setForm((f) => ({
        ...f,
        full_name: user.full_name || f.full_name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
        organization: user.organization || f.organization,
      }));
    }
    setSubmitted(false);
    setError(null);
    setOfferType(programme?.offers?.[0]?.type || "free");
  }, [user, isOpen, programme]);

  if (!isOpen || !programme) return null;

  const closed = Boolean(programme.end_date && new Date(programme.end_date).getTime() < Date.now());
  const offer = programme.offers?.find((o) => o.type === offerType);
  const paid = Boolean(offer && offer.amount > 0);
  const dates = [fmt(programme.start_date), fmt(programme.end_date)].filter(Boolean).join(" to ");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!programme) return;
    setSubmitting(true);
    setError(null);
    try {
      if (offer && offer.amount > 0) {
        const payment = await apiClient.post<{ checkout_url?: string }>("/payments/initialize", {
          target_type: "programme",
          target_id: programme.id,
          offer_type: offer.type,
          email: form.email,
          full_name: form.full_name,
          details: form,
        });
        if (payment.checkout_url) window.location.assign(payment.checkout_url);
        return;
      }
      await apiClient.post(`/programmes/${programme.id}/enrol`, { ...form, offer_type: offerType });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not complete your enrolment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      eyebrow={submitted ? "Enrolment confirmed" : CATEGORY[programme.category] || "Programme"}
      title={submitted ? `You are enrolled, ${form.full_name.split(" ")[0] || "thank you"}.` : programme.title}
      meta={!submitted && dates ? dates : undefined}
    >
      {closed ? (
        <div>
          <p className="text-[15px] leading-relaxed text-ink-600">
            Enrolment for this programme has closed. Tell us you are interested and we will contact you when the next cohort opens.
          </p>
          <Link href={`/contact?topic=programmes&subject=${encodeURIComponent(programme.title)}`} className="btn-primary mt-6">
            Register interest
            <Arrow />
          </Link>
        </div>
      ) : submitted ? (
        <div role="status">
          <p className="text-[15px] leading-relaxed text-ink-600">
            Your place on <strong className="font-medium text-ink">{programme.title}</strong> is recorded. A confirmation is on its way to{" "}
            {form.email}, and joining details will follow before the start date.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {programme.offers && programme.offers.length > 1 && (
            <fieldset>
              <legend className="field-label">Choose an option</legend>
              <div className="mt-1 divide-y divide-rule border border-ink/20 bg-white">
                {programme.offers.map((o) => (
                  <label key={o.type} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="offer"
                        value={o.type}
                        checked={offerType === o.type}
                        onChange={() => setOfferType(o.type)}
                        className="accent-[#0B5CAD]"
                      />
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
              <label htmlFor="en-name" className="field-label">Full name *</label>
              <input id="en-name" required autoComplete="name" className="field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="en-email" className="field-label">Email *</label>
              <input id="en-email" type="email" required autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="en-phone" className="field-label">Phone <span className="font-normal text-ink-400">(optional)</span></label>
              <input id="en-phone" type="tel" autoComplete="tel" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label htmlFor="en-org" className="field-label">University or employer <span className="font-normal text-ink-400">(optional)</span></label>
              <input id="en-org" autoComplete="organization" className="field" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </div>
          </div>
          <div>
            <label htmlFor="en-notes" className="field-label">What do you want to get from it? <span className="font-normal text-ink-400">(optional)</span></label>
            <textarea id="en-notes" rows={3} className="field" maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <p className="text-[13px] leading-relaxed text-ink-400">
            We use these details to manage your enrolment, as described in our{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-4">privacy notice</Link>.
            {paid && " Payments are processed securely by Flutterwave; we never see your card details."}
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
              {submitting ? "Please wait..." : paid && offer ? `Continue to payment, ${money(offer.amount, offer.currency)}` : "Confirm enrolment"}
              <Arrow />
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { Arrow } from "@/components/ui/Arrow";

export const CONTACT_TOPICS: { value: string; label: string }[] = [
  { value: "institution", label: "Commissioning research or advisory" },
  { value: "workforce", label: "Workforce and graduate intake" },
  { value: "investment", label: "Investment facilitation" },
  { value: "sponsorship", label: "Sponsorship and event partnership" },
  { value: "programmes", label: "Programmes and training" },
  { value: "events", label: "Events" },
  { value: "careers", label: "Careers and fellowships" },
  { value: "media", label: "Media and speaking" },
  { value: "other", label: "Something else" },
];

// Older links used practice area slugs as topics; map them to the nearest topic.
const TOPIC_ALIASES: Record<string, string> = {
  "applied-research-and-policy-consulting": "institution",
  "institutional-capacity-building": "institution",
  "human-capital-and-workforce-consulting": "workforce",
  "employability-programmes": "programmes",
  "signature-events-and-workshops": "sponsorship",
  "investment-facilitation": "investment",
};

type Errors = Partial<Record<"name" | "email" | "subject" | "message" | "consent" | "form", string>>;

export function ContactForm() {
  const params = useSearchParams();
  const [topic, setTopic] = useState("institution");
  const [form, setForm] = useState({ name: "", email: "", organization: "", subject: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const t = params?.get("topic");
    if (t) setTopic(TOPIC_ALIASES[t] ?? (CONTACT_TOPICS.some((x) => x.value === t) ? t : "other"));
    const subject = params?.get("subject") || params?.get("event");
    if (subject) setForm((f) => ({ ...f, subject: subject.replace(/^Inquiry:\s*/i, "") }));
  }, [params]);

  function validate(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (form.subject.trim().length < 3) e.subject = "Please add a short subject.";
    if (form.message.trim().length < 10) e.message = "Please tell us a little more (at least 10 characters).";
    if (!consent) e.consent = "Please agree so we can use your details to reply.";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`cf-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      await apiClient.post("/contact/", { ...form, topic, consent });
      setState("sent");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again or email us." });
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="border-t border-ink pt-8">
        <p className="text-[12px] font-medium uppercase tracking-label text-success">Message received</p>
        <h2 className="mt-4 font-display text-3xl">Thank you, {form.name.split(" ")[0]}.</h2>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-600">
          Your message has reached our team and a confirmation is on its way to {form.email}. The right person will
          reply to you directly.
        </p>
        <Link href="/expertise" className="link-arrow mt-8">
          Explore our expertise while you wait
          <Arrow />
        </Link>
      </div>
    );
  }

  const label = "field-label";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`cf-${k}-error`} className="mt-1.5 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `cf-${k}-error` : undefined });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <fieldset>
        <legend className={label}>What is it about?</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((t) => (
            <label key={t.value} className={`cursor-pointer border px-3 py-2 text-sm transition-colors ${topic === t.value ? "border-ink band-blue text-white" : "border-ink/20 text-ink-600 hover:border-ink/50"}`}>
              <input type="radio" name="topic" value={t.value} checked={topic === t.value} onChange={() => setTopic(t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Full name *</label>
          <input id="cf-name" autoComplete="name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Email *</label>
          <input id="cf-email" type="email" autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="cf-organization" className={label}>Organisation <span className="font-normal text-ink-400">(optional)</span></label>
        <input id="cf-organization" autoComplete="organization" className="field" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} maxLength={160} />
      </div>

      <div>
        <label htmlFor="cf-subject" className={label}>Subject *</label>
        <input id="cf-subject" className="field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} {...aria("subject")} />
        {err("subject")}
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>The decision you are trying to make, or the capability you want to build *</label>
        <textarea id="cf-message" rows={6} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={5000} {...aria("message")} />
        {err("message")}
      </div>

      {/* Honeypot for bots: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input id="cf-consent" type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} {...aria("consent")} />
          <span>
            I agree that Gmac Group may use these details to reply to my enquiry, as described in the{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-4">privacy notice</Link>.
          </span>
        </label>
        {err("consent")}
      </div>

      {errors.form && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
          {errors.form}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="btn-primary disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Send message"}
        <Arrow />
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      await apiClient.post("/contact/", payload);
      (e.target as HTMLFormElement).reset();
      setFeedback({
        type: "success",
        message: "Thank you! Your message has been received. Our advisory team will reach out promptly.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "We could not send your message at this time.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Full Name <span className="text-brand-red">*</span>
          </label>
          <input
            name="name"
            placeholder="Kwame Asante"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Email Address <span className="text-brand-red">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="kwame@organization.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Subject <span className="text-brand-red">*</span>
        </label>
        <input
          name="subject"
          placeholder="e.g. Strategic Talent Advisory Inquiry"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Message & Project Context <span className="text-brand-red">*</span>
        </label>
        <textarea
          name="message"
          placeholder="Please describe your institutional need, cohort requirements, or partnership proposal..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-y bg-slate-50/50 focus:bg-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-brand-red hover:bg-brand-redDark shadow-card hover:shadow-elevate-red active:scale-98 transition-all disabled:opacity-50"
      >
        {submitting ? "Sending Message..." : "Send Message to Advisory Team →"}
      </button>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`p-4 rounded-xl text-sm font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
              : "bg-red-50 text-brand-red border border-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </form>
  );
}

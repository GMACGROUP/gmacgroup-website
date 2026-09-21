"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Logo } from "@/components/common/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevate overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-navy via-brand-cyan to-brand-red" />

        {/* Logo Header */}
        <div className="text-center mb-8 pt-2">
          <Logo size="md" showTagline={false} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6 font-serif">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Enter your registered email and we&apos;ll send you a secure link to reset your password.
          </p>
        </div>

        {sent ? (
          /* ─── Success State ─── */
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">Check your inbox</h2>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                If an account is registered with{" "}
                <span className="font-bold text-slate-800">{email}</span>, a password reset
                link has been sent. It expires in <span className="font-semibold text-brand-red">15 minutes</span>.
              </p>
            </div>
            <p className="text-xs text-slate-400 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
              Didn&apos;t receive an email? Check your spam folder or{" "}
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="font-bold text-brand-navy hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Link
              href="/login"
              prefetch={true}
              className="block text-xs font-bold text-brand-red hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          /* ─── Request Form ─── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark shadow-card hover:shadow-elevate active:scale-98 transition-all disabled:opacity-50"
            >
              {submitting ? "Sending reset link…" : "Send Reset Link →"}
            </button>

            {error && (
              <p role="alert" className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center animate-shake">
                {error}
              </p>
            )}

            <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
              Remember your password?{" "}
              <Link href="/login" prefetch={true} className="font-bold text-brand-red hover:underline ml-1">
                Sign in →
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

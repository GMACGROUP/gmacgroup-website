"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    full_name: string;
    email: string;
    role: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const full_name = String(form.get("full_name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "student");

    try {
      await register({ full_name, email, password, role });
      setSuccessInfo({ full_name, email, role });
      // Auto-redirect to dashboard with welcome banner
      setTimeout(() => {
        router.push("/dashboard?welcome=1");
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevate overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-red via-brand-cyan to-brand-navy" />

        {/* Logo Header */}
        <div className="text-center mb-8 pt-2">
          <Logo size="md" showTagline={true} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6 font-serif">
            {successInfo ? "Account Ready!" : "Join GMAC Network"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {successInfo
              ? "Your GMAC membership has been activated."
              : "Create an account to enrol in cohorts and apply to fellowships"}
          </p>
        </div>

        {successInfo ? (
          /* ─── Celebratory Registration Success State ─── */
          <div className="text-center space-y-5 py-2 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Welcome, {successInfo.full_name}! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your account is live and a confirmation email has been dispatched to{" "}
                <span className="font-bold text-slate-900">{successInfo.email}</span>.
              </p>
            </div>

            <div className="p-3 bg-brand-ice border border-blue-200/60 rounded-2xl text-xs text-brand-navy font-semibold flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Redirecting to your member dashboard…</span>
            </div>

            <Link
              href="/dashboard?welcome=1"
              prefetch={true}
              className="inline-block w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark shadow-card hover:shadow-elevate active:scale-98 transition-all"
            >
              Go to Dashboard Now →
            </Link>
          </div>
        ) : (
          /* ─── Registration Form ─── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <input
                name="full_name"
                placeholder="e.g. Kwabena Mensah"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Password <span className="text-brand-red">*</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                minLength={6}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Your Primary Role
              </label>
              <select
                name="role"
                defaultValue="student"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
              >
                <option value="student">Student / Emerging Leader</option>
                <option value="professional">Working Professional</option>
                <option value="researcher">Academic / Researcher</option>
                <option value="employer">Employer / Talent Partner</option>
                <option value="institution">Institutional Partner</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-red hover:bg-brand-redDark shadow-card hover:shadow-elevate-red active:scale-98 transition-all disabled:opacity-50"
            >
              {submitting ? "Creating Account…" : "Create Account →"}
            </button>

            {error && (
              <p
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center animate-shake"
              >
                {error}
              </p>
            )}
          </form>
        )}

        {!successInfo && (
          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={true}
              className="font-bold text-brand-navy hover:underline ml-1"
            >
              Sign in here →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 px-4 py-8 sm:py-16">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-blue-50/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[250px] w-[400px] rounded-full bg-red-50/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_40px_rgba(14,77,130,0.10)] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#D7B56D_0%,#E56F42_22%,#F4C95D_52%,#2C6EAD_78%,#D7B56D_100%)]" />

        <div className="mb-8 pt-2 text-center">
          <Logo size="md" showTagline={false} variant="light" className="justify-center" />
          <h1 className="mt-5 font-serif text-2xl font-bold leading-tight text-slate-900 sm:text-[1.75rem]">
            {successInfo ? "Account Ready!" : "Join GMAC Network"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {successInfo
              ? "Your GMAC membership has been activated."
              : "Create an account to enrol in cohorts and apply to fellowships"}
          </p>
        </div>

        {successInfo ? (
          /* ─── Celebratory Registration Success State ─── */
          <div className="text-center space-y-5 py-2 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-emerald-400"
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
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Welcome, {successInfo.full_name}!
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                Your account is live and a confirmation email has been dispatched to{" "}
                <span className="font-bold text-brand-navy">{successInfo.email}</span>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-500">
              <span className="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              <span>Redirecting to your member dashboard…</span>
            </div>

            <Link
              href="/dashboard?welcome=1"
              prefetch={true}
              className="inline-block w-full rounded-xl bg-brand-navy py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-navyDark hover:shadow-lg active:scale-98"
            >
              Go to Dashboard Now →
            </Link>
          </div>
        ) : (
          /* ─── Registration Form ─── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <input
                name="full_name"
                placeholder="e.g. Kwabena Mensah"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password <span className="text-brand-red">*</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                minLength={6}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Primary Role
              </label>
              <select
                name="role"
                defaultValue="student"
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
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
              className="mt-2 w-full rounded-xl bg-brand-navy py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-navyDark hover:shadow-lg active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating Account…" : "Create Account →"}
            </button>

            {error && (
              <p
                role="alert"
                className="animate-shake rounded-xl border border-red-200 bg-red-50 p-3.5 text-center text-xs font-semibold text-brand-red"
              >
                {error}
              </p>
            )}
          </form>
        )}

        {!successInfo && (
          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-xs font-medium text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={true}
              className="ml-1 font-bold text-brand-red transition-colors hover:underline"
            >
              Sign in here →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

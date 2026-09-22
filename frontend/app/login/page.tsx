"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common/Logo";

// Inline icons for form fields
function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l10 7 10-7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-50/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] rounded-full bg-red-50/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_8px_40px_rgba(14,77,130,0.10)] sm:p-10">
        {/* Top gradient accent bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#D7B56D_0%,#E56F42_22%,#F4C95D_52%,#2C6EAD_78%,#D7B56D_100%)]" />

        {/* Logo + heading */}
        <div className="mb-8 pt-2 text-center">
          <Logo size="md" showTagline={false} variant="light" className="justify-center" />
          <h1 className="mt-5 font-serif text-2xl font-bold text-slate-900 sm:text-[1.75rem] leading-tight">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to access your portal, cohorts &amp; applications
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email field */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <MailIcon />
              </span>
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-brand-navy hover:text-brand-red hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <LockIcon />
              </span>
              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign In to Portal →"}
          </button>

          {error && (
            <p role="alert" className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center">
              {error}
            </p>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-brand-red hover:underline ml-1 transition-colors">
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

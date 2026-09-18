"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common/Logo";

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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevate overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-navy via-brand-cyan to-brand-red" />

        {/* Logo Header */}
        <div className="text-center mb-8 pt-2">
          <Logo size="md" showTagline={true} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6 font-serif">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Sign in to access your portal, cohorts & applications
          </p>
        </div>

        {/* Quick Demo Fillers */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <p className="font-bold text-slate-700 mb-2 text-center uppercase tracking-wider text-[10px]">
            ⚡ Quick Demo Accounts (One-Click Test)
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => fillDemo("demo@gmacgroup.org")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-brand-navy hover:text-brand-navy text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo("professional@gmacgroup.org")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-brand-navy hover:text-brand-navy text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
            >
              💼 Professional
            </button>
            <button
              type="button"
              onClick={() => fillDemo("researcher@gmacgroup.org")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-brand-navy hover:text-brand-navy text-[11px] font-semibold text-slate-700 transition-colors shadow-xs"
            >
              🔬 Researcher
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                (Default: password123)
              </span>
            </div>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark shadow-card hover:shadow-elevate active:scale-98 transition-all disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In to Portal →"}
          </button>

          {error && (
            <p role="alert" className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center animate-shake">
              {error}
            </p>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-brand-red hover:underline ml-1">
            Register here →
          </Link>
        </div>
      </div>
    </div>
  );
}

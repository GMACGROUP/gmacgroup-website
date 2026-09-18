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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6 font-serif">Join GMAC Network</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Create an account to enrol in cohorts and apply to fellowships
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-brand-red">*</span>
            </label>
            <input
              name="full_name"
              placeholder="e.g. Kwabena Mensah"
              required
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
              <option value="student">Student / Recent Graduate</option>
              <option value="professional">Working Professional</option>
              <option value="researcher">Academic / Researcher</option>
              <option value="employer">Employer / Recruiter</option>
              <option value="institution">University / Institutional Partner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-red hover:bg-brand-redDark shadow-card hover:shadow-elevate-red active:scale-98 transition-all disabled:opacity-50"
          >
            {submitting ? "Creating Account..." : "Create Account →"}
          </button>

          {error && (
            <p role="alert" className="p-3.5 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center animate-shake">
              {error}
            </p>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-navy hover:underline ml-1">
            Sign in here →
          </Link>
        </div>
      </div>
    </div>
  );
}

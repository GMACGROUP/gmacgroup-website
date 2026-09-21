"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { Logo } from "@/components/common/Logo";

function ResetPasswordFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-slate-200 rounded" />
        <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-28 bg-slate-200 rounded" />
        <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200" />
      </div>
      <div className="h-12 w-full bg-brand-navy/20 rounded-xl mt-2" />
    </div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = newPassword === confirm;
  const isStrong = newPassword.length >= 8;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!isStrong) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setSuccess(true);
      // Auto-redirect to login after 2s
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed. The link may be expired.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-5 py-4 animate-fadeIn">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 font-serif">Invalid Reset Link</h2>
        <p className="text-sm text-slate-500">
          This password reset link is invalid or missing. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          prefetch={true}
          className="inline-block mt-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark transition-colors shadow-sm"
        >
          Request New Link →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-5 py-4 animate-fadeIn">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">Password Updated!</h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Your password has been successfully reset. Redirecting you to sign in…
          </p>
        </div>
        <Link
          href="/login"
          prefetch={true}
          className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark transition-colors shadow-sm"
        >
          Sign In Now →
        </Link>
      </div>
    );
  }

  const strengthScore = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strengthScore];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"][strengthScore];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
      {/* New Password */}
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Strength Bar */}
        {newPassword.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                style={{ width: `${(strengthScore / 3) * 100}%` }}
              />
            </div>
            <p className={`text-[10px] font-bold ${["", "text-red-500", "text-amber-500", "text-emerald-600"][strengthScore]}`}>
              {strengthLabel} password
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white ${
            confirm && !passwordsMatch
              ? "border-red-400 focus:ring-red-200"
              : confirm && passwordsMatch
              ? "border-emerald-400 focus:ring-emerald-200"
              : "border-slate-300 focus:ring-brand-navy/30 focus:border-brand-navy"
          }`}
        />
        {confirm && !passwordsMatch && (
          <p className="mt-1 text-[10px] text-red-500 font-semibold">Passwords don&apos;t match</p>
        )}
        {confirm && passwordsMatch && (
          <p className="mt-1 text-[10px] text-emerald-600 font-semibold">✓ Passwords match</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || !passwordsMatch || !isStrong}
        className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-navy hover:bg-brand-navyDark shadow-card hover:shadow-elevate active:scale-98 transition-all disabled:opacity-50"
      >
        {submitting ? "Updating password…" : "Set New Password →"}
      </button>

      {error && (
        <p role="alert" className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-brand-red border border-red-200 text-center animate-shake">
          {error}
        </p>
      )}

      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
        <Link href="/login" prefetch={true} className="font-bold text-brand-red hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-elevate overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-navy via-brand-cyan to-brand-red" />

        {/* Logo Header */}
        <div className="text-center mb-8 pt-2">
          <Logo size="md" showTagline={false} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6 font-serif">
            Create New Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Choose a strong password to secure your GMAC account.
          </p>
        </div>

        {/* Suspense boundary with instant form skeleton */}
        <Suspense fallback={<ResetPasswordFormSkeleton />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

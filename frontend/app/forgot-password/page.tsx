"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { AuthShell, FormError } from "@/components/account/AuthShell";
import { Arrow } from "@/components/ui/Arrow";

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
    <AuthShell
      eyebrow="Password"
      title={sent ? "Check your email." : "Reset your password."}
      intro={sent ? undefined : "Enter the email you signed up with and we will send you a link to choose a new password."}
    >
      {sent ? (
        <div role="status" className="max-w-md">
          <p className="text-[15px] leading-relaxed text-ink-600">
            If an account exists for <strong className="font-medium text-ink">{email}</strong>, a reset link is on its way. It
            works once and expires after 15 minutes. Check your spam folder if it has not arrived in a few minutes.
          </p>
          <Link href="/login" className="link-arrow mt-8">
            Back to sign in
            <Arrow />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div>
            <label htmlFor="fp-email" className="field-label">Email</label>
            <input id="fp-email" type="email" required autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <FormError>{error}</FormError>}
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto">
            {submitting ? "Sending..." : "Send reset link"}
            <Arrow />
          </button>
          <p className="border-t border-rule pt-6 text-sm text-ink-500">
            Remembered it? <Link href="/login" className="text-accent underline underline-offset-4">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}

"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { AuthShell, FormError } from "@/components/account/AuthShell";
import { Arrow } from "@/components/ui/Arrow";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params?.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="max-w-md">
        <p className="text-[15px] leading-relaxed text-ink-600">This reset link is incomplete. Please request a new one.</p>
        <Link href="/forgot-password" className="btn-primary mt-6">
          Request a new link
          <Arrow />
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div role="status" className="max-w-md">
        <p className="text-[15px] leading-relaxed text-ink-600">
          Your password has been changed and you have been signed out of other devices. Taking you to sign in...
        </p>
        <Link href="/login" className="link-arrow mt-6">
          Sign in now
          <Arrow />
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) return setError("Please choose a password of at least 8 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.post("/auth/reset-password", { token, new_password: password });
      setDone(true);
      window.setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This link may have expired. Please request a new one.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <div>
        <label htmlFor="rp-new" className="field-label">New password</label>
        <input id="rp-new" type="password" required minLength={8} autoComplete="new-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="rp-help" />
        <p id="rp-help" className="mt-1.5 text-[13px] text-ink-400">At least 8 characters.</p>
      </div>
      <div>
        <label htmlFor="rp-confirm" className="field-label">Confirm new password</label>
        <input id="rp-confirm" type="password" required autoComplete="new-password" className="field" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {error && <FormError>{error}</FormError>}
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto">
        {submitting ? "Saving..." : "Save new password"}
        <Arrow />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Password" title="Choose a new password.">
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}

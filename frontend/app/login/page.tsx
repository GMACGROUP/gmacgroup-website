"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthShell, FormError } from "@/components/account/AuthShell";
import { Arrow } from "@/components/ui/Arrow";

function safeNext(value: string | null, fallback: string) {
  // Only allow redirects within this site.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
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
      const user = await login(email, password);
      router.replace(safeNext(params?.get("next") ?? null, user.role === "admin" ? "/admin" : "/dashboard"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <div>
        <label htmlFor="li-email" className="field-label">Email</label>
        <input id="li-email" type="email" required autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="li-password" className="field-label">Password</label>
          <Link href="/forgot-password" className="text-sm text-accent underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        <input id="li-password" type="password" required autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <FormError>{error}</FormError>}
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto">
        {submitting ? "Signing in..." : "Sign in"}
        <Arrow />
      </button>
      <p className="border-t border-rule pt-6 text-sm text-ink-500">
        New here?{" "}
        <Link href="/register" className="text-accent underline underline-offset-4">Create an account</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Sign in" title="Welcome back." intro="Sign in to see your programmes, events and applications.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

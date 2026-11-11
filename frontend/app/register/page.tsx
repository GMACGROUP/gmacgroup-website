"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthShell, FormError } from "@/components/account/AuthShell";
import { Arrow } from "@/components/ui/Arrow";

const ROLES = [
  { value: "student", label: "Student or recent graduate" },
  { value: "professional", label: "Working professional" },
  { value: "researcher", label: "Academic or researcher" },
  { value: "employer", label: "Employer or talent partner" },
  { value: "institution", label: "Institution" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const full_name = String(form.get("full_name") || "").trim();
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "student");
    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await register({ full_name, email, password, role });
      router.push("/dashboard?welcome=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not create your account. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create an account"
      title="Join Gmac Group."
      intro="An account lets you enrol in programmes, register for events and follow your applications in one place."
    >
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div>
          <label htmlFor="rg-name" className="field-label">Full name</label>
          <input id="rg-name" name="full_name" required autoComplete="name" maxLength={120} className="field" />
        </div>
        <div>
          <label htmlFor="rg-email" className="field-label">Email</label>
          <input id="rg-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="rg-password" className="field-label">Password</label>
          <input id="rg-password" name="password" type="password" required minLength={8} autoComplete="new-password" className="field" aria-describedby="rg-password-help" />
          <p id="rg-password-help" className="mt-1.5 text-[13px] text-ink-400">At least 8 characters.</p>
        </div>
        <div>
          <label htmlFor="rg-role" className="field-label">Which best describes you?</label>
          <select id="rg-role" name="role" defaultValue="student" className="field">
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-400">
          By creating an account you agree to our <Link href="/terms" className="text-accent underline underline-offset-4">terms</Link> and
          confirm you have read the <Link href="/privacy" className="text-accent underline underline-offset-4">privacy notice</Link>.
        </p>
        {error && <FormError>{error}</FormError>}
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto">
          {submitting ? "Creating your account..." : "Create account"}
          <Arrow />
        </button>
        <p className="border-t border-rule pt-6 text-sm text-ink-500">
          Already have an account? <Link href="/login" className="text-accent underline underline-offset-4">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

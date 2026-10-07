"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
import type { Opportunity, Programme } from "@/types";
import { Dialog } from "@/components/modals/Dialog";
import { Arrow } from "@/components/ui/Arrow";

interface EnrolmentItem {
  id: string;
  programme_id: string;
  programme_title?: string;
  status: string;
  created_at: string;
}

interface ApplicationItem {
  id: string;
  opportunity_id: string;
  opportunity_title?: string;
  status: string;
  created_at: string;
}

type Detail = {
  kind: "programme" | "opportunity";
  title: string;
  status: string;
  createdAt: string;
  data: Programme | Opportunity | null;
  error: string | null;
};

const STATUS: Record<string, { label: string; tone: string }> = {
  submitted: { label: "Received", tone: "text-ink-600 border-ink/20" },
  under_review: { label: "Under review", tone: "text-accent border-accent/40" },
  interview: { label: "Interview", tone: "text-accent border-accent/40" },
  shortlisted: { label: "Shortlisted", tone: "text-accent border-accent/40" },
  approved: { label: "Approved", tone: "text-success border-success/40" },
  accepted: { label: "Accepted", tone: "text-success border-success/40" },
  confirmed: { label: "Confirmed", tone: "text-success border-success/40" },
  completed: { label: "Completed", tone: "text-success border-success/40" },
  pending: { label: "Pending", tone: "text-ink-600 border-ink/20" },
  rejected: { label: "Not selected", tone: "text-ink-500 border-ink/20" },
  cancelled: { label: "Cancelled", tone: "text-ink-500 border-ink/20" },
  withdrawn: { label: "Withdrawn", tone: "text-ink-500 border-ink/20" },
};

function Status({ value }: { value: string }) {
  const s = STATUS[value] ?? { label: value.replace(/_/g, " "), tone: "text-ink-600 border-ink/20" };
  return <span className={`inline-block border px-2 py-0.5 text-[12px] font-medium ${s.tone}`}>{s.label}</span>;
}

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const welcome = params?.get("welcome") === "1";
  const { user, loading, logout, updateProfile } = useAuth();

  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", organization: "", phone: "", bio: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/dashboard");
      return;
    }
    if (!user) return;
    setForm({ full_name: user.full_name || "", organization: user.organization || "", phone: user.phone || "", bio: user.bio || "" });
    setLoadingData(true);
    Promise.all([
      apiClient.get<EnrolmentItem[]>("/programmes/my-enrolments").catch(() => []),
      apiClient.get<ApplicationItem[]>("/opportunities/my-applications").catch(() => []),
    ])
      .then(([e, a]) => {
        setEnrolments(e);
        setApplications(a);
      })
      .finally(() => setLoadingData(false));
  }, [loading, router, user]);

  if (loading || !user) {
    return <div className="wrap min-h-[60vh] py-24 text-sm text-ink-400">Loading your account...</div>;
  }

  const name = user.full_name || user.email.split("@")[0];

  async function open(kind: "programme" | "opportunity", id: string, title: string, status: string, createdAt: string) {
    setDetail({ kind, title, status, createdAt, data: null, error: null });
    try {
      const data = await apiClient.get<Programme | Opportunity>(`/${kind === "programme" ? "programmes" : "opportunities"}/${id}`);
      setDetail((d) => (d ? { ...d, data } : d));
    } catch {
      setDetail((d) => (d ? { ...d, error: "Full details are no longer listed on the site. Your record is still kept." } : d));
    }
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save your details.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await logout();
    router.push("/");
  }

  const rows = (
    items: { id: string; ref: string; title?: string; status: string; created_at: string }[],
    kind: "programme" | "opportunity",
  ) => (
    <ul className="border-t border-ink">
      {items.map((it) => (
        <li key={it.id} className="border-b border-rule">
          <button
            type="button"
            onClick={() => open(kind, it.ref, it.title || it.ref, it.status, it.created_at)}
            className="grid w-full grid-cols-1 gap-2 py-5 text-left hover:bg-stone/60 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-2"
          >
            <span>
              <span className="block font-display text-xl leading-snug">{it.title || it.ref}</span>
              <span className="mt-1 block text-[13px] text-ink-400">Since {when(it.created_at)}</span>
            </span>
            <Status value={it.status} />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap flex flex-col gap-8 pb-12 pt-14 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-label text-clay">Your account</p>
            <h1 className="display-lg mt-4">{welcome ? `Welcome, ${name.split(" ")[0]}.` : `Hello, ${name.split(" ")[0]}.`}</h1>
            <p className="mt-3 text-[15px] text-ink-500">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.role === "admin" && (
              <Link href="/admin" className="btn-dark">
                Admin console
                <Arrow />
              </Link>
            )}
            <button type="button" onClick={() => setEditing((v) => !v)} className="btn-secondary">
              {editing ? "Close details" : "Edit your details"}
            </button>
            <button type="button" onClick={signOut} className="btn-secondary">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {welcome && (
        <div className="border-b border-rule bg-sky">
          <p className="wrap py-5 text-[15px] text-ink-600">
            Your account is ready. Enrol in a programme or apply for a role and it will appear here.
          </p>
        </div>
      )}

      {editing && (
        <section className="border-b border-rule">
          <form onSubmit={save} className="wrap grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:max-w-4xl">
            <div>
              <label htmlFor="pf-name" className="field-label">Full name</label>
              <input id="pf-name" className="field" maxLength={120} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pf-org" className="field-label">University or employer</label>
              <input id="pf-org" className="field" maxLength={160} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pf-phone" className="field-label">Phone</label>
              <input id="pf-phone" type="tel" className="field" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pf-bio" className="field-label">About you</label>
              <textarea id="pf-bio" rows={3} className="field" maxLength={2000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            {saveError && <p role="alert" className="text-sm text-danger sm:col-span-2">{saveError}</p>}
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving..." : "Save details"}
                <Arrow />
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="site-section">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md">Programmes <span className="font-light text-ink-400 tabular-nums">{enrolments.length}</span></h2>
              <Link href="/programmes" className="link-arrow shrink-0">
                Browse
                <Arrow />
              </Link>
            </div>
            <div className="mt-8">
              {loadingData ? (
                <p className="border-t border-ink pt-6 text-sm text-ink-400">Loading...</p>
              ) : enrolments.length ? (
                rows(enrolments.map((e) => ({ ...e, ref: e.programme_id, title: e.programme_title })), "programme")
              ) : (
                <p className="border-t border-ink pt-6 text-[15px] text-ink-500">You are not enrolled in a programme yet.</p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md">Applications <span className="font-light text-ink-400 tabular-nums">{applications.length}</span></h2>
              <Link href="/careers" className="link-arrow shrink-0">
                Open roles
                <Arrow />
              </Link>
            </div>
            <div className="mt-8">
              {loadingData ? (
                <p className="border-t border-ink pt-6 text-sm text-ink-400">Loading...</p>
              ) : applications.length ? (
                rows(applications.map((a) => ({ ...a, ref: a.opportunity_id, title: a.opportunity_title })), "opportunity")
              ) : (
                <p className="border-t border-ink pt-6 text-[15px] text-ink-500">You have not applied for anything yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow={detail?.kind === "programme" ? "Programme" : "Application"}
        title={detail?.title || ""}
        meta={detail ? <span className="flex flex-wrap items-center gap-3"><Status value={detail.status} /> Since {when(detail.createdAt)}</span> : undefined}
      >
        {detail?.error ? (
          <p className="text-[15px] text-ink-500">{detail.error}</p>
        ) : !detail?.data ? (
          <p className="text-sm text-ink-400">Loading...</p>
        ) : (
          <div className="space-y-4 text-[15px] leading-relaxed text-ink-600">
            {detail.data.description && <p>{detail.data.description}</p>}
            {"start_date" in detail.data && detail.data.start_date && (
              <p className="text-sm text-ink-500">
                Runs {when(detail.data.start_date)}
                {detail.data.end_date ? ` to ${when(detail.data.end_date)}` : ""}
              </p>
            )}
            {"deadline" in detail.data && detail.data.deadline && (
              <p className="text-sm text-ink-500">Application deadline: {when(detail.data.deadline)}</p>
            )}
          </div>
        )}
        <p className="mt-6 border-t border-rule pt-4 text-sm text-ink-500">
          Questions? Write to us through the{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">contact page</Link>.
        </p>
      </Dialog>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="wrap min-h-[60vh] py-24 text-sm text-ink-400">Loading your account...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

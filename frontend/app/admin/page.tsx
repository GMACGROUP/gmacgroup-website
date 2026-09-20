"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";

interface Overview {
  members: number;
  applications: number;
  enrolments: number;
  contacts: number;
  pending_payments: number;
}

interface Application {
  id: string;
  opportunity_title?: string;
  applicant_name?: string;
  applicant_email?: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Enrolment {
  id: string;
  programme_title?: string;
  full_name?: string;
  email?: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Member {
  id: string;
  full_name?: string;
  email: string;
  role: string;
  organization?: string;
  created_at: string;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Payment {
  id: string;
  target_title: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  provider_reference: string;
  full_name?: string;
  created_at: string;
}

type Queue = "applications" | "enrolments" | "members" | "contacts" | "payments";

const applicationStatuses = ["submitted", "under_review", "interview", "shortlisted", "accepted", "rejected", "withdrawn"];
const enrolmentStatuses = ["pending", "confirmed", "completed", "cancelled", "withdrawn"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" });
}

function StatusPill({ value }: { value: string }) {
  return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">{value.replaceAll("_", " ")}</span>;
}

export default function AdminPage() {
  const { user, loading, refreshUser } = useAuth();
  const [queue, setQueue] = useState<Queue>("applications");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoadingData(true);
    setError(null);
    try {
      const [summary, applicationRows, enrolmentRows, memberRows, contactRows, paymentRows] = await Promise.all([
        apiClient.get<Overview>("/admin/overview"),
        apiClient.get<Application[]>("/admin/applications"),
        apiClient.get<Enrolment[]>("/admin/enrolments"),
        apiClient.get<Member[]>("/admin/members"),
        apiClient.get<ContactRequest[]>("/admin/contacts"),
        apiClient.get<Payment[]>("/admin/payments"),
      ]);
      setOverview(summary);
      setApplications(applicationRows);
      setEnrolments(enrolmentRows);
      setMembers(memberRows);
      setContacts(contactRows);
      setPayments(paymentRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load operations data");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    refreshUser().then((freshUser) => {
      if (freshUser?.role === "admin") loadData();
      else setLoadingData(false);
    });
  }, [loading, refreshUser]);

  async function changeApplicationStatus(id: string, status: string) {
    try {
      const updated = await apiClient.patch<Application>(`/admin/applications/${id}`, { status });
      setApplications((rows) => rows.map((row) => row.id === id ? updated : row));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  async function changeEnrolmentStatus(id: string, status: string) {
    try {
      const updated = await apiClient.patch<Enrolment>(`/admin/enrolments/${id}`, { status });
      setEnrolments((rows) => rows.map((row) => row.id === id ? updated : row));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  if (loading || loadingData) return <div className="min-h-[70vh] flex items-center justify-center text-sm text-slate-500">Loading operations console...</div>;
  if (!user || user.role !== "admin") {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 px-4 text-center"><h1 className="text-2xl font-bold text-slate-900 font-serif">Operations access required</h1><p className="text-sm text-slate-500">This workspace is restricted to authorised GMAC operations staff.</p><Link href="/dashboard" className="text-sm font-bold text-brand-red">Return to member portal</Link></div>;
  }

  const cards = overview ? [
    ["Members", overview.members],
    ["Applications", overview.applications],
    ["Enrolments", overview.enrolments],
    ["Contacts", overview.contacts],
    ["Pending payments", overview.pending_payments],
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><span className="section-label text-brand-red">GMAC operations</span><h1 className="mt-1 text-3xl font-extrabold text-slate-900 font-serif">Member workspace</h1><p className="mt-1 text-sm text-slate-500">Review people, applications, cohort enrolments, enquiries, and payments.</p></div>
          <button onClick={loadData} className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100">Refresh queues</button>
        </header>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-2xl font-extrabold text-brand-navy">{value}</p></div>)}
        </div>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
          {(["applications", "enrolments", "members", "contacts", "payments"] as Queue[]).map((item) => <button key={item} onClick={() => setQueue(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold capitalize ${queue === item ? "bg-brand-navy text-white" : "text-slate-500 hover:bg-white"}`}>{item}</button>)}
        </nav>

        {queue === "applications" && <section className="space-y-3">{applications.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-bold text-slate-900">{item.opportunity_title || "Opportunity application"}</h2><p className="mt-1 text-sm text-slate-600">{item.applicant_name || "Applicant"} · {item.applicant_email}</p><p className="mt-1 text-xs text-slate-400">Submitted {formatDate(item.created_at)} · Payment: {item.payment_status.replaceAll("_", " ")}</p></div><div className="flex items-center gap-3"><StatusPill value={item.status} /><select value={item.status} onChange={(event) => changeApplicationStatus(item.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700">{applicationStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div></div></div>)}{applications.length === 0 && <Empty label="No applications have been submitted yet." />}</section>}

        {queue === "enrolments" && <section className="space-y-3">{enrolments.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-bold text-slate-900">{item.programme_title || "Programme enrolment"}</h2><p className="mt-1 text-sm text-slate-600">{item.full_name || "Member"} · {item.email}</p><p className="mt-1 text-xs text-slate-400">Submitted {formatDate(item.created_at)} · Payment: {item.payment_status.replaceAll("_", " ")}</p></div><div className="flex items-center gap-3"><StatusPill value={item.status} /><select value={item.status} onChange={(event) => changeEnrolmentStatus(item.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700">{enrolmentStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div></div></div>)}{enrolments.length === 0 && <Empty label="No programme enrolments have been submitted yet." />}</section>}

        {queue === "members" && <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">Member</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Organisation</th><th className="px-5 py-4">Joined</th></tr></thead><tbody className="divide-y divide-slate-100">{members.map((item) => <tr key={item.id}><td className="px-5 py-4"><p className="font-bold text-slate-900">{item.full_name || "Unnamed member"}</p><p className="text-xs text-slate-500">{item.email}</p></td><td className="px-5 py-4"><StatusPill value={item.role} /></td><td className="px-5 py-4 text-slate-600">{item.organization || "-"}</td><td className="px-5 py-4 text-slate-500">{formatDate(item.created_at)}</td></tr>)}</tbody></table>{members.length === 0 && <Empty label="No members have registered yet." />}</section>}

        {queue === "contacts" && <section className="space-y-3">{contacts.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-2 sm:flex-row sm:justify-between"><div><h2 className="font-bold text-slate-900">{item.subject}</h2><p className="text-xs text-slate-500">{item.name} · {item.email}</p></div><StatusPill value={item.status} /></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.message}</p></article>)}{contacts.length === 0 && <Empty label="No contact requests have been received." />}</section>}

        {queue === "payments" && <section className="space-y-3">{payments.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">{item.target_title}</h2><p className="text-xs text-slate-500">{item.full_name || "Customer"} · {item.email} · {item.provider_reference}</p></div><div className="flex items-center gap-3"><strong className="text-sm text-brand-navy">{item.currency} {item.amount}</strong><StatusPill value={item.status} /></div></div>)}{payments.length === 0 && <Empty label="No payment records yet." />}</section>}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">{label}</div>;
}

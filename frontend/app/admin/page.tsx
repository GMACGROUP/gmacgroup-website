"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  LinkedInIcon,
} from "@/components/common/Icons";

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
  phone?: string | null;
  linkedin_url?: string | null;
  cover_note?: string | null;
  resume_url?: string | null;
  offer_type?: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Enrolment {
  id: string;
  programme_title?: string;
  full_name?: string;
  email?: string;
  phone?: string | null;
  organization?: string | null;
  notes?: string | null;
  offer_type?: string;
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

interface AdminPage<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

type Queue = "applications" | "enrolments" | "members" | "contacts" | "payments" | "catalogue";
type AdminQueue = Exclude<Queue, "catalogue">;

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ─── Catalogue types ─────────────────────────────────────────────────────────
interface CatalogueOffer {
  type: "free" | "vip" | "premium";
  label: string;
  amount: number;
  currency: string;
}

interface CatalogueProgramme {
  id: string;
  title: string;
  category: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  offers: CatalogueOffer[];
}

interface CatalogueOpportunity {
  id: string;
  title: string;
  type: string;
  organization?: string;
  location?: string;
  description?: string;
  deadline?: string;
  offers: CatalogueOffer[];
}

type CatalogueMode = "programmes" | "opportunities";
type FormAction = "create" | "edit";

const applicationStatuses = [
  "submitted",
  "under_review",
  "interview",
  "shortlisted",
  "accepted",
  "rejected",
  "withdrawn",
];

const enrolmentStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "withdrawn",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ value }: { value: string }) {
  const isPositive = ["accepted", "confirmed", "successful"].includes(value);
  const isPending = ["submitted", "under_review", "pending"].includes(value);
  const isNegative = ["rejected", "cancelled", "withdrawn", "failed"].includes(value);

  const colorClass = isPositive
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isPending
    ? "bg-blue-50 text-brand-navy border-blue-200"
    : isNegative
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function PaginationControls({
  page,
  pageSize,
  total,
  disabled,
  onChange,
}: PaginationState & { disabled?: boolean; onChange: (page: number) => void }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 pt-2 text-xs text-slate-500">
      <span>
        Page {page} of {pageCount} · {total} total
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || page === 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || page === pageCount}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
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
  const [queueLoading, setQueueLoading] = useState(false);
  const [pagination, setPagination] = useState<Record<AdminQueue, PaginationState>>({
    applications: { page: 1, pageSize: 20, total: 0 },
    enrolments: { page: 1, pageSize: 20, total: 0 },
    members: { page: 1, pageSize: 20, total: 0 },
    contacts: { page: 1, pageSize: 20, total: 0 },
    payments: { page: 1, pageSize: 20, total: 0 },
  });
  const [error, setError] = useState<string | null>(null);

  // Catalogue state
  const [catalogueMode, setCatalogueMode] = useState<CatalogueMode>("programmes");
  const [programmes, setProgrammes] = useState<CatalogueProgramme[]>([]);
  const [opportunities, setOpportunities] = useState<CatalogueOpportunity[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);
  const [showCatalogueForm, setShowCatalogueForm] = useState(false);
  const [catalogueFormAction, setCatalogueFormAction] = useState<FormAction>("create");
  const [editingProgramme, setEditingProgramme] = useState<CatalogueProgramme | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<CatalogueOpportunity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Programme form fields
  const [progTitle, setProgTitle] = useState("");
  const [progCategory, setProgCategory] = useState("student");
  const [progDesc, setProgDesc] = useState("");
  const [progStartDate, setProgStartDate] = useState("");
  const [progEndDate, setProgEndDate] = useState("");

  // Opportunity form fields
  const [oppTitle, setOppTitle] = useState("");
  const [oppType, setOppType] = useState("internship");
  const [oppOrg, setOppOrg] = useState("");
  const [oppLocation, setOppLocation] = useState("");
  const [oppDesc, setOppDesc] = useState("");
  const [oppDeadline, setOppDeadline] = useState("");

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Application / Document Review Modal State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [previewTab, setPreviewTab] = useState<"document" | "statement">("document");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const getFullFileUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const base = API_BASE.replace(/\/api\/v1$/, "");
    return `${base}${url}`;
  };

  async function loadCatalogue() {
    setCatalogueLoading(true);
    setCatalogueError(null);
    try {
      const [progs, opps] = await Promise.all([
        apiClient.get<CatalogueProgramme[]>("/programmes"),
        apiClient.get<CatalogueOpportunity[]>("/opportunities"),
      ]);
      setProgrammes(progs);
      setOpportunities(opps);
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Could not load catalogue");
    } finally {
      setCatalogueLoading(false);
    }
  }

  async function loadQueuePage(queueName: AdminQueue, page: number) {
    setQueueLoading(true);
    setError(null);
    try {
      const result = await apiClient.get<AdminPage<Application | Enrolment | Member | ContactRequest | Payment>>(
        `/admin/${queueName}?page=${page}&page_size=20`,
      );
      setPagination((previous) => ({
        ...previous,
        [queueName]: { page: result.page, pageSize: result.page_size, total: result.total },
      }));
      switch (queueName) {
        case "applications":
          setApplications(result.items as Application[]);
          break;
        case "enrolments":
          setEnrolments(result.items as Enrolment[]);
          break;
        case "members":
          setMembers(result.items as Member[]);
          break;
        case "contacts":
          setContacts(result.items as ContactRequest[]);
          break;
        case "payments":
          setPayments(result.items as Payment[]);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load operations data");
    } finally {
      setQueueLoading(false);
    }
  }

  async function loadData() {
    setLoadingData(true);
    setError(null);
    try {
      const [summary, applicationPage, enrolmentPage, memberPage, contactPage, paymentPage] =
        await Promise.all([
          apiClient.get<Overview>("/admin/overview").catch(() => null),
          apiClient.get<AdminPage<Application>>("/admin/applications?page=1&page_size=20").catch(() => null),
          apiClient.get<AdminPage<Enrolment>>("/admin/enrolments?page=1&page_size=20").catch(() => null),
          apiClient.get<AdminPage<Member>>("/admin/members?page=1&page_size=20").catch(() => null),
          apiClient.get<AdminPage<ContactRequest>>("/admin/contacts?page=1&page_size=20").catch(() => null),
          apiClient.get<AdminPage<Payment>>("/admin/payments?page=1&page_size=20").catch(() => null),
        ]);
      await loadCatalogue();
      if (summary) setOverview(summary);
      if (applicationPage) {
        setApplications(applicationPage.items);
        setPagination((previous) => ({ ...previous, applications: { page: applicationPage.page, pageSize: applicationPage.page_size, total: applicationPage.total } }));
      }
      if (enrolmentPage) {
        setEnrolments(enrolmentPage.items);
        setPagination((previous) => ({ ...previous, enrolments: { page: enrolmentPage.page, pageSize: enrolmentPage.page_size, total: enrolmentPage.total } }));
      }
      if (memberPage) {
        setMembers(memberPage.items);
        setPagination((previous) => ({ ...previous, members: { page: memberPage.page, pageSize: memberPage.page_size, total: memberPage.total } }));
      }
      if (contactPage) {
        setContacts(contactPage.items);
        setPagination((previous) => ({ ...previous, contacts: { page: contactPage.page, pageSize: contactPage.page_size, total: contactPage.total } }));
      }
      if (paymentPage) {
        setPayments(paymentPage.items);
        setPagination((previous) => ({ ...previous, payments: { page: paymentPage.page, pageSize: paymentPage.page_size, total: paymentPage.total } }));
      }
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

  // ─── Catalogue helpers ────────────────────────────────────────────────────
  function openCreateProgramme() {
    setEditingProgramme(null);
    setProgTitle(""); setProgCategory("student"); setProgDesc(""); setProgStartDate(""); setProgEndDate("");
    setCatalogueFormAction("create");
    setShowCatalogueForm(true);
  }

  function openEditProgramme(prog: CatalogueProgramme) {
    setEditingProgramme(prog);
    setProgTitle(prog.title);
    setProgCategory(prog.category);
    setProgDesc(prog.description || "");
    setProgStartDate(prog.start_date ? prog.start_date.substring(0, 10) : "");
    setProgEndDate(prog.end_date ? prog.end_date.substring(0, 10) : "");
    setCatalogueFormAction("edit");
    setShowCatalogueForm(true);
  }

  function openCreateOpportunity() {
    setEditingOpportunity(null);
    setOppTitle(""); setOppType("internship"); setOppOrg(""); setOppLocation(""); setOppDesc(""); setOppDeadline("");
    setCatalogueFormAction("create");
    setShowCatalogueForm(true);
  }

  function openEditOpportunity(opp: CatalogueOpportunity) {
    setEditingOpportunity(opp);
    setOppTitle(opp.title);
    setOppType(opp.type);
    setOppOrg(opp.organization || "");
    setOppLocation(opp.location || "");
    setOppDesc(opp.description || "");
    setOppDeadline(opp.deadline ? opp.deadline.substring(0, 10) : "");
    setCatalogueFormAction("edit");
    setShowCatalogueForm(true);
  }

  async function submitProgrammeForm() {
    setFormSubmitting(true);
    setCatalogueError(null);
    const body = {
      title: progTitle,
      category: progCategory,
      description: progDesc || undefined,
      start_date: progStartDate ? new Date(progStartDate).toISOString() : undefined,
      end_date: progEndDate ? new Date(progEndDate).toISOString() : undefined,
      offers: [],
    };
    try {
      if (catalogueFormAction === "create") {
        const created = await apiClient.post<CatalogueProgramme>("/admin/programmes", body);
        setProgrammes((prev) => [created, ...prev]);
      } else if (editingProgramme) {
        const updated = await apiClient.put<CatalogueProgramme>(`/admin/programmes/${editingProgramme.id}`, body);
        setProgrammes((prev) => prev.map((p) => (p.id === editingProgramme.id ? updated : p)));
      }
      setShowCatalogueForm(false);
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Failed to save programme");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function submitOpportunityForm() {
    setFormSubmitting(true);
    setCatalogueError(null);
    const body = {
      title: oppTitle,
      type: oppType,
      organization: oppOrg || undefined,
      location: oppLocation || undefined,
      description: oppDesc || undefined,
      deadline: oppDeadline ? new Date(oppDeadline).toISOString() : undefined,
      offers: [],
    };
    try {
      if (catalogueFormAction === "create") {
        const created = await apiClient.post<CatalogueOpportunity>("/admin/opportunities", body);
        setOpportunities((prev) => [created, ...prev]);
      } else if (editingOpportunity) {
        const updated = await apiClient.put<CatalogueOpportunity>(`/admin/opportunities/${editingOpportunity.id}`, body);
        setOpportunities((prev) => prev.map((o) => (o.id === editingOpportunity.id ? updated : o)));
      }
      setShowCatalogueForm(false);
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Failed to save opportunity");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function deleteProgramme(id: string) {
    try {
      await apiClient.delete(`/admin/programmes/${id}`);
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  }

  async function deleteOpportunity(id: string) {
    try {
      await apiClient.delete(`/admin/opportunities/${id}`);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  }

  async function changeApplicationStatus(id: string, status: string) {
    try {
      const updated = await apiClient.patch<Application>(`/admin/applications/${id}`, { status });
      setApplications((rows) => rows.map((row) => (row.id === id ? updated : row)));
      if (selectedApplication?.id === id) {
        setSelectedApplication(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  async function changeEnrolmentStatus(id: string, status: string) {
    try {
      const updated = await apiClient.patch<Enrolment>(`/admin/enrolments/${id}`, { status });
      setEnrolments((rows) => rows.map((row) => (row.id === id ? updated : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  if (loading || loadingData)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-sm text-slate-500">
        Loading operations console...
      </div>
    );

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Operations access required</h1>
        <p className="text-sm text-slate-500">This workspace is restricted to authorised GMAC operations staff.</p>
        <Link href="/dashboard" className="text-sm font-bold text-brand-red hover:underline">
          Return to member portal
        </Link>
      </div>
    );
  }

  const cards = overview
    ? [
        ["Members", overview.members],
        ["Applications", overview.applications],
        ["Enrolments", overview.enrolments],
        ["Contacts", overview.contacts],
        ["Pending payments", overview.pending_payments],
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label text-brand-red">GMAC operations</span>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900 font-serif">Member Workspace</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review candidates, uploaded documents, cohort enrolments, enquiries, and payments.
            </p>
          </div>
          <button
            onClick={loadData}
            className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs"
          >
            Refresh queues
          </button>
        </header>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-extrabold text-brand-navy">{value}</p>
            </div>
          ))}
        </div>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
          {(["applications", "enrolments", "members", "contacts", "payments", "catalogue"] as Queue[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                setQueue(item);
                if (item === "catalogue" && programmes.length === 0 && opportunities.length === 0) {
                  loadCatalogue();
                }
              }}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
                queue === item
                  ? "bg-brand-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-brand-navy hover:bg-white"
              }`}
            >
              {item}
              {item === "applications" && applications.length > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                  {applications.length}
                </span>
              )}
              {item === "catalogue" && (
                <span className="ml-1.5 rounded-md bg-amber-400 text-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider">
                  CRUD
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Applications Queue ── */}
        {queue === "applications" && (
          <section className="space-y-4">
            {applications.map((item) => {
              const hasResume = Boolean(item.resume_url);
              const isPdf = item.resume_url?.toLowerCase().endsWith(".pdf") || item.resume_url?.includes("/uploads/");

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base font-serif">
                          {item.opportunity_title || "Opportunity Application"}
                        </h2>
                        {item.offer_type && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {item.offer_type}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-700 font-medium">
                        {item.applicant_name || "Applicant"} ·{" "}
                        <span className="text-slate-500 font-normal">{item.applicant_email}</span>
                        {item.phone && <span className="text-slate-400"> · {item.phone}</span>}
                      </p>

                      <p className="text-xs text-slate-400">
                        Submitted {formatDate(item.created_at)} · Payment:{" "}
                        <span className="capitalize">{item.payment_status.replaceAll("_", " ")}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* View & Review Candidate Button */}
                      <button
                        onClick={() => {
                          setSelectedApplication(item);
                          setPreviewTab(hasResume ? "document" : "statement");
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          hasResume
                            ? "bg-brand-navy text-white hover:bg-brand-navyDark"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {hasResume ? (
                          <>
                            <DocumentIcon className="w-4 h-4 text-brand-cyan" />
                            <span>Review Candidate & CV</span>
                          </>
                        ) : (
                          <>
                            <EyeIcon className="w-4 h-4" />
                            <span>View Profile</span>
                          </>
                        )}
                      </button>

                      <StatusPill value={item.status} />

                      <select
                        value={item.status}
                        onChange={(event) => changeApplicationStatus(item.id, event.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                      >
                        {applicationStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
            {applications.length === 0 && <Empty label="No applications have been submitted yet." />}
            <PaginationControls
              {...pagination.applications}
              disabled={queueLoading}
              onChange={(page) => loadQueuePage("applications", page)}
            />
          </section>
        )}

        {/* ── Enrolments Queue ── */}
        {queue === "enrolments" && (
          <section className="space-y-3">
            {enrolments.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">{item.programme_title || "Programme enrolment"}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.full_name || "Member"} · {item.email} {item.organization && `(${item.organization})`}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Submitted {formatDate(item.created_at)} · Payment: {item.payment_status.replaceAll("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill value={item.status} />
                    <select
                      value={item.status}
                      onChange={(event) => changeEnrolmentStatus(item.id, event.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                    >
                      {enrolmentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {enrolments.length === 0 && <Empty label="No programme enrolments have been submitted yet." />}
            <PaginationControls
              {...pagination.enrolments}
              disabled={queueLoading}
              onChange={(page) => loadQueuePage("enrolments", page)}
            />
          </section>
        )}

        {/* ── Members Queue ── */}
        {queue === "members" && (
          <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Organisation</th>
                  <th className="px-5 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{item.full_name || "Unnamed member"}</p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill value={item.role} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.organization || "-"}</td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && <Empty label="No members have registered yet." />}
            <div className="px-5 pb-5">
              <PaginationControls
                {...pagination.members}
                disabled={queueLoading}
                onChange={(page) => loadQueuePage("members", page)}
              />
            </div>
          </section>
        )}

        {/* ── Contacts Queue ── */}
        {queue === "contacts" && (
          <section className="space-y-3">
            {contacts.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">{item.subject}</h2>
                    <p className="text-xs text-slate-500">
                      {item.name} · {item.email}
                    </p>
                  </div>
                  <StatusPill value={item.status} />
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.message}</p>
              </article>
            ))}
            {contacts.length === 0 && <Empty label="No contact requests have been received." />}
            <PaginationControls
              {...pagination.contacts}
              disabled={queueLoading}
              onChange={(page) => loadQueuePage("contacts", page)}
            />
          </section>
        )}

        {/* ── Payments Queue ── */}
        {queue === "payments" && (
          <section className="space-y-3">
            {payments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-bold text-slate-900">{item.target_title}</h2>
                  <p className="text-xs text-slate-500">
                    {item.full_name || "Customer"} · {item.email} · {item.provider_reference}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <strong className="text-sm text-brand-navy">
                    {item.currency} {item.amount}
                  </strong>
                  <StatusPill value={item.status} />
                </div>
              </div>
            ))}
            {payments.length === 0 && <Empty label="No payment records yet." />}
            <PaginationControls
              {...pagination.payments}
              disabled={queueLoading}
              onChange={(page) => loadQueuePage("payments", page)}
            />
          </section>
        )}

        {/* ── Catalogue Management ── */}
        {queue === "catalogue" && (
          <section className="space-y-6">
            {/* Sub-mode Switcher + Action Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1.5">
                <button
                  onClick={() => setCatalogueMode("programmes")}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    catalogueMode === "programmes"
                      ? "bg-white text-brand-navy shadow-xs"
                      : "text-slate-600 hover:text-brand-navy"
                  }`}
                >
                  🎓 Programmes ({programmes.length})
                </button>
                <button
                  onClick={() => setCatalogueMode("opportunities")}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    catalogueMode === "opportunities"
                      ? "bg-white text-brand-navy shadow-xs"
                      : "text-slate-600 hover:text-brand-navy"
                  }`}
                >
                  💼 Opportunities ({opportunities.length})
                </button>
              </div>
              <button
                onClick={() => {
                  if (catalogueMode === "programmes") openCreateProgramme();
                  else openCreateOpportunity();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-red hover:bg-red-700 shadow-card transition-all whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {catalogueMode === "programmes" ? "Programme" : "Opportunity"}
              </button>
            </div>

            {catalogueError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {catalogueError}
              </div>
            )}

            {catalogueLoading && (
              <div className="text-center text-sm text-slate-400 py-10">Loading catalogue…</div>
            )}

            {/* Programmes List */}
            {!catalogueLoading && catalogueMode === "programmes" && (
              <div className="space-y-3">
                {programmes.map((prog) => (
                  <div
                    key={prog.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-slate-900 font-serif">{prog.title}</h2>
                          <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {prog.category.replace("_", " ")}
                          </span>
                        </div>
                        {prog.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{prog.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
                          {prog.start_date && <span>Starts: {new Date(prog.start_date).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</span>}
                          {prog.end_date && <span>Ends: {new Date(prog.end_date).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditProgramme(prog)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(`prog:${prog.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {programmes.length === 0 && <Empty label="No programmes found. Add your first programme using the button above." />}
              </div>
            )}

            {/* Opportunities List */}
            {!catalogueLoading && catalogueMode === "opportunities" && (
              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-slate-900 font-serif">{opp.title}</h2>
                          <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {opp.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          {opp.organization && <span className="font-medium">{opp.organization}</span>}
                          {opp.location && <span>📍 {opp.location}</span>}
                          {opp.deadline && <span>⏰ Deadline: {new Date(opp.deadline).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</span>}
                        </div>
                        {opp.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{opp.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditOpportunity(opp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(`opp:${opp.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {opportunities.length === 0 && <Empty label="No opportunities found. Add your first opportunity using the button above." />}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">This action cannot be undone. The item will be permanently removed from the catalogue.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.startsWith("prog:")) deleteProgramme(deleteConfirm.replace("prog:", ""));
                  else if (deleteConfirm.startsWith("opp:")) deleteOpportunity(deleteConfirm.replace("opp:", ""));
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Catalogue Create / Edit Form Modal ── */}
      {showCatalogueForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                  {catalogueFormAction === "create" ? "New" : "Edit"} {catalogueMode === "programmes" ? "Programme" : "Opportunity"}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 font-serif mt-0.5">
                  {catalogueFormAction === "create" ? "Create" : "Update"} Catalogue Item
                </h2>
              </div>
              <button
                onClick={() => setShowCatalogueForm(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {catalogueError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                  {catalogueError}
                </div>
              )}

              {catalogueMode === "programmes" ? (
                <>
                  <FormField label="Programme Title *">
                    <input
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                      placeholder="e.g. GMAC Emerging Leaders Cohort 2025"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Category">
                    <select value={progCategory} onChange={(e) => setProgCategory(e.target.value)} className={inputCls}>
                      <option value="student">Student</option>
                      <option value="professional_development">Professional Development</option>
                      <option value="training">Training</option>
                      <option value="institutional">Institutional</option>
                    </select>
                  </FormField>
                  <FormField label="Description">
                    <textarea
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                      placeholder="Describe the programme goals, eligibility, and benefits…"
                      rows={4}
                      className={inputCls + " resize-none"}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Start Date">
                      <input type="date" value={progStartDate} onChange={(e) => setProgStartDate(e.target.value)} className={inputCls} />
                    </FormField>
                    <FormField label="End Date">
                      <input type="date" value={progEndDate} onChange={(e) => setProgEndDate(e.target.value)} className={inputCls} />
                    </FormField>
                  </div>
                </>
              ) : (
                <>
                  <FormField label="Opportunity Title *">
                    <input
                      value={oppTitle}
                      onChange={(e) => setOppTitle(e.target.value)}
                      placeholder="e.g. Graduate Trainee – Finance & Operations"
                      className={inputCls}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Type">
                      <select value={oppType} onChange={(e) => setOppType(e.target.value)} className={inputCls}>
                        <option value="internship">Internship</option>
                        <option value="employment">Employment</option>
                        <option value="fellowship">Fellowship</option>
                        <option value="other">Other</option>
                      </select>
                    </FormField>
                    <FormField label="Deadline">
                      <input type="date" value={oppDeadline} onChange={(e) => setOppDeadline(e.target.value)} className={inputCls} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Organisation">
                      <input value={oppOrg} onChange={(e) => setOppOrg(e.target.value)} placeholder="GMAC GROUP" className={inputCls} />
                    </FormField>
                    <FormField label="Location">
                      <input value={oppLocation} onChange={(e) => setOppLocation(e.target.value)} placeholder="Accra / Hybrid / Remote" className={inputCls} />
                    </FormField>
                  </div>
                  <FormField label="Description">
                    <textarea
                      value={oppDesc}
                      onChange={(e) => setOppDesc(e.target.value)}
                      placeholder="Describe the role, requirements, and what candidates can expect…"
                      rows={4}
                      className={inputCls + " resize-none"}
                    />
                  </FormField>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 sm:px-6 pb-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCatalogueForm(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={formSubmitting || (catalogueMode === "programmes" ? !progTitle.trim() : !oppTitle.trim())}
                onClick={() => {
                  if (catalogueMode === "programmes") submitProgrammeForm();
                  else submitOpportunityForm();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-card transition-colors disabled:opacity-50"
              >
                {formSubmitting ? "Saving…" : catalogueFormAction === "create" ? "Create →" : "Save Changes →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Candidate & Document Viewer Modal ── */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm modal-backdrop-in">
          <div
            className="relative w-full max-w-4xl max-h-[calc(100dvh-2rem)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 modal-panel-in overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Candidate Application
                  </span>
                  <StatusPill value={selectedApplication.status} />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                  {selectedApplication.applicant_name || "Unnamed Applicant"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{selectedApplication.applicant_email}</span>
                  {selectedApplication.phone && <span>• {selectedApplication.phone}</span>}
                  <span>• {selectedApplication.opportunity_title}</span>
                  {selectedApplication.linkedin_url && (
                    <a
                      href={selectedApplication.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-brand-navy hover:text-brand-red transition-colors"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* View Selector Tabs & Actions */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {selectedApplication.resume_url && (
                  <button
                    onClick={() => setPreviewTab("document")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      previewTab === "document"
                        ? "bg-brand-navy text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <DocumentIcon className="w-4 h-4" />
                    <span>Curriculum Vitae / Document</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewTab("statement")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    previewTab === "statement"
                      ? "bg-brand-navy text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>Statement of Interest</span>
                </button>
              </div>

              {/* Status Selector in Modal */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => changeApplicationStatus(selectedApplication.id, e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  {applicationStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100/50">
              {previewTab === "document" && selectedApplication.resume_url ? (
                <div className="space-y-4">
                  {/* Top Document Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-red flex items-center justify-center border border-red-100">
                        <DocumentIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                          {selectedApplication.resume_url.split("/").pop() || "Candidate Document"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {selectedApplication.resume_url.startsWith("/api/v1/uploads/")
                            ? "Verified Local/Cloud Upload"
                            : "External Cloud Link"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getFullFileUrl(selectedApplication.resume_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-navy bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Open in New Tab</span>
                      </a>
                      <a
                        href={getFullFileUrl(selectedApplication.resume_url)}
                        download
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  {/* Embedded PDF Viewer */}
                  {selectedApplication.resume_url.toLowerCase().endsWith(".pdf") ||
                  selectedApplication.resume_url.includes("/uploads/") ? (
                    <div className="relative w-full h-[520px] rounded-2xl bg-white border border-slate-200 shadow-card overflow-hidden">
                      <iframe
                        src={`${getFullFileUrl(selectedApplication.resume_url)}#toolbar=1`}
                        className="w-full h-full"
                        title="Resume Document Preview"
                      />
                    </div>
                  ) : (
                    <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-card">
                      <DocumentIcon className="w-12 h-12 text-slate-400 mx-auto" />
                      <h3 className="text-base font-bold text-slate-900">External Document Link</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        This applicant provided an external URL for their portfolio or CV:
                      </p>
                      <a
                        href={selectedApplication.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-sm"
                      >
                        <span>Open Link in New Tab</span>
                        <EyeIcon className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Statement Card */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-card space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif">
                      Statement of Interest & Experience
                    </h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedApplication.cover_note || "No statement was provided by this applicant."}
                    </p>
                  </div>

                  {/* Metadata Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Opportunity Applied
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1">
                        {selectedApplication.opportunity_title}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Submission Date & Tier
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1">
                        {formatDate(selectedApplication.created_at)} • Tier:{" "}
                        <span className="uppercase text-brand-red">{selectedApplication.offer_type || "free"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Application ID: {selectedApplication.id.substring(0, 8)}...
              </span>
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-card">
      {label}
    </div>
  );
}

// ─── Shared form helpers ──────────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

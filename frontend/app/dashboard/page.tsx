"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
import { Opportunity, Programme } from "@/types";
import { ActivityDetailModal } from "@/components/modals/ActivityDetailModal";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@/components/common/Icons";

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

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewWelcome = searchParams?.get("welcome") === "1";

  const { user, loading, logout, updateProfile } = useAuth();

  const [showWelcomeAlert, setShowWelcomeAlert] = useState(isNewWelcome);
  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<{
    kind: "programme" | "opportunity";
    title: string;
    status: string;
    createdAt: string;
  } | null>(null);
  const [activityDetails, setActivityDetails] = useState<Programme | Opportunity | null>(null);
  const [loadingActivityDetails, setLoadingActivityDetails] = useState(false);
  const [activityDetailError, setActivityDetailError] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    organization: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (user) {
      setEditForm({
        full_name: user.full_name || "",
        organization: user.organization || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });

      // Fetch user's live enrolments & applications
      setLoadingData(true);
      Promise.all([
        apiClient.get<EnrolmentItem[]>("/programmes/my-enrolments").catch(() => []),
        apiClient.get<ApplicationItem[]>("/opportunities/my-applications").catch(() => []),
      ])
        .then(([enrols, apps]) => {
          setEnrolments(enrols);
          setApplications(apps);
        })
        .finally(() => setLoadingData(false));
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-navy" />
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(editForm);
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileSuccess(false);
        setIsEditingProfile(false);
      }, 1500);
    } catch {
      // handle error
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  async function openProgrammeDetails(item: EnrolmentItem) {
    setSelectedActivity({ kind: "programme", title: item.programme_title || item.programme_id, status: item.status, createdAt: item.created_at });
    setActivityDetails(null);
    setActivityDetailError(null);
    setLoadingActivityDetails(true);
    try {
      setActivityDetails(await apiClient.get<Programme>(`/programmes/${item.programme_id}`));
    } catch {
      setActivityDetailError("We could not load the full programme details right now.");
    } finally {
      setLoadingActivityDetails(false);
    }
  }

  async function openOpportunityDetails(item: ApplicationItem) {
    setSelectedActivity({ kind: "opportunity", title: item.opportunity_title || item.opportunity_id, status: item.status, createdAt: item.created_at });
    setActivityDetails(null);
    setActivityDetailError(null);
    setLoadingActivityDetails(true);
    try {
      setActivityDetails(await apiClient.get<Opportunity>(`/opportunities/${item.opportunity_id}`));
    } catch {
      setActivityDetailError("We could not load the full opportunity details right now.");
    } finally {
      setLoadingActivityDetails(false);
    }
  }

  const userDisplayName = user.full_name || user.email.split("@")[0];

  return (
    <div className="w-full min-w-0 overflow-x-clip bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="container mx-auto w-full min-w-0 px-4 sm:px-6 max-w-6xl space-y-8">

        {/* ── New Member Welcome Alert ── */}
        {showWelcomeAlert && (
          <div className="relative min-w-0 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-brand-navy text-white shadow-elevate flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn border border-emerald-400/30">
            <div className="flex min-w-0 items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">🎉</span>
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="text-base sm:text-lg font-bold font-serif">
                  Welcome to GMACGROUP, {userDisplayName}!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                  Your member account is active and a welcome orientation email has been dispatched to{" "}
                  <strong className="break-all text-white font-semibold">{user.email}</strong>. Explore programmes, submit fellowship applications, or complete your profile below.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcomeAlert(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/25 shrink-0 self-end sm:self-center"
            >
              Dismiss ✕
            </button>
          </div>
        )}

        {/* ── Welcome Banner ── */}
        <div className="relative min-w-0 rounded-3xl bg-brand-navy text-white p-5 sm:p-10 shadow-elevate overflow-hidden border border-brand-navyLight/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-48 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider border border-white/15">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-brand-cyan" />
                  GMAC Member Portal
                </span>
                <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-red text-white">
                  {user.role}
                </span>
              </div>

                <h1 className="break-words text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight">
                Welcome back, {userDisplayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Track your active cohort enrolments, fellowship applications, and collaborate across the GMAC research network.
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 shrink-0">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all sm:w-auto"
              >
                {isEditingProfile ? "Close Profile" : "Edit Profile"}
              </button>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  prefetch={true}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-cyan text-brand-navy hover:bg-white transition-all sm:w-auto"
                >
                  Operations Console
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 transition-all sm:w-auto"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile Editing Panel ── */}
        {isEditingProfile && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card animate-fadeIn">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Edit Member Profile</h3>
              <p className="text-xs text-slate-500">Update your public biographical and professional details.</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    value={editForm.organization}
                    onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                    placeholder="e.g. University of Ghana"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+233 50 123 4567"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Focus Areas
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Share a short summary of your professional background, goals, or research interests..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-navy"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-navy hover:bg-brand-navyDark transition-colors disabled:opacity-50"
                >
                  {savingProfile ? "Saving…" : "Save Changes"}
                </button>
                {profileSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    Profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Metric Snapshot Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="min-w-0 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-300 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-ice flex items-center justify-center text-brand-navy shrink-0">
              <AcademicCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.08em] sm:tracking-wider">
                Cohort Enrolments
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 font-serif">
                {loadingData ? "…" : enrolments.length}
              </h3>
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-300 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.08em] sm:tracking-wider">
                Applications
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 font-serif">
                {loadingData ? "…" : applications.length}
              </h3>
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-300 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.08em] sm:tracking-wider">
                Account Status
              </p>
              <h3 className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Member
              </h3>
            </div>
          </div>
        </div>

        {/* ── Two Column Activities ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">

          {/* Enrolled Programmes */}
            <div className="min-w-0 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-300 shadow-sm space-y-4 sm:space-y-5">
              <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 font-serif">My Programmes</h3>
                <p className="text-xs text-slate-500">Active and upcoming cohort tracks</p>
              </div>
              <Link
                href="/programmes"
                prefetch={true}
                className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors"
              >
                Browse All →
              </Link>
            </div>

            <div className="space-y-3">
              {loadingData ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-slate-100 rounded-2xl" />
                  <div className="h-16 bg-slate-100 rounded-2xl" />
                </div>
              ) : enrolments.length > 0 ? (
                enrolments.map((item) => (
                  <button
                    type="button"
                    onClick={() => openProgrammeDetails(item)}
                    key={item.id}
                    className="group min-w-0 w-full rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-left transition hover:border-brand-navy/30 hover:bg-brand-ice/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-bold text-slate-900">{item.programme_title || item.programme_id}</h4>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500"><ClockIcon className="h-3.5 w-3.5 text-slate-400" />Enrolled {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-navy">→</span>
                    </div>
                    <span className="mt-2 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{item.status || "Enrolled"}</span>
                  </button>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <AcademicCapIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">You are not enrolled in any programmes yet.</p>
                  <Link
                    href="/programmes"
                    prefetch={true}
                    className="inline-block text-xs font-bold text-brand-navy hover:underline pt-1"
                  >
                    Explore Programmes catalogue →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Submitted Applications */}
            <div className="min-w-0 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-300 shadow-sm space-y-4 sm:space-y-5">
              <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 font-serif">My Applications</h3>
                <p className="text-xs text-slate-500">Submitted fellowship & opening dossiers</p>
              </div>
              <Link
                href="/opportunities"
                prefetch={true}
                className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors"
              >
                View Openings →
              </Link>
            </div>

            <div className="space-y-3">
              {loadingData ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-slate-100 rounded-2xl" />
                  <div className="h-16 bg-slate-100 rounded-2xl" />
                </div>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <button
                    type="button"
                    onClick={() => openOpportunityDetails(app)}
                    key={app.id}
                    className="group min-w-0 w-full rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-left transition hover:border-brand-navy/30 hover:bg-brand-ice/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-bold text-slate-900">{app.opportunity_title || app.opportunity_id}</h4>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500"><ClockIcon className="h-3.5 w-3.5 text-slate-400" />Submitted {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-navy">→</span>
                    </div>
                    <span className="mt-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-navy">{app.status || "Submitted"}</span>
                  </button>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <BriefcaseIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">No active applications submitted yet.</p>
                  <Link
                    href="/opportunities"
                    prefetch={true}
                    className="inline-block text-xs font-bold text-brand-navy hover:underline pt-1"
                  >
                    Browse open fellowships & roles →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        <ActivityDetailModal
          preview={selectedActivity}
          details={activityDetails}
          loading={loadingActivityDetails}
          error={activityDetailError}
          onClose={() => {
            setSelectedActivity(null);
            setActivityDetails(null);
          }}
        />

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-navy" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, updateProfile } = useAuth();

  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  const userDisplayName = user.full_name || user.email.split("@")[0];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="relative rounded-3xl bg-brand-navy text-white p-8 sm:p-10 shadow-elevate overflow-hidden border border-brand-navyLight/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-48 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider border border-white/15">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-brand-cyan" />
                  GMAC Member Portal
                </span>
                <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-red text-white">
                  {user.role}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif">
                Welcome back, {userDisplayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Track your active cohort enrolments, fellowship applications, and collaborate across the GMAC research network.
              </p>
            </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
              >
                {isEditingProfile ? "Close Profile" : "Edit Profile"}
              </button>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-cyan text-brand-navy hover:bg-white transition-all"
                >
                  Operations Console
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 transition-all"
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
              <h3 className="text-lg font-bold text-slate-900 font-serif">Update Profile Details</h3>
              <p className="text-xs text-slate-500 mt-1">Keep your contact and institutional information up to date.</p>
            </div>

            <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Institution / Organization
                </label>
                <input
                  type="text"
                  value={editForm.organization}
                  onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                  placeholder="e.g. University / Enterprise"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+233 24 123 4567"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Professional Bio / Research Focus
                </label>
                <input
                  type="text"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="e.g. Econometrician & Labor Policy Fellow"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex items-center justify-between">
                {profileSuccess ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4" /> Profile updated successfully!
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark shadow-sm disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Key Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Cohorts</div>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {loadingData ? "…" : enrolments.length}
              </div>
              <Link href="/programmes" className="text-xs text-brand-red font-semibold hover:underline mt-2 inline-block">
                Browse cohorts →
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-navy flex items-center justify-center border border-blue-100">
              <AcademicCapIcon className="w-6 h-6 text-brand-navy" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {loadingData ? "…" : applications.length}
              </div>
              <Link href="/opportunities" className="text-xs text-brand-navy font-semibold hover:underline mt-2 inline-block">
                View openings →
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <BriefcaseIcon className="w-6 h-6 text-purple-700" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membership</div>
              <div className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit mt-2">
                ● Verified Member
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">{user.email}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* ── Main Dashboard Content Grid ── */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Section 1: Enrolled Programmes */}
          <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">My Cohorts & Enrolments</h2>
                <p className="text-xs text-slate-500 mt-0.5">Development pathways and workshops registered to your profile</p>
              </div>
              <Link href="/programmes" className="text-xs font-bold text-brand-navy hover:text-brand-red">
                + Enrol
              </Link>
            </div>

            <div className="flex-1 space-y-3">
              {enrolments.length > 0 ? (
                enrolments.map((enrol) => (
                  <div
                    key={enrol.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {enrol.programme_title || enrol.programme_id}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        Enrolled {new Date(enrol.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {enrol.status || "Confirmed"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <AcademicCapIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">You have not enrolled in any cohorts yet.</p>
                  <Link
                    href="/programmes"
                    className="inline-block text-xs font-bold text-brand-red hover:underline pt-1"
                  >
                    Explore upcoming cohorts →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Opportunity Applications */}
          <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Application History</h2>
                <p className="text-xs text-slate-500 mt-0.5">Internship and fellowship submissions</p>
              </div>
              <Link href="/opportunities" className="text-xs font-bold text-brand-navy hover:text-brand-red">
                + Apply
              </Link>
            </div>

            <div className="flex-1 space-y-3">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {app.opportunity_title || app.opportunity_id}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        Submitted {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-navy border border-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {app.status || "Submitted"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <BriefcaseIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">No active applications submitted yet.</p>
                  <Link
                    href="/opportunities"
                    className="inline-block text-xs font-bold text-brand-navy hover:underline pt-1"
                  >
                    Browse open fellowships & roles →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

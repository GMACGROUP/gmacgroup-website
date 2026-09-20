"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api/client";
import { ResearchProject, Publication, Expert } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { PaperRequestModal } from "@/components/modals/PaperRequestModal";
import { MicroscopeIcon, BookOpenIcon, AcademicCapIcon, FileTextIcon, ShieldCheckIcon, SearchIcon, AwardIcon } from "@/components/common/Icons";

const TABS = [
  { key: "projects", label: "Research Projects", icon: MicroscopeIcon },
  { key: "publications", label: "Publications & Working Papers", icon: BookOpenIcon },
  { key: "experts", label: "Faculty & Fellow Network", icon: AcademicCapIcon },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get<ResearchProject[]>("/research/projects").catch(() => []),
      apiClient.get<Publication[]>("/research/publications").catch(() => []),
      apiClient.get<Expert[]>("/research/experts").catch(() => []),
    ])
      .then(([proj, pub, exp]) => {
        setProjects(proj);
        setPublications(pub);
        setExperts(exp);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts: Record<TabKey, number> = {
    projects: projects.length,
    publications: publications.length,
    experts: experts.length,
  };

  const expertPhotos: Record<string, string> = {
    "Dr. Kwesi Mensah": "/images/testimonial-mensah.jpg",
    "Ama Serwaa": "/images/about-team.jpg",
    "Marcus Chen": "/images/services-advisory.jpg",
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        badge="Evidence & Rigor"
        title="Applied Research & Policy Center"
        subtitle="Generating empirical evidence, econometric diagnostics, and policy frameworks to inform workforce development and institutional strategy."
      />

      {/* Main Container */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-6xl space-y-10">

        {/* ── Featured Study Banner ── */}
        <div className="relative bg-brand-navyDeep text-white rounded-3xl overflow-hidden shadow-card border border-brand-navy">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/research-center.jpg"
              alt="GMAC Applied Research Center"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDeep via-brand-navyDeep/95 to-brand-navy/80" />
          </div>

          <div className="relative z-10 p-8 sm:p-10 lg:p-12 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-brand-cyan border border-white/20 uppercase tracking-wider">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-brand-cyan" />
              Flagship Empirical Study
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif leading-tight">
              The Future of Work & Graduate Labor Transitions
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Evaluating skill polarization, institutional agility, and emerging technology disruptions across sub-Saharan African higher education and regional labor markets.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const feat = publications[0] || {
                    id: "pub-graduate-transition-gap",
                    title: "The Future of Work & Graduate Labor Transitions in Sub-Saharan Africa",
                    authors: ["Dr. Kwesi Mensah", "Ama Serwaa"],
                  };
                  setSelectedPublication(feat);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-red hover:bg-brand-redDark shadow-elevate-red transition-all cursor-pointer"
              >
                Request Working Paper →
              </button>
              <button
                onClick={() => setActiveTab("publications")}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
              >
                Browse All Publications ↓
              </button>
            </div>
          </div>
        </div>

        {/* ── Prominent Interactive Navigation Bar ── */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-brand-navy text-white shadow-sm"
                      : "text-slate-600 hover:text-brand-navy hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {!loading && counts[tab.key] > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Filter Input */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
                <div className="w-24 h-5 skeleton-shimmer rounded-full mb-4" />
                <div className="w-4/5 h-6 skeleton-shimmer rounded mb-3" />
                <div className="w-full h-3 skeleton-shimmer rounded mb-2" />
                <div className="w-3/4 h-3 skeleton-shimmer rounded mb-6" />
                <div className="w-1/3 h-8 skeleton-shimmer rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ── Tab 1: Research Projects ── */}
        {!loading && activeTab === "projects" && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
              {projects
                .filter(
                  (p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.summary && p.summary.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((project) => (
                  <article
                    key={project.id}
                    className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-1.5 bg-brand-navy w-full" />
                    <div className="p-5 sm:p-7 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="badge bg-blue-50 text-brand-navy border-blue-200 uppercase font-bold text-[10px]">
                          {project.status || "Ongoing"}
                        </span>
                        {project.lead_researcher && (
                          <span className="text-xs text-slate-500 font-semibold truncate max-w-[200px]">
                            {project.lead_researcher}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 font-serif leading-snug mb-3 group-hover:text-brand-navy transition-colors">
                        {project.title}
                      </h3>

                      {project.summary && (
                        <p className="text-slate-600 text-sm leading-relaxed flex-1">
                          {project.summary}
                        </p>
                      )}

                      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/contact?subject=Collaboration Inquiry: ${encodeURIComponent(project.title)}`}
                          className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 group/link"
                        >
                          <span>Propose Collaboration</span>
                          <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">GMAC Center</span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>

            {projects.length === 0 && (
              <div className="empty-state">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-navy flex items-center justify-center mb-4 border border-blue-100">
                  <MicroscopeIcon className="w-6 h-6 text-brand-navy" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">Active Research In Progress</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">New study working papers are published periodically.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Publications & Working Papers ── */}
        {!loading && activeTab === "publications" && (
          <div className="space-y-4">
            {publications
              .filter(
                (pub) =>
                  pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  pub.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((pub) => (
                <div
                  key={pub.id}
                  className="group flex flex-col gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/30 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <FileTextIcon className="w-5 h-5 text-purple-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        Peer-Reviewed Working Paper
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1 group-hover:text-brand-navy transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Authors: <strong className="text-slate-700">{pub.authors.join(", ")}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPublication(pub)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs transition-all shrink-0 text-center cursor-pointer w-full sm:w-auto"
                  >
                    Request Full Paper
                  </button>
                </div>
              ))}

            {publications.length === 0 && (
              <div className="empty-state">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 border border-purple-100">
                  <FileTextIcon className="w-6 h-6 text-purple-700" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">Working Papers Under Review</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">New publications are currently in peer review.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Faculty & Fellow Network ── */}
        {!loading && activeTab === "experts" && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {experts
                .filter(
                  (exp) =>
                    exp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exp.expertise_areas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((expert) => {
                  const photoSrc = expertPhotos[expert.full_name] || "/images/testimonial-mensah.jpg";
                  return (
                    <div
                      key={expert.id}
                      className="group bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="h-1.5 bg-brand-red w-full" />
                      <div className="p-6 flex flex-col flex-1 items-center text-center">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-navy shadow-sm mb-4">
                          <Image
                            src={photoSrc}
                            alt={expert.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-brand-navy transition-colors">
                          {expert.full_name}
                        </h3>
                        <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider mt-1">
                          Research Fellow & Advisor
                        </span>
                        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex flex-wrap justify-center gap-1.5">
                          {expert.expertise_areas.map((area) => (
                            <span
                              key={area}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {experts.length === 0 && (
              <div className="empty-state">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-4 border border-red-100">
                  <AcademicCapIcon className="w-6 h-6 text-brand-red" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">Global Researcher Network</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">Join our fellowship of affiliated economists and policy scholars.</p>
                <Link href="/register" className="btn-primary mt-4 text-xs">
                  Apply as Fellow →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Research Collaboration Callout ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="section-label text-brand-red block">ACADEMIC & INSTITUTIONAL PARTNERSHIP</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              Co-Publish or Commission Applied Research
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
              We partner with university faculties, international think tanks, and foundations on empirical labor assessments and policy briefs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/contact?subject=Research Partnership Proposal" className="btn-primary text-xs sm:text-sm px-6 py-3">
              Submit Research Proposal →
            </Link>
          </div>
        </div>

      </section>

      {/* Paper Request Modal */}
      <PaperRequestModal
        publication={selectedPublication}
        isOpen={Boolean(selectedPublication)}
        onClose={() => setSelectedPublication(null)}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api/client";
import { Service } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchIcon, AcademicCapIcon, MicroscopeIcon, BriefcaseIcon } from "@/components/common/Icons";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<Service[]>("/services/")
      .then((data) => {
        setServices(data);
        setError(null);
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: "all", label: "All Services" },
    { key: "education", label: "Education & Employability" },
    { key: "research", label: "Research & Training" },
    { key: "consulting", label: "Consulting & Advisory" },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category?.toLowerCase() === activeCategory);

  const categoryImages: Record<string, string> = {
    education: "/images/services-lab.jpg",
    research: "/images/research-center.jpg",
    consulting: "/images/services-advisory.jpg",
  };

  const categoryIcons: Record<string, typeof AcademicCapIcon> = {
    education: AcademicCapIcon,
    research: MicroscopeIcon,
    consulting: BriefcaseIcon,
  };

  const categoryColors: Record<string, string> = {
    education: "bg-sky-50 text-sky-700 border-sky-200",
    research: "bg-purple-50 text-purple-700 border-purple-200",
    consulting: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const categoryAccents: Record<string, string> = {
    education: "bg-sky-500",
    research: "bg-purple-500",
    consulting: "bg-emerald-500",
    default: "bg-brand-navy",
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Strategic Capabilities"
        title="Our Strategic Services"
        subtitle="Delivering human capital excellence, empirical research capacity, and high-level institutional advisory."
      />

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">

        {/* Category Filters — pill-style tab bar */}
        <div className="mb-8 sm:mb-10 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`whitespace-nowrap px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === c.key
                    ? "bg-brand-navy text-white border-brand-navy shadow-elevate"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy/40 hover:text-brand-navy"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm max-w-lg mx-auto mb-8 text-center shadow-sm"
          >
            <p className="font-bold text-base mb-1">Unable to load services</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden"
              >
                <div className="h-40 sm:h-44 skeleton-shimmer" />
                <div className="p-5 sm:p-7">
                  <div className="w-24 h-5 skeleton-shimmer rounded-full mb-3" />
                  <div className="w-3/5 h-6 skeleton-shimmer rounded mb-3" />
                  <div className="w-full h-3 skeleton-shimmer rounded mb-2" />
                  <div className="w-4/5 h-3 skeleton-shimmer rounded mb-6" />
                  <div className="w-1/3 h-8 skeleton-shimmer rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!loading && filteredServices.length > 0 && (
          <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => {
              const catKey = service.category?.toLowerCase() || "";
              const accent = categoryAccents[catKey] || categoryAccents.default;
              const badgeCls = categoryColors[catKey] || "bg-slate-100 text-slate-700 border-slate-200";
              const imageSrc = categoryImages[catKey] || "/images/services-advisory.jpg";
              const IconComp = categoryIcons[catKey] || BriefcaseIcon;

              return (
                <article
                  key={service.id}
                  id={service.slug}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Service Photo Header */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${badgeCls} uppercase shadow-sm`}>
                        {service.category || "Service"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
                      <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <IconComp className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold tracking-wide uppercase text-slate-200">GMAC Strategic Practice</span>
                    </div>
                  </div>

                  {/* top accent */}
                  <div className={`h-1 ${accent} w-full`} />

                  <div className="flex flex-col flex-1 p-5 sm:p-7">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-brand-navy transition-colors font-serif leading-snug mb-3">
                      {service.title}
                    </h2>

                    <p className="text-slate-600 font-medium text-sm leading-relaxed flex-1">
                      {service.summary}
                    </p>

                    {service.description && (
                      <p className="mt-3 text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/contact?subject=Service Inquiry: ${encodeURIComponent(service.title)}`}
                        className="btn-primary inline-flex w-fit max-w-full px-3 py-2 text-[11px] leading-tight text-center sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
                      >
                        Request Advisory →
                      </Link>
                      <Link
                        href="/contact"
                        className="text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors text-center sm:text-left"
                      >
                        Enquire Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && !error && (
          <div className="empty-state mt-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-navy flex items-center justify-center mb-5 border border-blue-100">
              <SearchIcon className="w-6 h-6 text-brand-navy" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">No Services Found</h3>
            <p className="text-sm text-slate-500 mt-2">
              No services found in this category at the moment.
            </p>
            <Link href="/contact" className="btn-primary mt-5 px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm">
              Request Custom Advisory
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

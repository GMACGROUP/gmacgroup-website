"use client";

import Link from "next/link";
import Image from "next/image";
import { Programme } from "@/types";
import { AcademicCapIcon, BriefcaseIcon, WrenchIcon, BuildingIcon, BookOpenIcon } from "@/components/common/Icons";

interface ProgrammeCardProps {
  programme?: Programme;
  title?: string;
  category?: string;
  description?: string;
  startDate?: string | null;
  onEnrol?: (programme: Programme) => void;
}

export function ProgrammeCard({
  programme,
  title,
  category,
  description,
  startDate,
  onEnrol,
}: ProgrammeCardProps) {
  const displayTitle = programme?.title || title || "Untitled Programme";
  const displayCategory = programme?.category || category || "training";
  const displayDescription = programme?.description || description || "";
  const displayDate = programme?.start_date || startDate;
  const isClosed = Boolean(programme?.end_date && new Date(programme.end_date).getTime() < Date.now());

  const categoryConfig: Record<string, { label: string; badge: string; accent: string; icon: typeof AcademicCapIcon; image: string }> = {
    student: {
      label: "Student Pathway",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      accent: "bg-sky-500",
      icon: AcademicCapIcon,
      image: "/images/service-employability.jpg",
    },
    professional_development: {
      label: "Professional Dev",
      badge: "bg-blue-50 text-brand-navy border-blue-200",
      accent: "bg-brand-navy",
      icon: BriefcaseIcon,
      image: "/images/service-workforce-consulting.jpg",
    },
    training: {
      label: "Specialized Training",
      badge: "bg-red-50 text-brand-red border-red-200",
      accent: "bg-brand-red",
      icon: WrenchIcon,
      image: "/images/service-capacity-building.jpg",
    },
    institutional: {
      label: "Institutional Capacity",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "bg-emerald-500",
      icon: BuildingIcon,
      image: "/images/service-policy-research.jpg",
    },
  };

  const cfg = categoryConfig[displayCategory] || {
    label: displayCategory.replace("_", " "),
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    accent: "bg-slate-400",
    icon: BookOpenIcon,
    image: "/images/service-signature-events.jpg",
  };

  const IconComp = cfg.icon;

  const handleEnrolClick = () => {
    if (onEnrol && programme) {
      onEnrol(programme);
    } else if (onEnrol) {
      onEnrol({
        id: "custom",
        title: displayTitle,
        category: displayCategory as any,
        description: displayDescription,
        start_date: displayDate || undefined,
      });
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Thumbnail Banner */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <Image
          src={cfg.image}
          alt={displayTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge ${cfg.badge} uppercase shadow-sm`}>
            {cfg.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <IconComp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Cohort Track</span>
          </div>
          {displayDate && (
            <span className="text-xs font-bold bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/20">
              {new Date(displayDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {isClosed && (
            <span className="text-xs font-bold bg-slate-900/80 text-white px-2.5 py-1 rounded-md border border-white/20">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Top accent bar */}
      <div className={`h-1 w-full ${cfg.accent}`} />

      <div className="flex flex-col flex-1 p-6">
        <h3 className="mb-2 text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-brand-navy sm:text-lg">
          {displayTitle}
        </h3>

        {displayDescription && (
          <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {displayDescription}
          </p>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/contact?subject=Inquiry: ${encodeURIComponent(displayTitle)}`}
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors gap-1 group/link"
          >
            <span>Learn More</span>
            <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
          <button
            type="button"
            onClick={handleEnrolClick}
            disabled={isClosed}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-navy text-white hover:bg-brand-navyDark shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            {isClosed ? "Closed" : "Enrol Now →"}
          </button>
        </div>
      </div>
    </div>
  );
}

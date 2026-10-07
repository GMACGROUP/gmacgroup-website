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
      label: "Student pathway",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      accent: "bg-sky-500",
      icon: AcademicCapIcon,
      image: "/images/service-employability.jpg",
    },
    professional_development: {
      label: "Professional development",
      badge: "bg-blue-50 text-brand-navy border-blue-200",
      accent: "bg-brand-navy",
      icon: BriefcaseIcon,
      image: "/images/service-workforce-consulting.jpg",
    },
    training: {
      label: "Specialised training",
      badge: "bg-red-50 text-brand-red border-red-200",
      accent: "bg-brand-red",
      icon: WrenchIcon,
      image: "/images/service-capacity-building.jpg",
    },
    institutional: {
      label: "Institutional capacity",
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
    <article className="group flex flex-col border-t-2 border-ink bg-white">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
        <Image
          src={cfg.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
          <span className="text-accent">{cfg.label}</span>
          {isClosed ? (
            <span className="text-ink-400">Closed</span>
          ) : displayDate ? (
            <span className="text-ink-500">
              Starts {new Date(displayDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{displayTitle}</h3>

        {displayDescription && (
          <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-ink-500">{displayDescription}</p>
        )}

        <div className="mt-7 flex items-center gap-6">
          <button
            type="button"
            onClick={handleEnrolClick}
            disabled={isClosed}
            className="btn-dark !px-5 !py-2.5 disabled:cursor-not-allowed disabled:bg-ink-300"
          >
            {isClosed ? "Closed" : "Enrol"}
          </button>
          <Link
            href={`/contact?subject=Inquiry: ${encodeURIComponent(displayTitle)}`}
            className="text-sm font-semibold text-ink hover:text-accent"
          >
            Learn more
          </Link>
        </div>
      </div>
    </article>
  );
}

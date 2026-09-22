import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-[#D7B56D]/20 bg-[#061C30] py-10 text-white sm:py-12 lg:py-14 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(90deg,#D7B56D_0%,#D7B56D_20%,#E56F42_20%,#E56F42_40%,#F4C95D_40%,#F4C95D_60%,#2C6EAD_60%,#2C6EAD_80%,#D7B56D_80%,#D7B56D_100%)]" />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[#D7B56D] blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-[#2C6EAD] blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {badge && (
          <span className="page-header-badge">
            {badge}
          </span>
        )}
        <h1 className="font-serif text-2xl font-extrabold leading-snug tracking-tight text-[#F3E7C9] drop-shadow-sm sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-2.5 max-w-2xl text-xs font-normal leading-relaxed text-slate-200 sm:text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

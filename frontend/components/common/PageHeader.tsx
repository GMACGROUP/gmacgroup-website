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
      className={`relative bg-gradient-to-r from-brand-navyDeep via-brand-navy to-brand-navyDeep text-white py-10 sm:py-12 lg:py-14 border-b border-brand-navyLight/20 overflow-hidden ${className}`}
    >
      {/* Subtle Ambient Background Accent Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-brand-cyan blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-brand-red blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center max-w-4xl">
        {badge && (
          <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest text-brand-cyan uppercase px-3.5 py-1 rounded-full bg-white/10 mb-3 border border-white/20 shadow-sm">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight leading-snug drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2.5 text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

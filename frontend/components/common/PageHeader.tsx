import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, className = "" }: PageHeaderProps) {
  return (
    <section className={`bg-ink text-white ${className}`}>
      <div className="wrap py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {badge && <p className="page-header-badge">{badge}</p>}
          <h1 className="text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

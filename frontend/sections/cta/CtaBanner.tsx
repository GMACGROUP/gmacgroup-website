import Link from "next/link";
import { SparklesIcon } from "@/components/common/Icons";

export function CtaBanner() {
  return (
    <section className="relative bg-gradient-to-r from-brand-navyDeep via-brand-navy to-brand-navyDeep text-white py-16 sm:py-20 overflow-hidden border-t border-brand-navyLight/20">
      {/* Dynamic Ambient Blur Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
          <SparklesIcon className="w-3.5 h-3.5" />
          Partner With GMAC GROUP
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight">
          Ready to Build Sustainable Human Capital?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
          Whether you are an institution designing high-impact graduate transitions, a researcher pursuing empirical studies, or an employer seeking top talent, let&apos;s collaborate.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-brand-red hover:bg-brand-redDark shadow-elevate-red hover:scale-105 active:scale-95 transition-all"
          >
            Contact Advisory Team →
          </Link>
          <Link
            href="/programmes"
            className="px-7 py-3 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            Explore Cohort Programmes
          </Link>
        </div>
      </div>
    </section>
  );
}

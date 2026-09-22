"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Inline icon components for the hero pillars
type HeroIconProps = { className?: string; style?: React.CSSProperties };

function ResearchIcon({ className, style }: HeroIconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 8v6M8 11h6" />
    </svg>
  );
}

function CapitalIcon({ className, style }: HeroIconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 5-9 5-9-5 9-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9 5 9-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l9 5 9-5" />
    </svg>
  );
}

function ConsultingIcon({ className, style }: HeroIconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function InvestmentIcon({ className, style }: HeroIconProps) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 4" />
      <circle cx="20" cy="11" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const pillars = [
  {
    Icon: ResearchIcon,
    label: "Research",
    title: "Applied Research & Evidence",
    body: "Baseline studies, impact evaluations, and labour market intelligence produced inside the markets they describe.",
    href: "/research",
    accent: "#00C4FF",
    accentBg: "rgba(0,196,255,0.12)",
  },
  {
    Icon: CapitalIcon,
    label: "Human Capital",
    title: "Graduate & Workforce Development",
    body: "Structured pathways from application to offer — employability programmes, career readiness labs, and cohort delivery.",
    href: "/programmes",
    accent: "#D7B56D",
    accentBg: "rgba(215,181,109,0.12)",
  },
  {
    Icon: ConsultingIcon,
    label: "Consulting",
    title: "Institutional & Policy Advisory",
    body: "Strategic workforce consulting for institutions, governments, and development agencies across Africa.",
    href: "/services",
    accent: "#E51924",
    accentBg: "rgba(229,25,36,0.12)",
  },
  {
    Icon: InvestmentIcon,
    label: "Investment",
    title: "Investment Facilitation",
    body: "Screened deal flow, sector studies, and investment-ready project pipelines across ten focus markets.",
    href: "/services",
    accent: "#4ADE80",
    accentBg: "rgba(74,222,128,0.12)",
  },
];

const stats = [
  { value: "2,000+", label: "Participants Trained" },
  { value: "30+", label: "Countries Reached" },
  { value: "10", label: "Research Hubs" },
  { value: "22", label: "Specialist Colleagues" },
];

export function Hero() {
  const [activeCard, setActiveCard] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRotation = () => {
    intervalRef.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % pillars.length);
    }, 3800);
  };

  useEffect(() => {
    startRotation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (idx: number) => {
    setActiveCard(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startRotation();
  };

  return (
    <section className="relative overflow-hidden bg-[#061C30] min-h-[760px] sm:min-h-[700px] lg:min-h-[680px]">
      {/* Colour bar */}
      <div className="absolute inset-x-0 top-0 z-20 h-1 bg-[linear-gradient(90deg,#D7B56D_0%,#E56F42_25%,#F4C95D_50%,#2C6EAD_75%,#D7B56D_100%)]" />

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="GMAC GROUP — Connecting talent to opportunity"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Heavy overlay so text is very readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061C30]/90 via-[#061C30]/70 to-[#061C30]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#061C30]/80" />
      </div>

      {/* Main grid */}
      <div className="container relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-14 lg:px-10 lg:pt-20 lg:pb-16">
        <div className="grid items-center gap-9 sm:gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── LEFT: headline + stats + CTAs ── */}
          <div className="flex flex-col items-start">
            {/* Eyebrow pill */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8D8E4] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D7B56D] animate-pulse flex-shrink-0" />
              Accra, Ghana · Pan-African Reach
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Building People.{" "}
              <span className="text-[#D7B56D]">Building Evidence.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#B0C4D4] sm:mt-5 sm:text-lg">
              GMAC Group connects talent to opportunity through applied research, graduate employability programmes,
              institutional advisory, and investment facilitation across Africa.
            </p>

            {/* Divider */}
            <div className="mt-6 h-px w-20 bg-[#D7B56D]/70" />

            {/* Stats row */}
            <div className="mt-6 grid w-full grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <span className="text-2xl font-extrabold font-sans leading-none tracking-tight text-white sm:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 text-[11px] text-[#8AADC0] font-medium leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D7B56D] px-6 py-3 text-sm font-bold text-[#061C30] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E7C77D] hover:shadow-xl active:scale-95 sm:w-auto"
              >
                Start a conversation
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/programmes"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-95 sm:w-auto"
              >
                View programmes
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-[#B0C4D4] transition-all duration-200 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Open opportunities →
              </Link>
            </div>
          </div>

          {/* ── RIGHT: service pillar cards ── */}
          <div className="flex flex-col gap-3">
            {/* Active pillar card */}
            {pillars.map((p, i) => {
              const { Icon } = p;
              return (
                <div
                  key={p.label}
                    className={`rounded-2xl border border-white/12 p-5 sm:p-7 transition-all duration-500 ${
                    activeCard === i
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 absolute pointer-events-none"
                  }`}
                  style={{
                    background: activeCard === i
                      ? "rgba(255,255,255,0.07)"
                      : "transparent",
                    backdropFilter: "blur(12px)",
                    position: activeCard === i ? "relative" : "absolute",
                  }}
                  aria-hidden={activeCard !== i}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: p.accentBg, border: `1px solid ${p.accent}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: p.accent } as React.CSSProperties} />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest mb-1"
                        style={{ color: p.accent }}
                      >
                        {p.label}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-serif text-white leading-snug">
                        {p.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#9DB8CC]">
                    {p.body}
                  </p>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

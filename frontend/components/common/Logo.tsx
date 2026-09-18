import React from "react";
import Link from "next/link";

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "light" | "dark";
  href?: string;
}

export function Logo({
  showTagline = true,
  size = "md",
  className = "",
  variant = "light",
  href = "/",
}: LogoProps) {
  // Scaling factors
  const dimensions = {
    sm: { globe: 32, gmac: "text-lg", group: "text-lg", tagline: "text-[9px]" },
    md: { globe: 44, gmac: "text-2xl", group: "text-2xl", tagline: "text-[11px]" },
    lg: { globe: 60, gmac: "text-3xl", group: "text-3xl", tagline: "text-xs" },
    xl: { globe: 80, gmac: "text-5xl", group: "text-5xl", tagline: "text-sm" },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Globe Icon */}
      <svg
        width={dimensions.globe}
        height={dimensions.globe}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="globeGrad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#00C4FF" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0E4D82" />
          </linearGradient>
          <radialGradient id="globeGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E4D82" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Orbit Arc */}
        <path
          d="M 18,72 A 42,42 0 1,1 86,52"
          stroke="#0284C7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="2 1"
        />

        {/* Base Globe Sphere */}
        <circle cx="48" cy="52" r="38" fill="url(#globeGrad)" />
        <circle cx="48" cy="52" r="38" fill="url(#globeGlow)" />

        {/* Stylized Continents (White) */}
        {/* North America */}
        <path
          d="M 32,24 C 36,22 42,26 48,27 C 54,28 62,32 64,36 C 60,40 55,42 50,45 C 46,47 42,44 38,40 C 34,36 30,30 32,24 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        {/* Central America connection */}
        <path
          d="M 43,45 C 45,48 46,53 43,56 C 41,54 41,50 43,45 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        {/* South America */}
        <path
          d="M 43,56 C 48,58 54,64 52,70 C 50,76 45,82 41,84 C 39,81 37,74 38,68 C 39,62 41,58 43,56 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        {/* Global Lat/Long Grid overlay */}
        <circle cx="48" cy="52" r="38" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
        <ellipse cx="48" cy="52" rx="38" ry="16" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
        <ellipse cx="48" cy="52" rx="18" ry="38" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline tracking-tight font-extrabold font-serif">
          <span className={`${dimensions.gmac} text-[#E51924] font-black tracking-normal mr-1.5 drop-shadow-sm`}>
            GMAC
          </span>
          <span className={`${dimensions.group} ${variant === "dark" ? "text-white" : "text-[#0E4D82]"} font-bold tracking-tight`}>
            GROUP
          </span>
        </div>
        {showTagline && (
          <span
            className={`${dimensions.tagline} italic font-serif mt-0.5 tracking-wide ${
              variant === "dark" ? "text-slate-300" : "text-[#0E4D82]"
            }`}
          >
            Connecting talent to opportunity
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

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
  // logo-tight.png for light backgrounds (navbar), logo-transparent.png for dark (footer/login)
  const isDark = variant === "dark";
  const logoSrc = isDark ? "/images/logo-transparent.png" : "/images/logo-tight.png";

  // Size classes — logo aspect ratio is roughly 4:3
  const sizeClass = {
    sm: "h-9 sm:h-10 w-auto",
    md: "h-11 sm:h-12 w-auto",
    lg: "h-14 sm:h-16 w-auto",
    xl: "h-20 sm:h-24 w-auto",
  }[size];

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="GMAC GROUP — Connecting talent to opportunity"
        className={`${sizeClass} object-contain transition-transform duration-200 hover:scale-[1.03]`}
        loading="eager"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}

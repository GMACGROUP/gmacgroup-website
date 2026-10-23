"use client";

import { useState } from "react";
import Image from "next/image";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  name: string;
  src?: string | null;
  className?: string;
  sizes?: string;
  defaultColor?: boolean;
  interactive?: boolean;
  showBadge?: boolean;
};

/**
 * Team portrait: black and white until hovered, clicked or touched;
 * toggles smoothly to full color on tap/click with tactile feedback.
 */
export function Portrait({
  name,
  src,
  className = "",
  sizes = "200px",
  defaultColor = false,
  interactive = true,
  showBadge = false,
}: Props) {
  const [isColor, setIsColor] = useState(defaultColor);

  const handleToggle = () => {
    if (!interactive) return;
    setIsColor((prev) => !prev);
  };

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={`group relative select-none overflow-hidden bg-stone transition-all ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
      aria-label={`${name} portrait - ${interactive ? "tap or click to toggle color" : ""}`}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={`Portrait of ${name}`}
            fill
            sizes={sizes}
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 ${
              isColor ? "grayscale-0 scale-[1.02]" : "grayscale"
            }`}
          />

          {/* Interactive touch indicator badge */}
          {showBadge && (
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-md transition-all group-hover:bg-accent">
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isColor ? "bg-accent-soft" : "bg-white/60"}`} />
              <span>{isColor ? "Color" : "Touch for color"}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
          <span className="font-display text-[2.5rem] font-light text-ink-400">{initials(name)}</span>
        </div>
      )}
    </div>
  );
}

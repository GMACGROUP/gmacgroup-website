import Image from "next/image";

type Props = {
  src?: string | null;
  alt: string;
  /** Shown while no photograph has been supplied */
  awaiting: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
};

/**
 * A photograph with a consistent tonal treatment. When no photograph has been
 * supplied yet, a designed typographic panel stands in, so the layout never
 * relies on stock or generated imagery.
 */
export function PhotoSlot({ src, alt, awaiting, className = "", sizes = "100vw", priority, tone = "light" }: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover [filter:saturate(0.85)_contrast(1.03)]" />
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <div
      className={`relative flex items-end overflow-hidden ${dark ? "bg-ink-700 text-white/60" : "bg-sand text-ink-400"} ${className}`}
      role="img"
      aria-label={alt}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch)" />
      </svg>
      <p className="relative m-5 text-[12px] font-medium uppercase tracking-label">Photograph: {awaiting}</p>
    </div>
  );
}

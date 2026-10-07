import Image from "next/image";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = { name: string; src?: string | null; className?: string; sizes?: string };

/** Team portrait with a consistent treatment; monogram when no photo is on file. */
export function Portrait({ name, src, className = "", sizes = "200px" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-sky ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={`Portrait of ${name}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
          <span className="font-display text-[2.5rem] font-light text-ink-400">{initials(name)}</span>
        </div>
      )}
    </div>
  );
}

import { AFRICA, MAP_HEIGHT, MAP_WIDTH } from "@/lib/content/africa-map";

type Props = {
  className?: string;
  /** "light" for paper backgrounds, "dark" for ink backgrounds */
  tone?: "light" | "dark";
  /** Number the ten focus markets and list them in a legend */
  numbered?: boolean;
  /** Mark the countries the team works from */
  showTeam?: boolean;
  title?: string;
};

const FOCUS_ORDER = ["Ghana", "Nigeria", "Côte d’Ivoire", "Togo", "Cameroon", "Rwanda", "Tanzania", "Malawi", "Zambia", "Botswana"];

export function AfricaMap({ className = "", tone = "light", numbered = true, showTeam = true, title }: Props) {
  const dark = tone === "dark";
  const land = dark ? "#1E2D42" : "#E2DDD3";
  const border = dark ? "#3D526E" : "#9B9284";
  const outerOutline = dark ? "#5A7291" : "#5F6C7D";
  const focusFill = dark ? "#0B5CAD" : "#C8DCF0";
  const focusStroke = dark ? "#9CC0E6" : "#0B5CAD";
  const labelInk = dark ? "#FFFFFF" : "#0E1A2B";

  const focus = FOCUS_ORDER.map((n) => AFRICA.find((c) => c.name === n)).filter(Boolean) as typeof AFRICA;
  const team = AFRICA.filter((c) => c.team);

  // Nudges for markers that would otherwise collide in dense West Africa
  const nudge: Record<string, [number, number]> = {
    Ghana: [-4, 6],
    Togo: [6, -10],
    "Côte d’Ivoire": [-14, 0],
    Nigeria: [4, 4],
    Rwanda: [-10, -4],
    Malawi: [10, 0],
  };

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-labelledby="africa-map-title"
        className="h-auto w-full drop-shadow-sm"
      >
        <title id="africa-map-title">
          {title ?? `Map of Africa marking Gmac Group's ten focus markets: ${FOCUS_ORDER.join(", ")}.`}
        </title>

        <defs>
          <filter id="africa-map-shadow" x="-5%" y="-5%" width="112%" height="112%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={dark ? "#000000" : "#0E1A2B"} floodOpacity={dark ? "0.45" : "0.1"} />
          </filter>
        </defs>

        {/* 1. Outer continent coastline outline layer - creates crisp perimeter definition */}
        <g aria-hidden="true" filter="url(#africa-map-shadow)">
          {AFRICA.map((c) => (
            <path
              key={`outer-${c.name}`}
              d={c.d}
              fill={dark ? "#162233" : "#D4CEC3"}
              stroke={outerOutline}
              strokeWidth={2.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 2. Country polygons & distinct internal borders */}
        <g>
          {AFRICA.map((c) => (
            <path
              key={c.name}
              d={c.d}
              fill={c.focus ? focusFill : land}
              stroke={c.focus ? focusStroke : border}
              strokeWidth={c.focus ? 1.6 : 0.85}
              strokeLinejoin="round"
              className="transition-colors duration-150"
            />
          ))}
        </g>

        {showTeam && (
          <g>
            {team.map((c) => {
              const [dx, dy] = nudge[c.name] ?? [0, 0];
              return (
                <circle
                  key={c.name}
                  cx={c.cx + dx + 9}
                  cy={c.cy + dy + 9}
                  r={3.2}
                  fill="#B4532A"
                  stroke={dark ? "#0E1A2B" : "#FFFFFF"}
                  strokeWidth={1.5}
                />
              );
            })}
          </g>
        )}

        {numbered && (
          <g fontFamily="var(--font-sans), 'Libre Franklin', sans-serif" fontSize="9.5" fontWeight={700}>
            {focus.map((c, i) => {
              const [dx, dy] = nudge[c.name] ?? [0, 0];
              const x = c.cx + dx;
              const y = c.cy + dy;
              return (
                <g key={c.name}>
                  <circle cx={x} cy={y} r={8} fill={dark ? "#0E1A2B" : "#FBFAF7"} stroke={focusStroke} strokeWidth={1.4} />
                  <text x={x} y={y + 3.2} textAnchor="middle" fill={labelInk}>
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {numbered && (
        <figcaption className={`mt-6 text-[13px] ${dark ? "text-white/70" : "text-ink-500"}`}>
          <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-5">
            {FOCUS_ORDER.map((n, i) => (
              <li key={n} className="flex items-baseline gap-2">
                <span className={`tabular-nums ${dark ? "text-accent-soft" : "text-accent"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={dark ? "text-white" : "text-ink"}>{n}</span>
              </li>
            ))}
          </ol>
          {showTeam && (
            <p className="mt-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
              Countries our team works from (the tenth is the United States)
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

import { useId } from "react";
import { cn } from "../lib/utils";

/**
 * CareerPilot brand mark.
 *
 * The artwork is drawn here rather than loaded as a bitmap so it stays crisp at
 * every size, needs no background knockout against the dark UI, and can be
 * recoloured by the theme. Geometry mirrors the supplied logo: a cyan→blue "C"
 * interlocking with a blue→violet "P", a silver paper plane in the counter, and
 * a blue arrow sweeping down-left out of the plane.
 */
export function BrandMark({
  className,
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  // Rendered more than once per page (sidebar, drawer, boot screen), so the
  // gradient defs need per-instance ids.
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="CareerPilot"
      fill="none"
    >
      <defs>
        <linearGradient id={`${uid}-c`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#7fd4ff" />
          <stop offset="50%" stopColor="#2f7dff" />
          <stop offset="100%" stopColor="#1b46d6" />
        </linearGradient>
        <linearGradient id={`${uid}-p`} x1="0.1" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b6bff" />
          <stop offset="55%" stopColor="#6b4bff" />
          <stop offset="100%" stopColor="#9d3bff" />
        </linearGradient>
        <linearGradient id={`${uid}-arrow`} x1="0.1" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fe6ff" />
          <stop offset="55%" stopColor="#3b9dff" />
          <stop offset="100%" stopColor="#2358f0" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <circle cx="31.5" cy="32" r="32" fill={`url(#${uid}-glow)`} />}

      <g transform="translate(3 0)">
        {/* "P" — stem plus bowl, drawn first so the "C" interlocks over it. */}
        <path
          d="M 34.9 53.5 V 20.2 A 14 14 0 0 1 34.9 48.2"
          stroke={`url(#${uid}-p)`}
          strokeWidth="9.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* "C" — a thick ring left open across 115° on the right. */}
        <path
          d="M 31.3 44.4 A 17.5 17.5 0 1 1 38.9 15.8"
          stroke={`url(#${uid}-c)`}
          strokeWidth="9.2"
          strokeLinecap="round"
        />

        {/* Motion trail sweeping down-left out of the plane. */}
        <path d="M 31 37 L 8.5 59 L 22 45 Z" fill={`url(#${uid}-arrow)`} />

        {/* Paper plane: lit upper wing and shaded underside, split by the crease. */}
        <path
          d="M 23.5 33 L 45 27 L 28.5 36.5 Z"
          fill="#eef2fa"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path
          d="M 28.5 36.5 L 45 27 L 32 40.5 Z"
          fill="#a3b6d3"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const TAGLINE_WORDS = ["Plan", "Prepare", "Perform", "Succeed"];

/** "PLAN • PREPARE • PERFORM • SUCCEED" — dots carry the brand gradient. */
export function Tagline({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-nowrap items-center gap-[0.42em] whitespace-nowrap text-[8.5px] font-semibold uppercase leading-none tracking-[0.1em] text-zinc-500",
        className
      )}
    >
      {TAGLINE_WORDS.map((word, index) => (
        <span key={word} className="flex items-center gap-[0.42em]">
          {index > 0 && (
            <span className="size-[0.36em] shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-violet-500" />
          )}
          {word}
        </span>
      ))}
    </p>
  );
}

/**
 * Mark + wordmark, optionally with the tagline underneath. Used in the app
 * sidebar, the mobile drawer, and the auth panel.
 */
export function Logo({
  className,
  markClassName,
  wordClassName,
  withTagline = false,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  withTagline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className={cn("size-10 shrink-0", markClassName)} />
      <div className="leading-tight">
        <p
          className={cn(
            "font-display text-[16px] font-bold tracking-tight text-white",
            wordClassName
          )}
        >
          Career
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            Pilot
          </span>
        </p>
        {withTagline && <Tagline className="mt-1" />}
      </div>
    </div>
  );
}

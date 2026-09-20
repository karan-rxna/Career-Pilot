import { motion } from "framer-motion";
import { EASE } from "./motion";

export function Ring({
  progress,
  size = 64,
  stroke = 6,
  children,
  track = "rgba(255,255,255,0.08)",
  from = "#8a63ff",
  to = "#45e6fb",
}: {
  progress: number; // 0..100
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  track?: string;
  from?: string;
  to?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const id = `ring-${from.replace(/[^a-zA-Z0-9]/g, "")}-${to.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (clamped / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

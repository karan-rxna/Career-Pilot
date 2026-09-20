import { Search } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

/* ------------------------------ Glass card ------------------------------ */
export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("glass rounded-2xl", hover && "glass-hover", className)}>{children}</div>
  );
}

/* -------------------------------- Badge --------------------------------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "green" | "amber" | "red" | "cyan";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/6 text-zinc-300 border-white/10",
    brand: "bg-brand-500/12 text-brand-300 border-brand-500/25",
    green: "bg-emerald-500/12 text-emerald-300 border-emerald-500/25",
    amber: "bg-amber-500/12 text-amber-300 border-amber-500/25",
    red: "bg-rose-500/12 text-rose-300 border-rose-500/25",
    cyan: "bg-accent-500/10 text-accent-300 border-accent-500/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Button -------------------------------- */
export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary:
      "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_10px_28px_-12px_rgba(138,99,255,0.8)] hover:shadow-[0_14px_36px_-10px_rgba(138,99,255,0.9)] hover:brightness-110 px-4 py-2.5",
    ghost: "px-3 py-2 text-zinc-300 hover:bg-white/6 hover:text-white",
    outline:
      "px-4 py-2.5 text-zinc-200 border border-white/12 hover:border-white/25 hover:bg-white/5 rounded-xl",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------- Progress ------------------------------- */
export function Progress({
  value,
  className,
  gradient = "from-brand-500 via-brand-400 to-accent-400",
  size = "md",
}: {
  value: number;
  className?: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
}) {
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2.5" };
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-white/8", heights[size], className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-700", gradient)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

/* ----------------------------- Search input ----------------------------- */
export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/50 focus:bg-white/6 focus:outline-none"
      />
    </div>
  );
}

/* ----------------------------- Filter chips ----------------------------- */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 active:scale-95",
              active
                ? "border-brand-500/50 bg-brand-500/15 text-brand-200 shadow-[0_0_20px_-6px_rgba(138,99,255,0.6)]"
                : "border-white/10 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ Page header ----------------------------- */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
          {title}
        </h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-zinc-400">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

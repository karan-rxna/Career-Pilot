import { cn } from "../lib/utils";
import { GithubIcon } from "./brands";
import type { Platform } from "../data/mock";

export interface PlatformMeta {
  label: string;
  color: string; // hex for accents
  chip: string; // tailwind bg tone
  text: string; // short code
  glyph: "lucide" | "text";
}

export const platformMeta: Record<Platform, PlatformMeta> = {
  github: { label: "GitHub", color: "#c9d1d9", chip: "bg-white/8", text: "GH", glyph: "lucide" },
  leetcode: { label: "LeetCode", color: "#ffb020", chip: "bg-amber-500/12", text: "LC", glyph: "text" },
  codeforces: { label: "Codeforces", color: "#6aa7ff", chip: "bg-sky-500/12", text: "CF", glyph: "text" },
  codechef: { label: "CodeChef", color: "#e8c15c", chip: "bg-yellow-500/10", text: "CC", glyph: "text" },
  atcoder: { label: "AtCoder", color: "#45e6fb", chip: "bg-accent-500/10", text: "AC", glyph: "text" },
};

export function PlatformBadge({
  platform,
  size = "md",
  className,
}: {
  platform: Platform;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = platformMeta[platform];
  const dims = size === "sm" ? "size-5 rounded-md text-[8px]" : "size-6 rounded-lg text-[9px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold",
        meta.chip,
        dims,
        className
      )}
      style={platform === "github" ? undefined : { color: meta.color }}
      title={meta.label}
    >
      {platform === "github" ? (
        <GithubIcon className={size === "sm" ? "size-3" : "size-3.5"} />
      ) : (
        meta.text
      )}
    </span>
  );
}

export function platformName(p: string): Platform {
  const map: Record<string, Platform> = {
    github: "github",
    leetcode: "leetcode",
    codeforces: "codeforces",
    codechef: "codechef",
    atcoder: "atcoder",
  };
  return map[p.toLowerCase()] ?? "github";
}

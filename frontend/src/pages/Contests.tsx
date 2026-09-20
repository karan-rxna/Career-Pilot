import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Bookmark, CalendarDays, Clock3, ExternalLink, Trophy, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { PlatformBadge } from "../components/platform";
import { Badge, Button, FilterChips, GlassCard, PageHeader, SearchInput } from "../components/ui";
import { Item, Reveal, Stagger } from "../components/motion";
import { contests, type ContestPlatform } from "../data/mock";
import { cn } from "../lib/utils";
import { useBookmarks } from "../store/useBookmarks";

const difficultyTone = {
  "Warm-up": "green",
  Easy: "green",
  Medium: "amber",
  Hard: "red",
} as const;

const platformDot: Record<ContestPlatform, string> = {
  LeetCode: "#ffb020",
  Codeforces: "#6aa7ff",
  CodeChef: "#e8c15c",
  AtCoder: "#45e6fb",
};

function dateBlock(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    mon: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
}

export default function Contests() {
  const [filter, setFilter] = useState<"all" | ContestPlatform>("all");
  const [query, setQuery] = useState("");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const { isSaved, toggle } = useBookmarks();

  const list = useMemo(
    () =>
      contests
        .filter((c) => (filter === "all" ? true : c.platform === filter))
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .filter((c) => (bookmarkedOnly ? isSaved(c.id) : true))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [filter, query, bookmarkedOnly, isSaved]
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Coding Contest Hub"
          title="Contests, in one timeline"
          description="Live schedule across LeetCode, Codeforces, CodeChef & AtCoder — bookmark what you'll fight for."
          actions={
            <Button variant="outline" className="hidden sm:flex">
              <BellRing className="size-4" /> Remind me before each
            </Button>
          }
        />
      </Reveal>

      <Stagger className="flex flex-wrap items-center gap-3">
        <Item>
          <FilterChips
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All platforms" },
              { value: "LeetCode", label: "LeetCode" },
              { value: "Codeforces", label: "Codeforces" },
              { value: "CodeChef", label: "CodeChef" },
              { value: "AtCoder", label: "AtCoder" },
            ]}
          />
        </Item>
        <Item className="ml-auto">
          <button
            onClick={() => setBookmarkedOnly((v) => !v)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all active:scale-95",
              bookmarkedOnly
                ? "border-amber-500/50 bg-amber-500/12 text-amber-200"
                : "border-white/10 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            )}
          >
            <Bookmark className={cn("size-3.5", bookmarkedOnly && "fill-amber-400/60")} />
            Bookmarked
          </button>
        </Item>
      </Stagger>

      <Reveal delay={0.05}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search contest name or round…" className="max-w-md" />
      </Reveal>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => {
            const b = dateBlock(c.startTime);
            const saved = isSaved(c.id);
            return (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
              >
                <GlassCard className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-xl border border-white/8 bg-white/[0.03] py-2.5">
                    <span className="text-[9.5px] font-bold tracking-widest text-zinc-500">{b.weekday}</span>
                    <span className="font-display text-2xl font-bold leading-none text-white">{b.day}</span>
                    <span className="mt-1 text-[9.5px] font-bold tracking-widest" style={{ color: platformDot[c.platform] }}>
                      {b.mon}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <PlatformBadge platform={c.platform.toLowerCase() as any} size="sm" />
                      <p className="truncate text-[14.5px] font-bold text-white">{c.name}</p>
                      {c.rated && (
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-300">
                          Rated
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {new Date(c.startTime).toLocaleString("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="size-3.5" /> {c.duration}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={difficultyTone[c.difficulty]}>{c.difficulty}</Badge>
                    <button
                      onClick={() => toggle(c.id)}
                      aria-label={saved ? "Remove bookmark" : "Bookmark contest"}
                      className={cn(
                        "flex size-9 cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-90",
                        saved
                          ? "border-amber-500/40 bg-amber-500/12 text-amber-300"
                          : "border-white/10 bg-white/[0.03] text-zinc-500 hover:border-white/25 hover:text-zinc-200"
                      )}
                    >
                      <Bookmark className={cn("size-4", saved && "fill-amber-400/70")} />
                    </button>
                    <a href={c.url} className="group hidden sm:block">
                      <Button className="group">
                        Details
                        <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Button>
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <GlassCard className="flex flex-col items-center gap-3 p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
            <Trophy className="size-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-300">No contests match</p>
          <p className="max-w-sm text-[12.5px] text-zinc-500">
            {bookmarkedOnly
              ? "You haven't bookmarked any contests yet — tap the bookmark icon on one you want to grind."
              : "Try clearing the search or switching platform filters."}
          </p>
        </GlassCard>
      )}

      <Reveal>
        <div className="flex items-center gap-3 rounded-2xl border border-accent-500/15 bg-accent-500/[0.05] px-5 py-4">
          <Zap className="size-5 shrink-0 text-accent-300" />
          <p className="text-[12.5px] leading-relaxed text-zinc-400">
            <span className="font-semibold text-white">Pro tip:</span> your Codeforces rating is
            +87 in 30 days. A rated contest every ~3 days keeps the rating curve steep — two more
            above 1523 unlocks <span className="font-semibold text-accent-300">Expert</span>.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

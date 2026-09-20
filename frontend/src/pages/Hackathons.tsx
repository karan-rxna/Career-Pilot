import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Building2, CalendarClock, MapPin, Rocket, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, FilterChips, GlassCard, PageHeader, SearchInput } from "../components/ui";
import { Item, Reveal, Stagger } from "../components/motion";
import { hackathons } from "../data/mock";
import { cn, daysLeft, formatDate } from "../lib/utils";
import { useBookmarks } from "../store/useBookmarks";

type ModeFilter = "all" | "Online" | "Hybrid" | "Offline";

const toneFor: Record<string, "green" | "cyan" | "amber" | "neutral" | "brand" | "red"> = {
  Online: "green",
  Hybrid: "cyan",
  Offline: "amber",
  "Beginner-friendly": "green",
  Intermediate: "amber",
  Advanced: "red",
};

export default function Hackathons() {
  const [mode, setMode] = useState<ModeFilter>("all");
  const [level, setLevel] = useState<"all" | "Beginner-friendly" | "Intermediate" | "Advanced">("all");
  const [query, setQuery] = useState("");
  const { isSaved, toggle } = useBookmarks();

  const list = useMemo(
    () =>
      hackathons
        .filter((h) => (mode === "all" ? true : h.mode === mode))
        .filter((h) => (level === "all" ? true : h.difficulty === level))
        .filter(
          (h) =>
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            h.organizer.toLowerCase().includes(query.toLowerCase()) ||
            h.theme.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()),
    [mode, level, query]
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Hackathon Hub"
          title="Where to build next"
          description="Curated hackathons from campuses and global organizers. Deadlines count down live."
          actions={
            <Badge tone="brand" className="px-3 py-1.5 text-[12.5px]">
              <Rocket className="size-3.5" /> {list.length} open now
            </Badge>
          }
        />
      </Reveal>

      <Stagger className="flex flex-wrap items-center gap-3">
        <Item>
          <FilterChips
            value={mode}
            onChange={setMode}
            options={[
              { value: "all", label: "Any mode" },
              { value: "Online", label: "Online" },
              { value: "Hybrid", label: "Hybrid" },
              { value: "Offline", label: "Offline" },
            ]}
          />
        </Item>
        <Item>
          <FilterChips
            value={level}
            onChange={setLevel}
            options={[
              { value: "all", label: "Any level" },
              { value: "Beginner-friendly", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
            ]}
          />
        </Item>
      </Stagger>

      <Reveal delay={0.05}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name, organizer or theme…" className="max-w-md" />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((h) => {
            const saved = isSaved(h.id);
            const dl = daysLeft(h.deadline);
            const urgent = dl.startsWith("0") || dl.startsWith("1d") || dl.includes("overdue");
            return (
              <motion.div
                layout
                key={h.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="group relative flex h-full flex-col overflow-hidden p-5">
                  <div className="pointer-events-none absolute -right-12 -top-14 size-36 rounded-full bg-brand-500/10 blur-3xl transition-all duration-500 group-hover:bg-accent-500/12" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/15 text-brand-300">
                      <Rocket className="size-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                          urgent
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                            : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        )}
                      >
                        <CalendarClock className="size-3" />
                        {dl}
                      </span>
                      <button
                        onClick={() => toggle(h.id)}
                        aria-label={saved ? "Remove bookmark" : "Bookmark hackathon"}
                        className={cn(
                          "flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-all active:scale-90",
                          saved
                            ? "border-amber-500/40 bg-amber-500/12 text-amber-300"
                            : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-200"
                        )}
                      >
                        <Bookmark className={cn("size-3.5", saved && "fill-amber-400/70")} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 font-display text-[17px] font-bold leading-snug text-white">
                    {h.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <Building2 className="size-3.5" /> {h.organizer}
                    {h.city && (
                      <span className="flex items-center gap-1 text-zinc-600">
                        · <MapPin className="size-3" /> {h.city}
                      </span>
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge tone={toneFor[h.mode]}>{h.mode}</Badge>
                    <Badge>{h.theme}</Badge>
                    <Badge>
                      <Users className="size-3" /> {h.teamSize}
                    </Badge>
                    <Badge tone={toneFor[h.difficulty]}>{h.difficulty}</Badge>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-300">
                      <Trophy className="size-4" /> {h.prize}
                    </div>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex cursor-pointer items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-brand-200 transition-all hover:bg-brand-500/20 hover:brightness-110 active:scale-95"
                    >
                      Apply by {formatDate(h.deadline)}
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <GlassCard className="p-10 text-center text-sm text-zinc-500">
          Nothing matches those filters — widen the net, pilot.
        </GlassCard>
      )}
    </div>
  );
}

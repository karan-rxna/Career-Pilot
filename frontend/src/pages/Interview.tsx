import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Search,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, GlassCard, PageHeader, Progress, SearchInput } from "../components/ui";
import { Item, Reveal, Stagger } from "../components/motion";
import { interviewCategories } from "../data/mock";
import { cn } from "../lib/utils";

const toneMap = {
  Beginner: "green",
  Intermediate: "amber",
  Advanced: "red",
} as const;

const catGradient: Record<string, string> = {
  java: "from-amber-500 to-orange-600",
  oop: "from-sky-500 to-cyan-500",
  dbms: "from-emerald-500 to-teal-600",
  os: "from-fuchsia-500 to-purple-600",
  cn: "from-rose-500 to-pink-600",
  hr: "from-brand-500 to-violet-600",
  behavioral: "from-accent-500 to-cyan-600",
};

const catEmoji: Record<string, string> = {
  java: "☕",
  oop: "🧱",
  dbms: "🗄️",
  os: "🖥️",
  cn: "🌐",
  hr: "🎙️",
  behavioral: "🧠",
};

export default function Interview() {
  const [catId, setCatId] = useState(interviewCategories[0].id);
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState<Set<string>>(new Set());

  const cat = interviewCategories.find((c) => c.id === catId) ?? interviewCategories[0];

  const toggleLearned = (key: string) =>
    setLearned((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const learnedCount = useMemo(
    () => cat.items.filter((i) => learned.has(`${cat.id}:${i.title}`)).length,
    [cat, learned]
  );

  const items = useMemo(() => {
    if (!query.trim()) return cat.items;
    return cat.items.filter(
      (i) =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.summary.toLowerCase().includes(query.toLowerCase())
    );
  }, [cat, query]);

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Interview Preparation"
          title="The interview syllabus"
          description="Categorized, revision-ready notes for the theory rounds that decide offers. Mark topics learned — your readiness score updates live."
          actions={
            <div className="hidden items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-2 text-[12.5px] font-semibold text-amber-300 sm:flex">
              <Trophy className="size-4" /> 3 mock interviews booked
            </div>
          }
        />
      </Reveal>

      {/* category rail */}
      <Stagger className="flex flex-wrap gap-2">
        {interviewCategories.map((c) => {
          const covered = c.items.filter((i) => learned.has(`${c.id}:${i.title}`)).length;
          const allDone = covered === c.items.length;
          const isActive = c.id === catId;
          return (
            <Item key={c.id}>
              <button
                onClick={() => {
                  setCatId(c.id);
                  setQuery("");
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-2xl border px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95",
                  isActive
                    ? "border-brand-500/50 bg-brand-500/12 text-white shadow-[0_0_24px_-8px_rgba(138,99,255,0.6)]"
                    : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                )}
              >
                <span className="text-base">{catEmoji[c.id]}</span>
                {c.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    allDone
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isActive
                        ? "bg-brand-500/25 text-brand-100"
                        : "bg-white/8 text-zinc-500"
                  )}
                >
                  {covered}/{c.items.length}
                </span>
              </button>
            </Item>
          );
        })}
      </Stagger>

      <Reveal delay={0.05}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder={`Search inside ${cat.name}…`} className="md:max-w-sm" />
          <div className="flex items-center gap-3 text-[12px] text-zinc-500 md:ml-auto">
            <BookOpenCheck className="size-4 text-brand-300" />
            <span>
              <span className="font-display text-lg font-bold text-white">{learnedCount}</span> of{" "}
              {cat.items.length} topics covered
            </span>
          </div>
        </div>
      </Reveal>

      {/* header strip + items */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12">
          <GlassCard className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg",
                  catGradient[cat.id]
                )}
              >
                {catEmoji[cat.id]}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold text-white">{cat.name}</h2>
                <p className="text-[12.5px] text-zinc-500">{cat.blurb}</p>
              </div>
              <div className="w-full sm:w-56">
                <Progress
                  value={(learnedCount / Math.max(1, cat.items.length)) * 100}
                  size="md"
                  gradient={learnedCount === cat.items.length ? "from-emerald-500 to-emerald-400" : "from-brand-500 to-accent-400"}
                />
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <div className="col-span-12 space-y-2.5">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const key = `${cat.id}:${item.title}`;
              const done = learned.has(key);
              return (
                <motion.div
                  layout
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <GlassCard
                    className={cn(
                      "flex flex-wrap items-center gap-4 p-4 transition-colors sm:p-5",
                      done && "border-emerald-500/20"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl border font-mono text-[13px] font-bold transition-colors",
                        done
                          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                          : "border-white/10 bg-white/[0.03] text-zinc-500"
                      )}
                    >
                      {done ? <CheckCircle2 className="size-4.5" /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[14.5px] font-bold text-white", done && "line-through decoration-emerald-400/40")}>
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-zinc-500">{item.summary}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={toneMap[item.difficulty]}>{item.difficulty}</Badge>
                      <Badge tone="neutral">
                        <Clock className="size-3" /> ~{item.minutes} min
                      </Badge>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => toggleLearned(key)}
                        className={cn(
                          "flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-bold transition-all active:scale-95",
                          done
                            ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-300"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-zinc-200"
                        )}
                      >
                        <CheckCircle2 className="size-4" />
                        {done ? "Learned" : "Mark learned"}
                      </button>
                      <button
                        onClick={() => {}}
                        aria-label={`Open ${item.title}`}
                        className="flex cursor-pointer items-center gap-1 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-[12px] font-bold text-brand-200 transition-all hover:bg-brand-500/20 active:scale-95"
                      >
                        Revision notes <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && (
            <GlassCard className="p-10 text-center">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-white/5">
                <Search className="size-5 text-zinc-500" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">No topics match “{query}”</p>
              <p className="mt-1 text-[12px] text-zinc-500">Try a broader keyword or another category.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

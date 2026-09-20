import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  Clock,
  Lock,
  Map as MapIcon,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Ring } from "../components/Ring";
import { Badge, GlassCard, PageHeader } from "../components/ui";
import { Reveal } from "../components/motion";
import { roadmaps } from "../data/mock";
import { cn, pct } from "../lib/utils";

const seedProgress: Record<string, number> = Object.fromEntries(
  roadmaps.map((r) => [r.id, r.doneStages])
);

export default function Roadmaps() {
  const [activeId, setActiveId] = useState(roadmaps[0].id);
  const [progress, setProgress] = useState<Record<string, number>>(seedProgress);
  const active = roadmaps.find((r) => r.id === activeId) ?? roadmaps[0];

  const toggleStage = (id: string, stageIndex: number) => {
    setProgress((p) => {
      const cur = p[id] ?? 0;
      if (stageIndex === cur) return { ...p, [id]: cur - 1 };
      if (stageIndex === cur + 1 && stageIndex < roadmaps.find((r) => r.id === id)!.stages.length)
        return { ...p, [id]: cur + 1 };
      return p;
    });
  };

  const curCount = progress[active.id] ?? 0;
  const curPct = pct(curCount, active.stages.length);

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Learning Roadmaps"
          title="A route, not a rabbit hole"
          description="Curated, stage-by-stage paths for the careers students actually target. Tick stages as you finish them — progress auto-syncs to your dashboard."
          actions={
            <Badge tone="brand" className="px-3 py-1.5 text-[12.5px]">
              <Sparkles className="size-3.5" /> 5 paths · community-curated
            </Badge>
          }
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* overview rail */}
        <div className="space-y-2.5 lg:col-span-2">
          {roadmaps.map((r) => {
            const p = progress[r.id] ?? r.doneStages;
            const pctV = pct(p, r.stages.length);
            const isActive = r.id === activeId;
            return (
              <motion.button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                whileHover={{ y: -1 }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-4 text-left transition-all",
                  isActive
                    ? "border-brand-500/45 bg-brand-500/[0.07] shadow-[0_0_30px_-10px_rgba(138,99,255,0.5)]"
                    : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                )}
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-lg",
                    r.gradient
                  )}
                >
                  {r.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-bold text-white">{r.title}</p>
                    <span className="font-display text-[12.5px] font-bold text-brand-300">{pctV}%</span>
                  </div>
                  <p className="truncate text-[11.5px] text-zinc-500">{r.tagline}</p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className={cn("h-full rounded-full bg-gradient-to-r", r.gradient)}
                        animate={{ width: `${pctV}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[10.5px] text-zinc-500">
                      {p}/{r.stages.length}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}

          <GlassCard className="mt-3 p-4">
            <p className="text-[12.5px] leading-relaxed text-zinc-400">
              <span className="font-semibold text-white">How progress works:</span>{" "}
              roadmap stage unlocks are checked off manually here (or auto-detected from your
              platform activity in v2).
            </p>
          </GlassCard>
        </div>

        {/* detail panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="overflow-hidden" hover={false}>
                <div className="border-b border-white/6 p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    <div
                      className={cn(
                        "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-xl",
                        active.gradient
                      )}
                    >
                      {active.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl font-bold text-white">{active.title}</h2>
                      <p className="text-[12.5px] text-zinc-500">{active.tagline}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tone="neutral">
                          <CalendarClock className="size-3" /> {active.estWeeks}
                        </Badge>
                        <Badge tone="neutral">
                          <BookOpen className="size-3" /> {active.stages.length} stages
                        </Badge>
                        <Badge tone="green">
                          <Check className="size-3" /> {curCount} completed
                        </Badge>
                      </div>
                    </div>
                    <Ring progress={curPct} size={76} stroke={7}>
                      <span className="font-display text-base font-bold text-white">{curPct}%</span>
                    </Ring>
                  </div>
                  <p className="mt-4 text-[12px] text-zinc-500">
                    {active.stages[curCount]?.done
                      ? ""
                      : curCount === active.stages.length
                        ? "🎉 Roadmap complete — move to the next path or build a capstone."
                        : `Next up: “${active.stages[curCount]?.title}” — tap it below when you're done.`}
                  </p>
                </div>

                <div className="p-5">
                  <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Stages · {curCount} of {active.stages.length}
                  </p>
                  <div className="grid gap-1 md:grid-cols-2">
                    {active.stages.map((stage, i) => {
                      const state = i < curCount ? "done" : i === curCount ? "next" : "locked";
                      return (
                        <motion.button
                          key={stage.title}
                          onClick={() => toggleStage(active.id, i)}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10px" }}
                          transition={{ delay: i * 0.03, duration: 0.25 }}
                          whileTap={{ scale: state === "locked" ? 1 : 0.98 }}
                          className={cn(
                            "group flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all",
                            state === "done" && "border-emerald-500/25 bg-emerald-500/[0.07]",
                            state === "next" &&
                              "border-brand-500/45 bg-brand-500/[0.09] shadow-[0_0_24px_-8px_rgba(138,99,255,0.55)]",
                            state === "locked" && "border-white/6 bg-white/[0.02] opacity-60 hover:opacity-90"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-lg border font-mono text-[10.5px] font-bold",
                              state === "done" && "border-emerald-400/50 bg-emerald-500/20 text-emerald-300",
                              state === "next" && "border-brand-500/60 bg-brand-500/20 text-brand-200",
                              state === "locked" && "border-white/10 bg-white/4 text-zinc-500"
                            )}
                          >
                            {state === "done" ? (
                              <Check className="size-3.5" strokeWidth={3} />
                            ) : state === "locked" ? (
                              <Lock className="size-3" />
                            ) : (
                              i + 1
                            )}
                          </span>
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-[13px] font-medium",
                              state === "done" ? "text-zinc-400" : "text-zinc-100"
                            )}
                          >
                            {stage.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-[10px] text-zinc-500">
                            <Clock className="size-3" /> {stage.eta}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div>
                      <p className="text-[12px] font-semibold text-zinc-300">Recommended resources</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {active.resources.map((res) => (
                          <span
                            key={res}
                            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-brand-500/40 hover:text-white"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                    {curCount < active.stages.length && (
                      <button
                        onClick={() => setActiveId(roadmaps[(roadmaps.indexOf(active) + 1) % roadmaps.length].id)}
                        className="hidden cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-95 md:flex"
                      >
                        <Play className="size-4" /> Start stage {curCount + 1}
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent-500/15 bg-accent-500/[0.05] p-4">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-300" />
                    <p className="text-[12px] leading-relaxed text-zinc-400">
                      <span className="font-semibold text-accent-300">AI pacing (v2):</span> your
                      completion speed will adapt this roadmap to your semester calendar and
                      auto-generate daily tasks from the next stage.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11.5px] text-zinc-600">
                    <MapIcon className="size-3.5" />
                    Switching path? Progress is saved per roadmap — explore freely.
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

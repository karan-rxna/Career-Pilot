import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Flame, Minus, Plus, Target, Trash2, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Ring } from "../components/Ring";
import { CountUp, Item, Reveal, Stagger } from "../components/motion";
import { Badge, Button, GlassCard, PageHeader, Progress } from "../components/ui";
import { goals as seedGoals, type Goal } from "../data/mock";
import { cn, daysLeft, pct } from "../lib/utils";

const STORE = "careerpilot:goals";

const categoryTone: Record<Goal["category"], "brand" | "amber" | "cyan" | "green" | "neutral"> = {
  DSA: "brand",
  Backend: "green",
  SQL: "cyan",
  Projects: "amber",
  Interviews: "neutral",
};

const priorityTone: Record<Goal["priority"], "red" | "amber" | "neutral"> = {
  High: "red",
  Medium: "amber",
  Low: "neutral",
};

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-brand-500/50 focus:outline-none";

function today() {
  return new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10);
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) return JSON.parse(raw) as Goal[];
    } catch {
      /* ignore */
    }
    return seedGoals;
  });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("DSA");
  const [target, setTarget] = useState(50);
  const [unit, setUnit] = useState("questions");
  const [priority, setPriority] = useState<Goal["priority"]>("Medium");
  const [deadline, setDeadline] = useState(today());

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(goals));
  }, [goals]);

  const bump = (id: string, delta: number) =>
    setGoals((gs) =>
      gs.map((g) => {
        if (g.id !== id) return g;
        const next = Math.max(0, Math.min(g.target, g.current + delta));
        return { ...g, current: next, status: next >= g.target ? "done" : g.status };
      })
    );

  const remove = (id: string) => setGoals((gs) => gs.filter((g) => g.id !== id));

  function create(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const goal: Goal = {
      id: `g-${Date.now()}`,
      title: title.trim(),
      category,
      target: Math.max(1, target),
      current: 0,
      unit,
      deadline: new Date(deadline).toISOString(),
      priority,
      status: "active",
    };
    setGoals((gs) => [goal, ...gs]);
    setTitle("");
    setAdding(false);
  }

  const summary = useMemo(() => {
    const active = goals.filter((g) => g.status === "active");
    const avg = active.length
      ? Math.round(active.reduce((s, g) => s + pct(g.current, g.target), 0) / active.length)
      : 0;
    const dueSoon = active.filter((g) => {
      const days = (new Date(g.deadline).getTime() - Date.now()) / 86_400_000;
      return days <= 7;
    }).length;
    return { total: goals.length, active: active.length, done: goals.length - active.length, avg, dueSoon };
  }, [goals]);

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Goal Tracker"
          title="Goals that move the needle"
          description="Break the placement prep into measurable targets. Progress updates are automatic from your platforms — bump the rest here."
          actions={
            <Button onClick={() => setAdding((v) => !v)}>
              {adding ? (
                <>
                  <X className="size-4" /> Close
                </>
              ) : (
                <>
                  <Plus className="size-4" /> New goal
                </>
              )}
            </Button>
          }
        />
      </Reveal>

      {/* summary */}
      <Stagger className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { icon: Target, label: "Active goals", value: `${summary.active}`, tone: "text-brand-300" },
          { icon: CheckCircle2, label: "Completed", value: `${summary.done}`, tone: "text-emerald-300" },
          { icon: TrendingUp, label: "Avg progress", value: `${summary.avg}%`, tone: "text-accent-300" },
          { icon: Flame, label: "Due within 7 days", value: `${summary.dueSoon}`, tone: "text-amber-300" },
        ].map((s) => (
          <Item key={s.label}>
            <GlassCard className="flex items-center gap-4 p-4">
              <s.icon className={cn("size-5 shrink-0", s.tone)} />
              <div>
                <p className="font-display text-2xl font-bold leading-none text-white">{s.value}</p>
                <p className="mt-1 text-[11.5px] text-zinc-500">{s.label}</p>
              </div>
            </GlassCard>
          </Item>
        ))}
      </Stagger>

      {/* create form */}
      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            onSubmit={create}
            className="overflow-hidden"
          >
            <GlassCard className="border-glow p-5" hover={false}>
              <p className="mb-4 font-display text-[15px] font-bold text-white">Define a new goal ✦</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input
                  className={cn(inputCls, "md:col-span-2")}
                  placeholder="Goal title — e.g. Complete Spring Security module"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as Goal["category"])}>
                  {(["DSA", "Backend", "SQL", "Projects", "Interviews"] as const).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as Goal["priority"])}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <label className="flex items-center gap-2 text-[12px] text-zinc-400">
                  Target
                  <input
                    type="number"
                    min={1}
                    className={cn(inputCls, "w-24")}
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                  />
                </label>
                <input
                  className={inputCls}
                  placeholder="unit (questions, stages…)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                <input type="date" className={inputCls} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit">
                  <Plus className="size-4" /> Create goal
                </Button>
              </div>
            </GlassCard>
          </motion.form>
        )}
      </AnimatePresence>

      {/* goal cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {goals.map((g, idx) => {
            const p = pct(g.current, g.target);
            const done = g.status === "done";
            const dl = daysLeft(g.deadline);
            const urgent = dl.startsWith("0") || dl.startsWith("1d");
            return (
              <motion.div
                layout
                key={g.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
              >
                <GlassCard className={cn("relative flex h-full flex-col p-5", done && "opacity-80")}>
                  {done && (
                    <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      <CheckCircle2 className="size-4" />
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <Ring progress={p} size={66} stroke={6}>
                      <span className={cn("font-display text-sm font-bold", done ? "text-emerald-300" : "text-white")}>
                        {p}%
                      </span>
                    </Ring>
                    <div className="min-w-0">
                      <p className={cn("text-[14px] font-bold leading-snug text-white", done && "line-through decoration-emerald-400/60")}>
                        {g.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge tone={categoryTone[g.category]}>{g.category}</Badge>
                        <Badge tone={priorityTone[g.priority]}>{g.priority}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-[12px] text-zinc-500">
                      <span className="font-display text-lg font-bold text-white">
                        <CountUp value={g.current} />
                      </span>
                      /{g.target} {g.unit}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => bump(g.id, -1)}
                        disabled={done || g.current <= 0}
                        aria-label="Decrease progress"
                        className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:text-white active:scale-90 disabled:opacity-30"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <button
                        onClick={() => bump(g.id, 1)}
                        disabled={done || g.current >= g.target}
                        aria-label="Increase progress"
                        className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 text-brand-300 transition-all hover:bg-brand-500/20 active:scale-90 disabled:opacity-30"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <Progress value={p} size="sm" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3 text-[11.5px]">
                    <span
                      className={cn(
                        "font-semibold",
                        done ? "text-emerald-400" : urgent ? "text-rose-300" : "text-zinc-500"
                      )}
                    >
                      {done ? "Completed 🎉" : `${dl} · due`}
                    </span>
                    <button
                      onClick={() => remove(g.id)}
                      aria-label="Delete goal"
                      className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-zinc-600 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

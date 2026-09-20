import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  Flame,
  Layers,
  Map,
  Plus,
  Quote,
  Rocket,
  Sparkles,
  StickyNote,
  Target,
  Trophy,
} from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GithubIcon } from "../components/brands";
import { Heatmap } from "../components/Heatmap";
import { ChartTooltip } from "../components/charts";
import { Ring } from "../components/Ring";
import { CountUp, EASE, Item, Reveal, Stagger } from "../components/motion";
import { PlatformBadge } from "../components/platform";
import { Badge, Button, GlassCard, Progress } from "../components/ui";
import {
  codingStats,
  contests,
  currentDateLabel,
  ghStats,
  hackathons,
  makeHeatmap,
  quotes,
  quickActions,
  recentActivity,
  roadmaps,
  user,
  weeklyActivity,
} from "../data/mock";
import { cn } from "../lib/utils";
import { daysLeft, formatCountdown } from "../lib/utils";

const heatmapData = makeHeatmap(26);

const difficultyTone = {
  "Warm-up": "green",
  Easy: "green",
  Medium: "amber",
  Hard: "red",
} as const;

const planSeed = [
  "Review 2 DP patterns — LIS & 0/1 knapsack",
  "Solve 1 LeetCode medium · Sliding Window",
  "Revise Spring Security + JWT flow (30 min)",
  "Ship notes from today's mock interview",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayDone(done: boolean[]): number {
  return done.filter(Boolean).length;
}

type TileIcon = ComponentType<{ className?: string }>;
const activityStyle: Record<string, { tile: string; icon: TileIcon; color: string }> = {
  leetcode: { tile: "bg-amber-500/12", icon: Code2, color: "text-amber-300" },
  codeforces: { tile: "bg-sky-500/12", icon: Trophy, color: "text-sky-300" },
  github: { tile: "bg-brand-500/12", icon: GithubIcon, color: "text-brand-300" },
  goal: { tile: "bg-emerald-500/12", icon: Target, color: "text-emerald-300" },
  star: { tile: "bg-fuchsia-500/12", icon: Sparkles, color: "text-fuchsia-300" },
};

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  note,
  tone,
  iconBg,
  index,
}: {
  icon: TileIcon;
  label: string;
  value: number;
  suffix?: string;
  note: string;
  tone: "brand" | "green" | "amber" | "cyan";
  iconBg: string;
  index: number;
}) {
  return (
    <Item>
      <GlassCard className="group relative overflow-hidden p-5">
        <div className="absolute -right-8 -top-10 size-28 rounded-full bg-white/[0.03] blur-2xl transition-all duration-500 group-hover:bg-brand-500/10" />
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl border",
              iconBg
            )}
          >
            <Icon className="size-5" />
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10.5px] font-bold",
              tone === "green" && "bg-emerald-500/10 text-emerald-300",
              tone === "amber" && "bg-amber-500/10 text-amber-300",
              tone === "cyan" && "bg-accent-500/10 text-accent-300",
              tone === "brand" && "bg-brand-500/10 text-brand-300"
            )}
          >
            ↑ this month
          </span>
        </div>
        <p className="mt-4 font-display text-[28px] font-bold tracking-tight text-white">
          <CountUp value={value} />
          <span className="ml-0.5 text-base font-semibold text-zinc-500">{suffix}</span>
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-zinc-400">{label}</p>
        <p className="mt-2 text-[11.5px] leading-snug text-zinc-500">{note}</p>
      </GlassCard>
    </Item>
  );
}

function quote() {
  const day = Math.floor(Date.now() / 86_400_000);
  return quotes[day % quotes.length];
}

export default function Dashboard() {
  const [plan, setPlan] = useState<boolean[]>(planSeed.map(() => false));
  const toggle = (i: number) => setPlan((p) => p.map((v, j) => (j === i ? !v : v)));
  const done = todayDone(plan);
  const dailyPct = (done / plan.length) * 100;
  const heroQuote = useMemo(quote, []);
  const topContests = contests.slice(0, 4);
  const topRoadmaps = roadmaps.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ------------------------------- hero ------------------------------- */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-8">
          <div className="border-glow relative overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-brand-500/18 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-accent-500/10 blur-[90px]" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {currentDateLabel} · {greeting()}
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Welcome back,{" "}
                    <span className="text-gradient">{user.name.split(" ")[0]}</span>
                  </h1>
                  <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-zinc-400">
                    You're <span className="font-semibold text-emerald-300">12 days ahead</span> of
                    your goal pace. Codeforces rating up{" "}
                    <span className="font-semibold text-emerald-300">+87</span> this month — keep the
                    trajectory.
                  </p>
                </div>
                <Link to="/app/dsa">
                  <Button className="group">
                    Analyze my profiles
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    <Rocket className="size-3.5 text-brand-300" /> Today's flight plan
                    {done === plan.length && (
                      <span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-emerald-300">
                        All done 🎉
                      </span>
                    )}
                  </p>
                  <ul className="space-y-1.5">
                    {planSeed.map((label, i) => (
                      <li key={label}>
                        <button
                          onClick={() => toggle(i)}
                          className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/4"
                        >
                          <motion.span
                            animate={{
                              backgroundColor: plan[i] ? "#34d399" : "rgba(255,255,255,0.06)",
                            }}
                            whileTap={{ scale: 0.85 }}
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-md border",
                              plan[i]
                                ? "border-emerald-400/60"
                                : "border-white/15 group-hover:border-brand-400/60"
                            )}
                          >
                            {plan[i] && (
                          <motion.path
                            d="M5 13l4 4L19 7"
                            className="stroke-emerald-300"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                            fill="none"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                            )}
                          </motion.span>
                          <span
                            className={cn(
                              "text-[13.5px] transition-colors",
                              plan[i] ? "text-zinc-500 line-through" : "text-zinc-200"
                            )}
                          >
                            {label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center gap-2 sm:pr-4">
                  <Ring progress={dailyPct} size={92} stroke={8}>
                    <div className="text-center">
                      <p className="font-display text-xl font-bold text-white">
                        {done}/{plan.length}
                      </p>
                    </div>
                  </Ring>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    Daily progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* quote + hackathon spotlight */}
        <div className="col-span-12 grid gap-6 xl:col-span-4">
          <Reveal delay={0.08} className="xl:grid">
            <GlassCard className="relative flex flex-col overflow-hidden p-6">
              <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-brand-500/15 blur-3xl" />
              <Quote className="size-7 text-brand-400/70" fill="currentColor" />
              <p className="relative mt-3 flex-1 font-display text-[17px] font-semibold leading-snug text-zinc-100">
                “{heroQuote.text}”
              </p>
              <p className="relative mt-4 text-[12.5px] font-medium text-zinc-500">
                — {heroQuote.author}
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/app/hackathons" className="block">
              <GlassCard className="relative overflow-hidden p-5">
                <div className="flex items-center justify-between">
                  <Badge tone="brand">Hackathon spotlight</Badge>
                  <span className="text-[11.5px] font-semibold text-brand-300">
                    {daysLeft(hackathons[1].deadline)} · apply
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-bold text-white">
                  {hackathons[1].name}
                </p>
                <p className="mt-1 text-[12.5px] text-zinc-400">
                  by {hackathons[1].organizer} · {hackathons[1].theme}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="cyan">{hackathons[1].mode}</Badge>
                  <Badge>👥 {hackathons[1].teamSize}</Badge>
                  <Badge tone="amber">🏆 {hackathons[1].prize}</Badge>
                </div>
              </GlassCard>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* --------------------------- stat tiles --------------------------- */}
      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          index={0}
          icon={Code2}
          label="Problems solved"
          value={526}
          note="LeetCode 312 · Codeforces 214"
          tone="brand"
          iconBg="border-brand-500/25 bg-brand-500/12 text-brand-300"
        />
        <StatTile
          index={1}
          icon={Rocket}
          label="Codeforces rating"
          value={1523}
          note="Peak 1591 · Specialist tier"
          tone="green"
          iconBg="border-sky-500/25 bg-sky-500/12 text-sky-300"
        />
        <StatTile
          index={2}
          icon={GithubIcon}
          label="GitHub contributions"
          value={ghStats.contributionsYear}
          note="47 repos · 128 followers"
          tone="cyan"
          iconBg="border-white/12 bg-white/8 text-zinc-200"
        />
        <StatTile
          index={3}
          icon={Flame}
          label="Day streak"
          value={codingStats.leetcode.streak}
          suffix="d"
          note="Longest ever: 41 days 🔥"
          tone="amber"
          iconBg="border-amber-500/25 bg-amber-500/12 text-amber-300"
        />
      </Stagger>

      {/* --------------------- chart + daily goals --------------------- */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-8">
          <GlassCard className="h-full p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Weekly analytics</h2>
                <p className="text-[12.5px] text-zinc-500">Last 7 weeks · solved vs commits</p>
              </div>
              <div className="flex items-center gap-4 text-[11.5px] font-medium text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-brand-500" /> Problems
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-accent-400" /> Commits
                </span>
                <Link
                  to="/app/dsa"
                  className="flex items-center gap-1 text-brand-300 transition-colors hover:text-brand-200"
                >
                  Full report <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="gSolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8a63ff" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8a63ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#45e6fb" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#45e6fb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} dy={8} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                  <Area
                    type="monotone"
                    dataKey="solved"
                    name="Problems solved"
                    stroke="#8a63ff"
                    strokeWidth={2.5}
                    fill="url(#gSolved)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    name="Commits"
                    stroke="#45e6fb"
                    strokeWidth={2.5}
                    fill="url(#gCommits)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 xl:col-span-4">
          <GlassCard className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Active goals</h2>
              <Link
                to="/app/goals"
                className="flex items-center gap-1 text-[12.5px] font-medium text-brand-300 hover:text-brand-200"
              >
                Manage <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
              {[
                { g: "Solve 200 DSA questions", cur: 152, tot: 200, tag: "DSA", tone: "amber" as const },
                { g: "Grind SQL on LeetCode", cur: 31, tot: 50, tag: "SQL", tone: "cyan" as const },
                { g: "Java Backend roadmap", cur: 8, tot: 14, tag: "Backend", tone: "green" as const },
              ].map((row) => {
                const p = Math.round((row.cur / row.tot) * 100);
                return (
                  <div key={row.g} className="group">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="truncate text-[13.5px] font-semibold text-zinc-200">{row.g}</p>
                      <span
                        className={cn(
                          "font-display text-[13px] font-bold",
                          row.tone === "amber" && "text-amber-300",
                          row.tone === "cyan" && "text-accent-300",
                          row.tone === "green" && "text-emerald-300"
                        )}
                      >
                        {p}%
                      </span>
                    </div>
                    <Progress value={p} size="md" />
                    <p className="mt-1 text-[11.5px] text-zinc-500">
                      {row.cur.toLocaleString()} / {row.tot.toLocaleString()} · {row.tag}
                    </p>
                  </div>
                );
              })}
            </div>
            <Link to="/app/goals" className="mt-6 block">
              <Button variant="outline" className="w-full">
                <Plus className="size-4" /> New goal
              </Button>
            </Link>
          </GlassCard>
        </Reveal>
      </div>

      {/* ------------------- heatmap + recent activity ------------------- */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-8">
          <GlassCard className="h-full p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="size-5 text-zinc-300" />
                <h2 className="font-display text-lg font-bold text-white">
                  Contribution graph
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { k: `${ghStats.longestStreak}d`, v: "Longest streak" },
                  { k: `${ghStats.repos}`, v: "Repositories" },
                  { k: `${ghStats.stars}`, v: "Stars earned" },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-1.5 text-center">
                    <p className="font-display text-[15px] font-bold text-white">{s.k}</p>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-500">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <Heatmap data={heatmapData} />
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <Link
                to="/app/profile"
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-brand-500/30"
              >
                <Layers className="size-4.5 shrink-0 text-brand-300" />
                <p className="text-[12.5px] leading-snug text-zinc-300">
                  <span className="font-semibold text-white">Top language:</span> TypeScript (38%) ·
                  Java (27%)
                </p>
                <ArrowRight className="ml-auto size-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-brand-300" />
              </Link>
              <Link
                to="/app/projects"
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-brand-500/30"
              >
                <BookOpen className="size-4.5 shrink-0 text-accent-300" />
                <p className="text-[12.5px] leading-snug text-zinc-300">
                  <span className="font-semibold text-white">Portfolio quality:</span> Strong —
                  readme coverage 86%
                </p>
                <ArrowRight className="ml-auto size-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-brand-300" />
              </Link>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 xl:col-span-4">
          <GlassCard className="flex h-full flex-col p-6">
            <h2 className="font-display text-lg font-bold text-white">Recent activity</h2>
            <ul className="mt-5 flex-1 space-y-4">
              {recentActivity.slice(0, 6).map((a, i) => {
                const s = activityStyle[a.icon];
                const Icon = s.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
                    className="flex items-start gap-3"
                  >
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", s.tile)}>
                      <Icon className={cn("size-4", s.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-snug text-zinc-200">{a.text}</p>
                      <p className="truncate text-[11.5px] text-zinc-500">{a.meta}</p>
                    </div>
                    <span className="shrink-0 text-[10.5px] text-zinc-600">{a.time}</span>
                  </motion.li>
                );
              })}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      {/* --------------------- contests + roadmaps row --------------------- */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-5">
          <GlassCard className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <Trophy className="size-4.5 text-amber-300" /> Upcoming contests
              </h2>
              <Link
                to="/app/contests"
                className="flex items-center gap-1 text-[12.5px] font-medium text-brand-300 hover:text-brand-200"
              >
                View all <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="mt-4 flex-1 divide-y divide-white/5">
              {topContests.map((c) => (
                <li key={c.id} className="group py-3 first:pt-1">
                  <div className="flex items-center gap-3">
                    <PlatformBadge platform={c.platform.toLowerCase() as any} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-zinc-100 group-hover:text-white">
                        {c.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-zinc-500">
                        <span className="font-medium text-accent-300/90">{c.platform}</span>·{" "}
                        {c.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[12px] font-semibold text-emerald-300">
                        {formatCountdown(c.startTime)}
                      </p>
                      <Badge tone={difficultyTone[c.difficulty]} className="mt-1">
                        {c.difficulty}
                      </Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/app/contests" className="mt-3">
              <Button variant="outline" className="w-full">
                <Rocket className="size-4" /> Join the next one
              </Button>
            </Link>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 xl:col-span-7">
          <GlassCard className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <Map className="size-4.5 text-brand-300" /> Learning roadmaps
              </h2>
              <Link
                to="/app/roadmaps"
                className="flex items-center gap-1 text-[12.5px] font-medium text-brand-300 hover:text-brand-200"
              >
                All roadmaps <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {topRoadmaps.map((r) => (
                <Link
                  key={r.id}
                  to="/app/roadmaps"
                  className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-white/[0.05]"
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-lg",
                      r.gradient
                    )}
                  >
                    {r.emoji}
                  </div>
                  <p className="mt-3 text-[13.5px] font-bold text-white">{r.title}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{r.tagline}</p>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10.5px] font-medium text-zinc-500">
                      <span>
                        {r.doneStages}/{r.totalStages} stages
                      </span>
                      <span className="text-brand-300">
                        {Math.round((r.doneStages / r.totalStages) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(r.doneStages / r.totalStages) * 100}
                      size="sm"
                      gradient="from-brand-500 to-accent-400"
                    />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {quickActions.map((qa, i) => (
                  <Link
                    key={qa.label}
                    to={qa.to}
                    className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-all hover:border-brand-500/35 hover:bg-brand-500/[0.06]"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/25 to-accent-500/20 text-brand-300">
                      {i === 0 ? (
                        <Target className="size-4" />
                      ) : i === 1 ? (
                        <StickyNote className="size-4" />
                      ) : i === 2 ? (
                        <Trophy className="size-4" />
                      ) : (
                        <Map className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white">{qa.label}</p>
                      <p className="truncate text-[11px] text-zinc-500">{qa.sub}</p>
                    </div>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-brand-300" />
                  </Link>
                ))}
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import {
  Award,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Code2,
  Plus,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Heatmap } from "../components/Heatmap";
import { ChartTooltip } from "../components/charts";
import { CountUp, Item, Reveal, Stagger } from "../components/motion";
import { PlatformBadge } from "../components/platform";
import { Badge, GlassCard, PageHeader } from "../components/ui";
import { codingStats, makeHeatmap, topicStats, type Platform } from "../data/mock";
import { cn } from "../lib/utils";

const heatmapData = makeHeatmap(26);
const solvedColors = { easy: "#34d399", medium: "#fbbf24", hard: "#fb7185" };

const ratingTrend = [
  { round: "R04", rating: 1412 },
  { round: "R05", rating: 1438 },
  { round: "R06", rating: 1401 },
  { round: "R07", rating: 1462 },
  { round: "R08", rating: 1448 },
  { round: "R09", rating: 1487 },
  { round: "R10", rating: 1523 },
  { round: "R11", rating: 1506 },
  { round: "R12", rating: 1541 },
  { round: "R13", rating: 1511 },
  { round: "R14", rating: 1558 },
  { round: "R15", rating: 1523 },
];

const recommended = [
  {
    title: "House Robber II",
    topic: "Dynamic Programming",
    difficulty: "Medium" as const,
    why: "Fills your biggest DP gap — 62% of recent misses are 1-D state transitions.",
    eta: "~18 min",
  },
  {
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium" as const,
    why: "BFS flood-fill is your weakest sub-pattern at 46% accuracy.",
    eta: "~22 min",
  },
  {
    title: "Longest Increasing Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Medium" as const,
    why: "Classic LIS unlocks ~9 follow-ups at the same difficulty tier.",
    eta: "~25 min",
  },
  {
    title: "Course Schedule II",
    topic: "Graphs",
    difficulty: "Medium" as const,
    why: "Topological sort — high interview frequency at your target companies.",
    eta: "~20 min",
  },
];

const solveHistory = [
  { m: "Mar", easy: 24, medium: 19, hard: 6 },
  { m: "Apr", easy: 31, medium: 25, hard: 9 },
  { m: "May", easy: 19, medium: 21, hard: 8 },
  { m: "Jun", easy: 27, medium: 32, hard: 12 },
  { m: "Jul", easy: 34, medium: 28, hard: 15 },
  { m: "Aug", easy: 22, medium: 36, hard: 14 },
];

const difficultyColor = { Easy: solvedColors.easy, Medium: solvedColors.medium, Hard: solvedColors.hard };

const difficultyPie = [
  { name: "Easy", value: 141, color: solvedColors.easy },
  { name: "Medium", value: 126, color: solvedColors.medium },
  { name: "Hard", value: 45, color: solvedColors.hard },
];

const ratingColor = (r: number) =>
  r >= 1600 ? "#ffd700" : r >= 1400 ? "#45e6fb" : r >= 1200 ? "#34d399" : "#9ca3af";

interface PlatformCardProps {
  platform: Exclude<Platform, "codechef" | "atcoder">;
  headline: string;
  sub: string;
  chips: { label: string; value: string }[];
  accent: string;
}

function PlatformCard({ platform, headline, sub, chips, accent }: PlatformCardProps) {
  const [syncing, setSyncing] = useState(false);
  const refresh = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1100);
  };
  return (
    <Item>
      <GlassCard className="group relative h-full overflow-hidden p-5">
        <div
          className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full blur-3xl transition-opacity"
          style={{ background: accent, opacity: 0.12 }}
        />
        <div className="flex items-center justify-between">
          <PlatformBadge platform={platform} size="md" />
          <div className="flex items-center gap-2.5">
            <a
              href={`https://${sub}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${platform} profile in a new tab`}
              className="group/open flex cursor-pointer items-center rounded-lg border border-white/10 bg-white/[0.04] py-1 pl-1.5 pr-1.5 text-zinc-300 transition-all duration-300 hover:border-accent-500/40 hover:bg-accent-500/10 hover:text-accent-300"
            >
              <motion.span
                whileHover={{ y: -2, rotate: 14 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="flex items-center"
              >
                <Rocket className="size-3.5" />
              </motion.span>
              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 text-[10.5px] font-semibold transition-all duration-300 group-hover/open:ml-1 group-hover/open:max-w-14 group-hover/open:opacity-100">
                Open
              </span>
            </a>
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Synced
            </span>
          </div>
        </div>
        <p className="mt-3 font-display text-xl font-bold text-white">{headline}</p>
        <p className="text-[12px] text-zinc-500">{sub}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c.label}
              className="rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-300"
            >
              <span className="font-semibold text-white">{c.value}</span> {c.label}
            </span>
          ))}
        </div>
        <button
          onClick={refresh}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg text-zinc-500 opacity-0 transition-all hover:bg-white/8 hover:text-white group-hover:opacity-100"
          aria-label="Re-sync profile"
        >
          <RefreshCw className={cn("size-3.5", syncing && "animate-spin text-accent-300")} />
        </button>
      </GlassCard>
    </Item>
  );
}

function ConnectMoreCard() {
  return (
    <Item>
      <Link to="/app/profile" className="block h-full">
        <GlassCard className="flex h-full flex-col justify-center border-dashed border-white/12 bg-white/[0.015] p-5 transition-colors hover:border-brand-500/35">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5">
              <PlatformBadge platform="codechef" size="md" />
              <PlatformBadge platform="atcoder" size="md" />
            </div>
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 transition-transform group-hover:scale-110">
              <Plus className="size-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-[15px] font-bold text-white">Connect more platforms</p>
          <p className="text-[12px] text-zinc-500">
            CodeChef & AtCoder support is coming soon — one click from your profile.
          </p>
        </GlassCard>
      </Link>
    </Item>
  );
}

export default function DSA() {
  const lc = codingStats.leetcode;
  const cf = codingStats.codeforces;
  const totalLc = (lc.easy ?? 0) + (lc.medium ?? 0) + (lc.hard ?? 0);

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="DSA Analytics"
          title="Your practice, decoded automatically"
          description="Every number is fetched live from your connected coding platforms — no manual tracking, no 'mark as solved', ever."
          actions={
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-[12.5px] font-semibold text-emerald-300 sm:flex">
              <Zap className="size-4" /> Auto-sync active
            </div>
          }
        />
      </Reveal>

      {/* platform cards */}
      <Stagger className="grid gap-5 md:grid-cols-3">
        <PlatformCard
          platform="leetcode"
          headline={`${lc.solved} solved`}
          sub="leetcode.com/u/karan_codes"
          accent="#ffb020"
          chips={[
            { label: "easy", value: `${lc.easy}` },
            { label: "medium", value: `${lc.medium}` },
            { label: "hard", value: `${lc.hard}` },
            { label: "streak", value: `${lc.streak}d` },
          ]}
        />
        <PlatformCard
          platform="codeforces"
          headline={cf.rank ?? "Specialist"}
          sub="codeforces.com/profile/karanSh"
          accent="#6aa7ff"
          chips={[
            { label: "rating", value: `${cf.rating}` },
            { label: "peak", value: `${cf.maxRating}` },
            { label: "solved", value: `${cf.solved}` },
          ]}
        />
        <ConnectMoreCard />
      </Stagger>

      {/* pie + bar */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 md:col-span-5 xl:col-span-4">
          <GlassCard className="flex h-full flex-col p-6">
            <h2 className="font-display text-lg font-bold text-white">Difficulty mix</h2>
            <p className="text-[12.5px] text-zinc-500">LeetCode profile · solved 312</p>
            <div className="relative mx-auto mt-2 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Pie
                    data={difficultyPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={86}
                    paddingAngle={4}
                    cornerRadius={6}
                    stroke="none"
                  >
                    {difficultyPie.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-3xl font-bold text-white">
                  <CountUp value={totalLc} />
                </p>
                <p className="text-[10.5px] font-semibold uppercase tracking-widest text-zinc-500">
                  total
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {difficultyPie.map((d) => (
                <div key={d.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5 text-center">
                  <p className="font-display text-lg font-bold" style={{ color: d.color }}>
                    {d.value}
                  </p>
                  <p className="text-[10.5px] uppercase tracking-wide text-zinc-500">{d.name}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-brand-500/20 bg-brand-500/8 p-3 text-[11.5px] leading-relaxed text-zinc-300">
              <BrainCircuit className="mt-0.5 size-4 shrink-0 text-brand-300" />
              Your hard:easy ratio (1:3.1) beats 74% of active users —{" "}
              <span className="font-semibold text-white">push mediums to 140</span> to unlock top-5%.
            </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 md:col-span-7 xl:col-span-8">
          <GlassCard className="relative h-full overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-48 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Recommended next questions</h2>
                <p className="text-[12.5px] text-zinc-500">Picked from your weak zones · refreshed daily</p>
              </div>
              <Badge tone="brand">
                <Sparkles className="size-3" /> AI picks
              </Badge>
            </div>
            <ul className="relative space-y-3">
              {recommended.map((q, i) => (
                <motion.li
                  key={q.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.35 }}
                  className="group flex items-start gap-3.5 rounded-xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-brand-500/30 hover:bg-white/[0.05]"
                >
                  <div
                    className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] font-bold"
                    style={{ color: difficultyColor[q.difficulty], background: `${difficultyColor[q.difficulty]}1a` }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <p className="text-[13.5px] font-semibold text-white">{q.title}</p>
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: difficultyColor[q.difficulty], background: `${difficultyColor[q.difficulty]}1a` }}
                      >
                        {q.difficulty}
                      </span>
                      <span className="rounded-md border border-white/8 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                        {q.topic}
                      </span>
                      <span className="ml-auto hidden font-mono text-[11px] text-zinc-500 sm:block">{q.eta}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">{q.why}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <div className="relative mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-brand-500/25 bg-brand-500/6 p-3.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-300" />
              <p className="text-[12px] leading-relaxed text-zinc-400">
                <span className="font-semibold text-brand-200">Preview mode.</span> These picks are drafted
                from your weak zones today — the full recommendation engine (revision schedules, contest
                picks, company prep) goes live once the AI engine aligns with your profile.
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </div>

      {/* topics + rating trend */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-7">
          <GlassCard className="h-full p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Topic intelligence</h2>
                <p className="text-[12.5px] text-zinc-500">Solved count & accuracy across patterns</p>
              </div>
              <Badge tone="brand">
                <Sparkles className="size-3" /> v2 AI: next-question picks
              </Badge>
            </div>
            <ul className="mt-5 space-y-3.5">
              {topicStats.map((t, i) => (
                <motion.li
                  key={t.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-28 shrink-0 truncate text-[12.5px] font-medium text-zinc-300 sm:w-32">
                    {t.name}
                  </span>
                  <div className="relative flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-white/6">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(t.solved / 46) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.04 }}
                        className={cn(
                          "h-full rounded-full",
                          t.weak
                            ? "bg-gradient-to-r from-rose-500 to-rose-400"
                            : "bg-gradient-to-r from-brand-500 to-accent-400"
                        )}
                      />
                    </div>
                    {t.weak && (
                      <span className="absolute -right-1 top-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 p-1">
                        <CircleAlert className="size-3 text-rose-300" />
                      </span>
                    )}
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono text-[12px] font-semibold text-zinc-300">
                    {t.solved}
                  </span>
                  <span
                    className={cn(
                      "w-11 shrink-0 text-right font-mono text-[11px] font-semibold",
                      t.accuracy >= 70 ? "text-emerald-300" : t.weak ? "text-rose-300" : "text-amber-300"
                    )}
                  >
                    {t.accuracy}%
                  </span>
                </motion.li>
              ))}
            </ul>
            {topicStats.some((t) => t.weak) && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/8 p-3.5">
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-300" />
                <p className="text-[12px] leading-relaxed text-zinc-300">
                  <span className="font-bold text-white">Weak zones detected:</span>{" "}
                  Dynamic Programming (54%) & Graphs (46%).{" "}
                  <span className="text-zinc-400">
                    Revision schedule for these starts next week — 3 drills/day for 14 days flips
                    accuracy above 70%.
                  </span>
                </p>
              </div>
            )}
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 xl:col-span-5">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Contest rating trend</h2>
                <p className="text-[12.5px] text-zinc-500">Codeforces · last 15 rounds</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-300">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="mt-3 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingTrend} margin={{ top: 8, right: 8, bottom: 0, left: -26 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="round" axisLine={false} tickLine={false} dy={8} />
                  <YAxis domain={[1320, 1620]} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#45e6fb"
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { cx, cy, payload, index } = props;
                      return (
                        <circle key={index} cx={cx} cy={cy} r={3.5} fill={ratingColor(payload.rating)} stroke="#05050b" strokeWidth={1.5} />
                      );
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="font-display text-lg font-bold text-white">{cf.rating}</p>
                <p className="text-[10.5px] uppercase tracking-wider text-zinc-500">Current</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="font-display text-lg font-bold text-white">{cf.maxRating}</p>
                <p className="text-[10.5px] uppercase tracking-wider text-zinc-500">Peak</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="font-display text-lg font-bold text-gradient">+111</p>
                <p className="text-[10.5px] uppercase tracking-wider text-zinc-500">Season Δ</p>
              </div>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] py-2.5 text-[12px] text-zinc-400">
              <Award className="size-4 text-amber-300" />
              2 more rounds at ≥ current rating → <span className="font-semibold text-white">Expert</span> (1600)
            </p>
          </GlassCard>
        </Reveal>
      </div>

      {/* practice heatmap */}
      <Reveal>
        <GlassCard className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Code2 className="size-5 text-brand-300" />
              <h2 className="font-display text-lg font-bold text-white">Practice heatmap</h2>
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-zinc-500">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              Streaks auto-tracked from solved timestamps — no manual check-ins
            </div>
          </div>
          <Heatmap data={heatmapData} />
        </GlassCard>
      </Reveal>

      {/* monthly solve volume */}
      <Reveal delay={0.06}>
        <GlassCard className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-white">Monthly solve volume</h2>
              <p className="text-[12.5px] text-zinc-500">Last 6 months · by difficulty</p>
            </div>
            <div className="flex gap-3 text-[11.5px] font-medium text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ background: solvedColors.easy }} /> Easy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ background: solvedColors.medium }} /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ background: solvedColors.hard }} /> Hard
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solveHistory} margin={{ top: 4, right: 4, bottom: 0, left: -22 }} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} dy={8} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="easy" name="Easy" stackId="s" fill={solvedColors.easy} radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="Medium" stackId="s" fill={solvedColors.medium} />
                <Bar dataKey="hard" name="Hard" stackId="s" fill={solvedColors.hard} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Reveal>
    </div>
  );
}

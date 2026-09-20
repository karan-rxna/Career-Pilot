import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Download,
  ExternalLink,
  Flame,
  GraduationCap,
  Lock,
  MapPin,
  PencilLine,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { LinkedinIcon } from "../components/brands";
import { Ring } from "../components/Ring";
import { CountUp, Item, Reveal, Stagger } from "../components/motion";
import { PlatformBadge } from "../components/platform";
import { Badge, Button, GlassCard, PageHeader, Progress } from "../components/ui";
import { codingStats, ghStats, user } from "../data/mock";
import { cn } from "../lib/utils";

const readinessDims = [
  { label: "DSA foundation", value: 71 },
  { label: "Projects & GitHub", value: 82 },
  { label: "Backend skills", value: 57 },
  { label: "SQL & DB", value: 62 },
  { label: "Interview readiness", value: 40 },
];

const achievements = [
  { emoji: "🔥", title: "Streak 30", desc: "30-day coding streak", earned: true },
  { emoji: "🏅", title: "300 Solved Club", desc: "300+ DSA problems", earned: true },
  { emoji: "🚀", title: "Specialist", desc: "CF rating ≥ 1400", earned: true },
  { emoji: "🗂️", title: "Open Source", desc: "20+ merged PRs", earned: true },
  { emoji: "📝", title: "Doc Writer", desc: "10k readme words", earned: true },
  { emoji: "🦅", title: "Expert", desc: "CF rating ≥ 1600", earned: false },
  { emoji: "🧠", title: "DP Driller", desc: "50 DP problems", earned: false },
  { emoji: "💼", title: "Offer Ready", desc: "Readiness ≥ 90%", earned: false },
];

const education = [
  { role: "B.Tech CSE · 2nd Year", org: user.college.replace("B.Tech CSE · ", ""), note: "CGPA 8.7 · Class of 2028", done: true },
  { role: "Senior Secondary (PCM + CS)", org: "Delhi Public School", note: "94.2% · 2024", done: true },
];

export default function Profile() {
  const [connectState, setConnectState] = useState<Record<string, "connected" | "soon" | "connecting">>({
    leetcode: "connected",
    codeforces: "connected",
    github: "connected",
    codechef: "soon",
    atcoder: "soon",
  });
  const connect = (p: string) => {
    if (connectState[p] !== "soon") return;
    setConnectState((s) => ({ ...s, [p]: "connecting" }));
    setTimeout(() => setConnectState((s) => ({ ...s, [p]: "connected" })), 1200);
  };

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const platforms: { key: string; platform: "leetcode" | "codeforces" | "github" | "codechef" | "atcoder"; handle: string; stat: string }[] = [
    { key: "leetcode", platform: "leetcode", handle: "karan_codes", stat: `${codingStats.leetcode.solved} solved · ${codingStats.leetcode.rating} rating` },
    { key: "codeforces", platform: "codeforces", handle: "karanSh", stat: `${codingStats.codeforces.rating} rating · ${codingStats.codeforces.rank}` },
    { key: "github", platform: "github", handle: "karan-rana", stat: `${ghStats.contributionsYear.toLocaleString()} contributions` },
    { key: "codechef", platform: "codechef", handle: "karan_codes", stat: "3★ · 4 contests left to place" },
    { key: "atcoder", platform: "atcoder", handle: "karanSh", stat: "Green is the gateway" },
  ];

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader eyebrow="Profile" title="Your pilot identity" />
      </Reveal>

      {/* header + readiness */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-8">
          <div className="border-glow relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-brand-500/15 blur-[100px]" />
            <div className="relative flex flex-wrap items-start gap-6">
              <div className="relative">
                <div
                  className="flex size-24 items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, hsl(${user.avatarHue} 85% 60%), hsl(${user.avatarHue + 45} 85% 45%))`,
                  }}
                >
                  {initials}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-xl border-4 border-ink-950 bg-emerald-500/90 text-white">
                  <Award className="size-4" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                    {user.name}
                  </h2>
                  <Badge tone="green">● On track</Badge>
                  <Badge tone="neutral">Internship · SDE</Badge>
                </div>
                <p className="mt-1 text-[13.5px] font-medium text-brand-300">{user.headline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="size-3.5" /> {user.college} · {user.batch}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {user.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" /> Joined {user.joinedOn}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-zinc-400">{user.bio}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button>
                    <PencilLine className="size-4" /> Edit profile
                  </Button>
                  <Button variant="outline">
                    <LinkedinIcon className="size-4" /> LinkedIn
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="size-4" /> Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 xl:col-span-4">
          <GlassCard className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">Career readiness</h3>
              <Sparkles className="size-4 text-accent-300" />
            </div>
            <div className="mt-4 flex items-center gap-5">
              <Ring progress={user.readinessScore} size={110} stroke={9}>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-white">
                    <CountUp value={user.readinessScore} />
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">ready</p>
                </div>
              </Ring>
              <div className="flex-1 space-y-2.5">
                {readinessDims.map((d) => (
                  <div key={d.label}>
                    <div className="mb-1 flex justify-between text-[10.5px]">
                      <span className="font-medium text-zinc-400">{d.label}</span>
                      <span className="font-semibold text-zinc-300">{d.value}</span>
                    </div>
                    <Progress value={d.value} size="sm" />
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-accent-500/[0.07] px-3 py-2.5 text-[11.5px] font-medium text-accent-300">
              <Sparkles className="size-3.5 shrink-0" />
              AI coaching turns this into a weekly action plan in v2
            </p>
          </GlassCard>
        </Reveal>
      </div>

      {/* skills + connections */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-7">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">Skills</h3>
              <span className="text-[11px] text-zinc-500">{user.skills.length} tagged</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="cursor-default rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-zinc-200 transition-colors hover:border-brand-500/40 hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
              <button className="flex cursor-pointer items-center gap-1 rounded-xl border border-dashed border-brand-500/40 px-3 py-1.5 text-[12.5px] font-medium text-brand-300 transition-all hover:bg-brand-500/10">
                <Plus className="size-3.5" /> Add skill
              </button>
            </div>
            <div className="mt-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Suggested by your activity
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Kafka", "Redis", "Docker", "Next.js"].map((s) => (
                  <span key={s} className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[12px] text-zinc-500 transition-colors hover:border-accent-500/40 hover:text-accent-300">
                    <Sparkles className="size-3 text-accent-400/70" /> {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/6 pt-5 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-white">{user.goalsCompleted}</p>
                <p className="text-[11px] text-zinc-500">Goals completed</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">
                  <CountUp value={526} />
                </p>
                <p className="text-[11px] text-zinc-500">Total solved</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">
                  <CountUp value={ghStats.contributionsYear} />
                </p>
                <p className="text-[11px] text-zinc-500">Contributions</p>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 xl:col-span-5">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">Connected profiles</h3>
              <Badge tone="neutral">Auto-sync</Badge>
            </div>
            <ul className="mt-4 space-y-2.5">
              {platforms.map((p) => {
                const state = connectState[p.key];
                const isSoon = state === "soon";
                return (
                  <motion.li
                    key={p.key}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors",
                      isSoon ? "border-dashed border-white/10" : "border-white/8 bg-white/[0.03]"
                    )}
                  >
                    <PlatformBadge platform={p.platform} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-white">
                        {p.platform === "github" ? "GitHub" : p.key === "leetcode" ? "LeetCode" : p.key === "codeforces" ? "Codeforces" : p.key === "codechef" ? "CodeChef" : "AtCoder"}
                        {isSoon && (
                          <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-300">
                            Coming soon
                          </span>
                        )}
                      </p>
                      <p className="truncate text-[11.5px] text-zinc-500">
                        @{p.handle} · {p.stat}
                      </p>
                    </div>
                    {state === "connected" ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Synced
                      </span>
                    ) : state === "connecting" ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-300">
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} className="inline-block">
                          <Upload className="size-3.5" />
                        </motion.span>
                        Connecting…
                      </span>
                    ) : (
                      <button
                        onClick={() => connect(p.key)}
                        className="flex cursor-pointer items-center gap-1 rounded-lg border border-white/12 px-3 py-1.5 text-[11.5px] font-bold text-zinc-300 transition-all hover:border-accent-500/50 hover:text-accent-300 active:scale-95"
                      >
                        <Plus className="size-3.5" /> Notify me
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      {/* achievements + resume/education */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-7">
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
                <Trophy className="size-4.5 text-amber-300" /> Achievements
              </h3>
              <Badge tone="brand">{achievements.filter((a) => a.earned).length}/{achievements.length} unlocked</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ y: -3 }}
                  className={cn(
                    "rounded-2xl border p-4 text-center transition-colors",
                    a.earned
                      ? "border-gradient-to-b border-white/10 bg-gradient-to-b from-brand-500/10 to-white/[0.02]"
                      : "border-white/6 bg-white/[0.02] opacity-70"
                  )}
                >
                  <div className={cn("text-2xl", !a.earned && "opacity-60 grayscale")}>{a.emoji}</div>
                  <p className="mt-2 text-[12px] font-bold text-white">{a.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">{a.desc}</p>
                  {!a.earned && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                      <Lock className="size-2.5" /> Locked
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 xl:col-span-5">
          <div className="flex h-full flex-col gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">Resume readiness</h3>
                <span className="font-display text-2xl font-bold text-gradient">{user.resumeProgress}%</span>
              </div>
              <div className="mt-3">
                <Progress value={user.resumeProgress} size="lg" />
              </div>
              <ul className="mt-4 space-y-2.5 text-[12.5px]">
                {[
                  { label: "ATS-friendly structure", ok: true },
                  { label: "Quantified project bullets", ok: true },
                  { label: "Impact verbs & keywords", ok: true },
                  { label: "AI-tuned summary (v2)", ok: false },
                ].map((r) => (
                  <li key={r.label} className="flex items-center gap-2 text-zinc-300">
                    <span
                      className={cn(
                        "flex size-4.5 items-center justify-center rounded-full text-[9px]",
                        r.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-white/8 text-zinc-600"
                      )}
                    >
                      {r.ok ? "✓" : "✦"}
                    </span>
                    {r.label}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">
                  <Download className="size-4" /> Download resume
                </Button>
                <Button variant="outline" className="flex-1">
                  <Sparkles className="size-4 text-accent-300" /> AI review
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-display text-base font-bold text-white">Education</h3>
              <div className="mt-4 space-y-4">
                {education.map((e, i) => (
                  <div key={e.role} className="relative flex gap-4 pl-1">
                    {i < education.length - 1 && (
                      <span className="absolute left-[13px] top-10 h-[calc(100%-1.5rem)] w-px bg-white/10" />
                    )}
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <GraduationCap className="size-3.5 text-brand-300" />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-bold text-white">{e.role}</p>
                      <p className="text-[12px] text-zinc-400">{e.org}</p>
                      <p className="text-[11px] text-zinc-600">{e.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

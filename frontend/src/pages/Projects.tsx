import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CircleAlert,
  ExternalLink,
  Eye,
  FileText,
  FolderGit2,
  GitCommitHorizontal,
  GitFork,
  Globe,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Ring } from "../components/Ring";
import { GithubIcon as OctoIcon } from "../components/brands";
import { CountUp, Reveal, Stagger, Item } from "../components/motion";
import { GlassCard, PageHeader, Progress, SearchInput, Badge } from "../components/ui";
import { ghStats, repos } from "../data/mock";
import { cn } from "../lib/utils";

const FEATURED_PILL = "rounded-full border border-brand-500/30 bg-brand-500/12 px-2 py-0.5 text-[10px] font-semibold text-brand-200";
const FEATURED_EMBLEM = (
  <span className="absolute -top-2.5 left-4 flex items-center gap-1">
    <span className={cn(FEATURED_PILL, "border-amber-500/30 bg-amber-500/15 text-amber-200")}>
      <Star className="size-2.5 fill-amber-300 text-amber-300" /> Featured
    </span>
  </span>
);

function StatTile({ icon, value, label, accent }: { icon: React.ReactNode; value: React.ReactNode; label: string; accent: string }) {
  return (
    <Item>
      <GlassCard className="relative overflow-hidden p-5">
        <div
          className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.14 }}
        />
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-xl" style={{ background: `${accent}1f`, color: accent }}>
            {icon}
          </span>
        </div>
        <p className="mt-3 font-display text-2xl font-bold text-white">{value}</p>
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/6">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, (Number(String(value).replace(/\D/g, "")) || 50) + 18)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="h-full rounded-full"
            style={{ background: accent }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </GlassCard>
    </Item>
  );
}

function RepoCard({ repo, i }: { repo: (typeof repos)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const scoreTone =
    repo.score >= 90 ? "text-emerald-300" : repo.score >= 75 ? "text-amber-300" : "text-rose-300";
  const scoreBar =
    repo.score >= 90 ? "from-emerald-500 to-emerald-400" : repo.score >= 75 ? "from-amber-500 to-amber-400" : "from-rose-500 to-rose-400";

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="list-none"
    >
      <GlassCard className="group relative flex h-full flex-col p-5">
        {repo.score >= 90 && FEATURED_EMBLEM}
        {/* head */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `linear-gradient(135deg, ${repo.langColor}33, ${repo.langColor}12)` }}
            >
              <FolderGit2 className="size-4.5" style={{ color: repo.langColor }} />
            </div>
            <div className="min-w-0">
              <a
                href={`https://github.com/karan-rana/${repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-display text-[15px] font-bold text-white transition-colors hover:text-brand-300"
              >
                {repo.name} <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />
              </a>
              <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <span className="inline-block size-2 rounded-full" style={{ background: repo.langColor }} />
                {repo.language} · updated {repo.updated}
              </p>
            </div>
          </div>
          <span className={cn("font-display text-lg font-bold", scoreTone)}>{repo.score}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-400">{repo.description}</p>

        {/* topics */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((t) => (
            <span key={t} className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[10.5px] text-zinc-400">
              #{t}
            </span>
          ))}
        </div>

        {/* metrics */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5 text-center">
            <p className="flex items-center justify-center gap-1 font-display text-[13px] font-bold text-white">
              <Star className="size-3 fill-amber-400/80 text-amber-400" /> {repo.stars}
            </p>
            <p className="text-[9.5px] uppercase tracking-wider text-zinc-500">stars</p>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5 text-center">
            <p className="flex items-center justify-center gap-1 font-display text-[13px] font-bold text-white">
              <GitFork className="size-3 text-sky-300" /> {repo.forks}
            </p>
            <p className="text-[9.5px] uppercase tracking-wider text-zinc-500">forks</p>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5 text-center">
            <p className="flex items-center justify-center gap-1 font-display text-[13px] font-bold text-white">
              <FileText className="size-3 text-brand-300" /> {repo.score >= 80 ? "Deep" : "Basic"}
            </p>
            <p className="text-[9.5px] uppercase tracking-wider text-zinc-500">readme</p>
          </div>
        </div>

        {/* quality bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10.5px] text-zinc-500">
            <span>Project quality</span>
            <span className="font-semibold text-zinc-300">{repo.score}/100</span>
          </div>
          <Progress value={repo.score} size="sm" gradient={scoreBar} />
        </div>

        {/* links row */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-1.5 text-[11.5px] font-semibold text-brand-300 transition-colors hover:text-brand-200"
          >
            <BookOpen className="size-3.5" /> README preview
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="inline-block text-[9px]">▼</motion.span>
          </button>
          {repo.demoUrl && (
            <a
              href={repo.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-semibold text-zinc-300 transition-colors hover:border-accent-500/40 hover:text-accent-300"
            >
              <Globe className="size-3" /> Live demo
            </a>
          )}
        </div>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-2 rounded-xl border border-white/8 bg-black/30 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-400">
            <span className="text-emerald-300">README.md</span>
            <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-zinc-300">{repo.readmePreview}</p>
          </div>
        </motion.div>
      </GlassCard>
    </motion.li>
  );
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("All");
  const languages = useMemo(() => ["All", ...Array.from(new Set(repos.map((r) => r.language)))], []);
  const filtered = useMemo(
    () =>
      repos.filter(
        (r) =>
          (lang === "All" || r.language === lang) &&
          (query.trim() === "" ||
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase()) ||
            r.topics.some((t) => t.includes(query.toLowerCase())))
      ),
    [query, lang]
  );

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const avgScore = Math.round(repos.reduce((s, r) => s + r.score, 0) / repos.length);
  const docsScore = Math.round(
    (repos.filter((r) => r.score >= 80).length / repos.length) * 100
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Projects"
          title="Your GitHub portfolio, analyzed"
          description="Repos are scored automatically on docs depth, README quality and traction — turn your GitHub into a placement-ready portfolio."
          actions={
            <Link
              to="/app/dsa"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[12.5px] font-semibold text-zinc-300 transition-colors hover:border-brand-500/30 hover:text-white sm:flex"
            >
              View DSA analytics <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />
      </Reveal>

      {/* GitHub account strip */}
      <Reveal delay={0.05}>
        <GlassCard className="relative overflow-hidden p-6" hover={false}>
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/5 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/12">
                <OctoIcon className="size-7 text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">karan-rana</p>
                <p className="text-[12.5px] text-zinc-500">github.com/karan-rana · 47 public repos · synced 2 min ago</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { icon: <GitCommitHorizontal className="size-3.5" />, k: `${ghStats.contributionsYear.toLocaleString()}`, v: "contributions" },
                { icon: <Star className="size-3.5" />, k: `${ghStats.stars}`, v: "stars earned" },
                { icon: <GitFork className="size-3.5" />, k: `${ghStats.forks}`, v: "forks" },
                { icon: <Users className="size-3.5" />, k: `${ghStats.followers}`, v: "followers" },
                { icon: <Eye className="size-3.5" />, k: `${ghStats.following}`, v: "following" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2 text-center">
                  <p className="flex items-center justify-center gap-1.5 font-display text-[15px] font-bold text-white">
                    {s.icon} {s.k}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* stat tiles */}
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<FolderGit2 className="size-4.5" />} value={ghStats.repos} label="Repositories" accent="#8a63ff" />
        <StatTile icon={<Star className="size-4.5" />} value={totalStars} label="Stars on top repos" accent="#ffb020" />
        <StatTile icon={<FileText className="size-4.5" />} value={`${docsScore}%`} label="Docs coverage" accent="#34d399" />
        <StatTile icon={<Trophy className="size-4.5" />} value={avgScore} label="Avg project score" accent="#45e6fb" />
      </Stagger>

      {/* repo grid */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <OctoIcon className="size-5" /> Repositories
            <span className="text-[12px] font-medium text-zinc-500">({filtered.length} of {repos.length})</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={query} onChange={setQuery} placeholder="Search repos, topics…" className="w-64" />
            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all active:scale-95",
                    lang === l
                      ? "border-brand-500/50 bg-brand-500/15 text-brand-200"
                      : "border-white/10 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <RepoCard key={r.name} repo={r} i={i} />
          ))}
        </ul>
        {filtered.length === 0 && (
          <GlassCard className="flex flex-col items-center justify-center gap-2 p-12 text-center" hover={false}>
            <CircleAlert className="size-6 text-zinc-600" />
            <p className="text-[13.5px] font-semibold text-zinc-300">No repositories match</p>
            <p className="text-[12px] text-zinc-500">Try a different search or clear the language filter.</p>
          </GlassCard>
        )}
      </div>

      {/* languages + quality */}
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 xl:col-span-5">
          <GlassCard className="h-full p-6">
            <h3 className="font-display text-base font-bold text-white">Top languages</h3>
            <p className="text-[12.5px] text-zinc-500">Across all public repos · by bytes of code</p>
            <ul className="mt-5 space-y-3.5">
              {ghStats.topLanguages.map((l, i) => (
                <li key={l.name} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 truncate text-[12px] font-medium text-zinc-300">
                    {l.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/6">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.pct * 2.4}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.06 }}
                      className="h-full rounded-full"
                      style={{ background: l.color }}
                    />
                  </div>
                  <span className="w-9 text-right font-mono text-[11px] font-semibold text-zinc-400">
                    {l.pct}%
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[12px] text-zinc-400">
              <span className="flex items-center gap-2">
                <Globe className="size-3.5 text-accent-300" /> Most used: TypeScript (38%)
              </span>
              <span className="font-semibold text-zinc-300">5 languages</span>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 xl:col-span-7">
          <GlassCard className="relative h-full overflow-hidden p-6" hover={false}>
            <div className="pointer-events-none absolute -right-12 -bottom-16 size-52 rounded-full bg-accent-500/12 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">Portfolio quality</h3>
                <p className="text-[12.5px] text-zinc-500">Docs · README depth · traction · consistency</p>
              </div>
              <Ring progress={86} size={84} stroke={8}>
                <span className="font-display text-xl font-bold text-white">86</span>
              </Ring>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Documentation", value: 86, bar: "from-emerald-500 to-emerald-400" },
                { label: "Project score", value: avgScore, bar: "from-brand-500 to-brand-400" },
                { label: "Traction", value: 74, bar: "from-amber-500 to-amber-400" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                  <div className="mb-1.5 flex justify-between text-[11px]">
                    <span className="text-zinc-400">{m.label}</span>
                    <span className="font-mono font-semibold text-zinc-200">{m.value}</span>
                  </div>
                  <Progress value={m.value} size="sm" gradient={m.bar} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-start gap-2.5 rounded-xl border border-accent-500/20 bg-accent-500/8 p-3.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <p className="text-[12px] leading-relaxed text-zinc-300">
                <span className="font-bold text-white">AI review lands in v2:</span> draft resume
                bullets, portfolio descriptions, README suggestions and per-project improvement
                ideas generated from this exact analysis.
              </p>
            </div>

            <Link
              to="/app/profile"
              className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] text-zinc-300 transition-colors hover:bg-white/[0.05]"
            >
              <span className="flex items-center gap-2">
                <Trophy className="size-4 text-amber-300" /> Career readiness — full breakdown on your profile
              </span>
              <span className="flex items-center gap-1 font-display text-base font-bold text-gradient">
                78% <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </GlassCard>
        </Reveal>
      </div>

      {/* top repos ranking */}
      <Reveal>
        <GlassCard className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <Trophy className="size-5 text-amber-300" /> Top repositories by score
          </h2>
          <p className="text-[12.5px] text-zinc-500">Ranked on docs depth, README quality, topics and traction</p>
          <ul className="mt-4 space-y-2.5">
            {[...repos]
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map((r, i) => (
                <motion.li
                  key={r.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg font-display text-[13px] font-bold",
                      i === 0
                        ? "bg-amber-500/15 text-amber-300"
                        : i === 1
                        ? "bg-zinc-500/15 text-zinc-200"
                        : i === 2
                        ? "bg-orange-500/12 text-orange-300"
                        : "bg-white/6 text-zinc-400"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-zinc-100">{r.name}</p>
                    <p className="truncate text-[11.5px] text-zinc-500">{r.description}</p>
                  </div>
                  <span className="hidden w-24 shrink-0 sm:block">
                    <Progress value={r.score} size="sm" />
                  </span>
                  <span className={cn("w-8 shrink-0 text-right font-mono text-[13px] font-bold", r.score >= 90 ? "text-emerald-300" : "text-zinc-200")}>
                    {r.score}
                  </span>
                </motion.li>
              ))}
          </ul>
        </GlassCard>
      </Reveal>
    </div>
  );
}

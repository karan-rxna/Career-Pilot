import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Layers, Rocket, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GithubIcon } from "../../components/brands";
import { EASE } from "../../components/motion";

const perks = [
  { icon: BrainCircuit, title: "Auto-analyzed progress", text: "Connect LeetCode, Codeforces & GitHub — stats sync themselves." },
  { icon: Layers, title: "One placement OS", text: "Contests, hackathons, goals, notes and roadmaps in a single workspace." },
  { icon: Trophy, title: "Built for the grind", text: "Streaks, weekly analytics and AI guidance keep you shipping daily." },
];

function Logo({ light = true }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-[0_8px_24px_-8px_rgba(138,99,255,0.9)]">
        <Rocket className="size-4.5 text-white" strokeWidth={2.4} />
      </div>
      <p className="font-display text-lg font-bold tracking-tight text-white">
        Career<span className={light ? "text-gradient" : "text-brand-300"}>Pilot</span>
      </p>
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="app-bg relative flex min-h-screen">
      {/* ambient orbs */}
      <div className="pointer-events-none fixed -left-32 top-[-10%] size-[30rem] rounded-full bg-brand-600/22 blur-[130px] motion-safe:animate-float-slow" />
      <div className="pointer-events-none fixed -right-24 top-1/3 size-[26rem] rounded-full bg-accent-500/12 blur-[120px] motion-safe:animate-float" />
      <div className="pointer-events-none fixed bottom-[-18%] left-1/3 size-[24rem] rounded-full bg-fuchsia-600/12 blur-[120px]" />

      {/* left branding panel */}
      <div className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden border-r border-white/6 p-12 lg:flex xl:p-16">
        <Link to="/" className="w-fit">
          <Logo />
        </Link>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="font-display text-[2.6rem] font-bold leading-[1.1] tracking-tight text-white xl:text-[3.1rem]"
          >
            Your placement journey,
            <br />
            <span className="text-gradient">orchestrated.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            className="mt-10 space-y-4"
          >
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300">
                  <p.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-[14.5px] font-semibold text-zinc-100">{p.title}</p>
                  <p className="mt-0.5 text-[13px] text-zinc-400">{p.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass flex items-center gap-6 rounded-2xl p-5"
        >
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">312+</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">DSA solved</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">1,284</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Contributions</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-gradient">Specialist</p>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Codeforces</p>
          </div>
          <div className="ml-auto hidden items-center gap-1.5 xl:flex">
            <BarChart3 className="size-4 text-zinc-600" />
            <GithubIcon className="size-4 text-zinc-600" />
            <Trophy className="size-4 text-zinc-600" />
          </div>
        </motion.div>
      </div>

      {/* right form panel */}
      <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-8 lg:hidden">
            <Link to="/" className="w-fit">
              <Logo />
            </Link>
          </div>
          <h2 className="font-display text-[26px] font-bold tracking-tight text-white">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-zinc-400">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}

export function OAuthButtons() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-[13.5px] font-medium text-zinc-200 transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98]">
          <svg className="size-4" viewBox="0 0 24 24">
            <path fill="#ea4335" d="M12 5.04c1.9 0 3.6.66 4.94 1.94l3.7-3.7C18.4 1.3 15.4 0 12 0 7.3 0 3.2 2.7 1.2 6.7l4.3 3.34C6.3 7.1 8.9 5.04 12 5.04z" />
            <path fill="#4285f4" d="M23.5 12.3c0-.8-.07-1.57-.2-2.3H12v4.35h6.45a5.2 5.2 0 0 1-2.26 3.41l3.86 3c2.26-2.1 3.45-5.17 3.45-8.46z" />
            <path fill="#fbbc04" d="M5.5 14.96a6.8 6.8 0 0 1 0-4.34L1.2 7.32a11.97 11.97 0 0 0 0 10.72l4.3-3.08z" />
            <path fill="#34a853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.1 0-5.7-2.06-6.63-4.82L1.2 18.06C3.2 22.06 7.3 24 12 24z" />
          </svg>
          Google
        </button>
        <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-[13.5px] font-medium text-zinc-200 transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98]">
          <GithubIcon className="size-4" />
          GitHub
        </button>
      </div>
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-600">
          or with email
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>
    </>
  );
}

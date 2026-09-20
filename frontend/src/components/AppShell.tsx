import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Briefcase,
  Flame,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Rocket,
  Search,
  Sparkles,
  StickyNote,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { user } from "../data/mock";
import { cn } from "../lib/utils";
import { EASE } from "./motion";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  match?: string;
}

const sections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [
      { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/dsa", label: "DSA Analytics", icon: BarChart3 },
      { to: "/app/projects", label: "Projects", icon: FolderGit2 },
    ],
  },
  {
    heading: "Placement",
    items: [
      { to: "/app/contests", label: "Contests", icon: Trophy },
      { to: "/app/hackathons", label: "Hackathons", icon: Rocket },
      { to: "/app/roadmaps", label: "Roadmaps", icon: MapIcon },
    ],
  },
  {
    heading: "Productivity",
    items: [
      { to: "/app/goals", label: "Goals", icon: Target },
      { to: "/app/notes", label: "Notes Vault", icon: StickyNote },
      { to: "/app/interview", label: "Interview Prep", icon: Briefcase },
    ],
  },
];

function Avatar({ className }: { className?: string }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-sm font-bold text-white",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${user.avatarHue} 85% 60%), hsl(${user.avatarHue + 45} 85% 45%))`,
      }}
    >
      {initials}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-[0_8px_24px_-8px_rgba(138,99,255,0.9)]">
        <Rocket className="size-4.5 text-white" strokeWidth={2.4} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-bold tracking-tight text-white">
          Career<span className="text-gradient">Pilot</span>
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
          Placement OS
        </p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
            {section.heading}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "relative z-10 size-4.5 transition-colors",
                          isActive ? "text-brand-300" : "text-zinc-500 group-hover:text-zinc-300"
                        )}
                      />
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <span className="absolute right-3 z-10 size-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(138,99,255,1)]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  const navigate = useNavigate();
  return (
    <div className="space-y-3 border-t border-white/6 p-3">
      <div className="border-glow relative overflow-hidden rounded-2xl p-3.5">
        <div className="absolute -right-6 -top-8 size-20 rounded-full bg-brand-500/25 blur-2xl" />
        <div className="relative flex items-start gap-2.5">
          <Sparkles className="mt-0.5 size-4 text-accent-300" />
          <div>
            <p className="text-[12.5px] font-semibold text-white">AI Copilot</p>
            <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">
              Next-question picks, weak-topic drills & revision plans land in v2.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-300">
              <span className="size-1 rounded-full bg-accent-400" /> In development
            </span>
          </div>
        </div>
      </div>
      <NavLink
        to="/app/profile"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-xl px-2 py-2 transition-colors",
            isActive ? "bg-white/6" : "hover:bg-white/5"
          )
        }
      >
        <Avatar className="size-9" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-semibold text-zinc-100">{user.name}</p>
          <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
        </div>
        <button
          aria-label="Sign out"
          onClick={() => navigate("/auth/login")}
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/8 hover:text-rose-300"
        >
          <LogOut className="size-4" />
        </button>
      </NavLink>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <Logo />
      </div>
      <NavList onNavigate={onNavigate} />
      <SidebarFooter />
    </>
  );
}

function CockpitClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${DAYS[now.getDay()]} ${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${String(now.getFullYear()).slice(2)}`;

  return (
    <div className="hidden items-center gap-3 rounded-xl border border-white/8 bg-black/40 px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:flex">
      <p className="font-mono text-[15px] font-bold tabular-nums leading-none tracking-wide text-emerald-300 [text-shadow:0_0_12px_rgba(52,211,153,0.45)]">
        {pad(now.getHours())}
        <span className="animate-pulse">:</span>
        {pad(now.getMinutes())}
        <span className="animate-pulse">:</span>
        {pad(now.getSeconds())}
      </p>
      <div className="leading-tight">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
          {date}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.22em] text-zinc-600">
          <span className="size-1 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
          local time
        </p>
      </div>
    </div>
  );
}
function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/6 bg-ink-950/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/6 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="relative hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Search problems, contests, notes…"
            className="w-full rounded-xl border border-white/8 bg-white/[0.04] py-2 pl-10 pr-16 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/40 focus:bg-white/[0.06] focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <CockpitClock />
          <div className="hidden items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[12.5px] font-semibold text-amber-300 sm:flex">
            <Flame className="size-3.5 fill-amber-400/80 text-amber-400" />
            23-day streak
          </div>
          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-white/8 bg-white/[0.04] p-2 text-zinc-400 transition-colors hover:bg-white/8 hover:text-white"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent-400 shadow-[0_0_6px_rgba(69,230,251,1)]" />
          </button>
          <button aria-label="Profile" className="transition-transform hover:scale-105">
            <Avatar className="size-9 ring-2 ring-white/10" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-bg min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/6 bg-ink-950/70 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/8 bg-ink-900 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between px-4 pt-4">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/6"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
        <footer className="px-6 pb-6 text-center text-[11px] text-zinc-600">
          CareerPilot v0.1 · built for the placement grind · made with 💜 by students, for students
        </footer>
      </div>
    </div>
  );
}

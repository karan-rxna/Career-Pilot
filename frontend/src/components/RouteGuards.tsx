import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { BrandMark, Tagline } from "./Logo";

/**
 * Shown while the session is being restored from the refresh cookie. Both
 * guards render it, so a guarded page never flashes before the redirect and a
 * signed-in user never sees the login form for a frame.
 */
export function BootScreen() {
  return (
    <div className="app-bg relative flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="pointer-events-none fixed -left-32 top-[-10%] size-[30rem] rounded-full bg-brand-600/22 blur-[130px] motion-safe:animate-float-slow" />
      <div className="pointer-events-none fixed -right-24 top-1/3 size-[26rem] rounded-full bg-accent-500/12 blur-[120px] motion-safe:animate-float" />

      <BrandMark className="relative size-20 drop-shadow-[0_20px_44px_rgba(59,107,255,0.4)]" />

      <div className="relative flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="size-4 animate-spin" />
          Warming up your cockpit…
        </div>
        <Tagline className="text-[9px] text-zinc-600" />
      </div>
    </div>
  );
}

/** Wraps the signed-in app: anonymous visitors are sent to login, remembering where they were headed. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <BootScreen />;
  if (status === "anonymous") {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return <>{children}</>;
}

/** Wraps the auth pages: a signed-in user has no business on the login form. */
export function RequireGuest({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") return <BootScreen />;
  if (status === "authenticated") return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}

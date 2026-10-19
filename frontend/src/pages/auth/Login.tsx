import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../lib/api";
import { useAuth } from "../../store/useAuth";
import { AuthShell, FormError, OAuthButtons } from "./AuthLayout";

/** Turns an API failure into something a student can act on. */
function loginError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "That email and password don't match. Check them and try again.";
    if (err.isOffline) return err.message;
    return err.firstFieldError ?? err.message;
  }
  return "Something went wrong on our side. Please try again.";
}

/**
 * Optional demo credentials, prefilled so signing in during a demo is one click.
 *
 * They come from `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD` in a gitignored `.env.local` rather than
 * from source, so no password ever enters the repository.
 *
 * The `import.meta.env.DEV` guard is load-bearing rather than decorative: Vite reads `.env.local`
 * for `vite build` as well as `vite dev`, so without it a local build would inline the password
 * into the production bundle. `DEV` is replaced by `false` at build time and the branch is dropped.
 */
const DEMO_EMAIL = import.meta.env.DEV ? (import.meta.env.VITE_DEMO_EMAIL ?? "") : "";
const DEMO_PASSWORD = import.meta.env.DEV ? (import.meta.env.VITE_DEMO_PASSWORD ?? "") : "";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  /** Where the route guard bounced the user from, so login sends them back there. */
  const from = (location.state as { from?: string } | null)?.from ?? "/app/dashboard";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(loginError(err));
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/50 focus:bg-white/[0.06] focus:outline-none disabled:opacity-60";

  return (
    <AuthShell
      title="Welcome back, pilot ✦"
      subtitle="Log in to continue your placement flight plan. Your streak is waiting."
      footer={
        <>
          New to CareerPilot?{" "}
          <Link to="/auth/register" className="font-semibold text-brand-300 hover:text-brand-200">
            Create an account
          </Link>
        </>
      }
    >
      <OAuthButtons />
      <FormError message={error} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-zinc-300">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-[13px] font-medium text-zinc-300">
              Password
            </label>
            <Link to="/auth/forgot" className="text-[12.5px] font-medium text-brand-300 hover:text-brand-200">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              id="login-password"
              name="password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:text-zinc-200"
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-bold text-white shadow-[0_14px_36px_-12px_rgba(138,99,255,0.9)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Preparing your cockpit…
            </>
          ) : (
            "Log in →"
          )}
        </button>
      </form>

      {import.meta.env.DEV && (
        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-zinc-600">
          Dev only: demo account <span className="text-zinc-400">{DEMO_EMAIL}</span> /{" "}
          <span className="text-zinc-400">{DEMO_PASSWORD}</span> — prefilled above, so just hit Log
          in. Register a new account any time.
        </p>
      )}
    </AuthShell>
  );
}

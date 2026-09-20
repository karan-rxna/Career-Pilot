import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, OAuthButtons } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("karan@careerpilot.app");
  const [password, setPassword] = useState("careerpilot123");

  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/app/dashboard"), 900);
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/50 focus:bg-white/[0.06] focus:outline-none";

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
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-zinc-300">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[13px] font-medium text-zinc-300">Password</label>
            <Link to="/auth/forgot" className="text-[12.5px] font-medium text-brand-300 hover:text-brand-200">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type={showPw ? "text" : "password"}
              required
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
    </AuthShell>
  );
}

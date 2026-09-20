import { motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, User } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, OAuthButtons } from "./AuthLayout";
import { cn } from "../../lib/utils";

function strengthOf(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
  return { score, label: labels[score] };
}

export default function Register() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState("");
  const strength = useMemo(() => strengthOf(pw), [pw]);
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/50 focus:bg-white/[0.06] focus:outline-none";

  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/app/dashboard"), 1000);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join thousands of students who stopped juggling 12 tabs and started piloting their placement."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-brand-300 hover:text-brand-200">
            Log in
          </Link>
        </>
      }
    >
      <OAuthButtons />
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              required
              placeholder="First name"
              className={cn(inputCls, "pl-10")}
            />
          </div>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input required placeholder="Last name" className={cn(inputCls, "pl-10")} />
          </div>
        </div>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input required type="email" placeholder="College email" className={inputCls} />
        </div>
        <div className="relative">
          <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input placeholder="College name (optional)" className={inputCls} />
        </div>
        <div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              required
              type={showPw ? "text" : "password"}
              placeholder="Create a password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
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
          {pw && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      backgroundColor:
                        strength.score > i
                          ? ["#ef4444", "#f59e0b", "#84cc16", "#22c55e"][strength.score - 1]
                          : "rgba(255,255,255,0.08)",
                    }}
                    className="h-1 flex-1 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  strength.score === 0 && "text-rose-400",
                  strength.score === 1 && "text-rose-400",
                  strength.score === 2 && "text-amber-300",
                  strength.score === 3 && "text-lime-400",
                  strength.score === 4 && "text-emerald-400"
                )}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-relaxed text-zinc-400">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 checked:border-brand-500 checked:bg-brand-500 checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%224%22%3E%3Cpath%20d=%22M5%2013l4%204L19%207%22/%3E%3C/svg%3E')]"
          />
          <span>
            I agree to the{" "}
            <span className="text-zinc-200 underline decoration-white/20 underline-offset-2">Terms</span>{" "}
            and{" "}
            <span className="text-zinc-200 underline decoration-white/20 underline-offset-2">
              Privacy Policy
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-bold text-white shadow-[0_14px_36px_-12px_rgba(138,99,255,0.9)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Launching your workspace…
            </>
          ) : (
            "Create free account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}

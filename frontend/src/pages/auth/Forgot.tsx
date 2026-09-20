import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./AuthLayout";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1100);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new password — no more frantic guessing."
      footer={
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Back to login
        </Link>
      }
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass flex flex-col items-center rounded-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
              className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"
            >
              <MailCheck className="size-7" />
            </motion.div>
            <h3 className="font-display text-lg font-bold text-white">Check your inbox</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Reset link sent to <span className="font-semibold text-zinc-200">{email}</span>. It
              expires in 30 minutes.
            </p>
            <Link
              to="/auth/login"
              className="mt-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Back to login
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -12 }}
            onSubmit={submit}
            className="space-y-4"
          >
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
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-brand-500/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-bold text-white shadow-[0_14px_36px_-12px_rgba(138,99,255,0.9)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-80"
            >
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending link…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

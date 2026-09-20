import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const levels = [
  "bg-white/[0.045]",
  "bg-brand-500/25",
  "bg-brand-500/50",
  "bg-brand-500/80",
  "bg-accent-400 shadow-[0_0_8px_rgba(69,230,251,0.55)]",
];

function monthLabels(weeks: number): (string | null)[] {
  const labels: (string | null)[] = [];
  for (let i = 0; i < weeks; i++) {
    const d = new Date(Date.now() - (weeks - 1 - i) * 7 * 86_400_000);
    const isWeekStart = (weeks - 1 - i) % 4 === 0 || i === weeks - 1;
    labels.push(isWeekStart ? d.toLocaleDateString("en-US", { month: "short" }) : null);
  }
  return labels;
}

export function Heatmap({
  data,
  className,
  animate = true,
}: {
  data: number[][];
  className?: string;
  animate?: boolean;
}) {
  const weeks = data.length;
  const days = 7;
  const labels = monthLabels(weeks);
  const total = data.reduce((s, col) => s + col.reduce((a, v) => a + v, 0), 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span>
          <span className="font-semibold text-zinc-300">{total.toLocaleString()}</span> contributions
          (last {Math.round((weeks * 7) / 30.4)} months)
        </span>
        <div className="flex items-center gap-1.5">
          <span>less</span>
          {levels.map((l) => (
            <span key={l} className={cn("size-2.5 rounded-[3px]", l)} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-max">
          <div className="mb-1 flex gap-[3px]">
            {labels.map((l, i) => (
              <div key={i} className="w-[11px] text-[9px] font-medium text-zinc-600">
                {l ?? ""}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {data.map((col, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {col.map((level, d) => {
                  const cell = (
                    <div
                      title={`${level === 0 ? "No" : level} contribution${level > 1 ? "s" : ""}`}
                      className={cn(
                        "size-[11px] rounded-[3px] transition-colors duration-200",
                        levels[Math.min(4, level)]
                      )}
                    />
                  );
                  return animate ? (
                    <motion.div
                      key={`${w}-${d}`}
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.3, delay: (w * 7 + d) * 0.0007 }}
                    >
                      {cell}
                    </motion.div>
                  ) : (
                    <div key={`${w}-${d}`}>{cell}</div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

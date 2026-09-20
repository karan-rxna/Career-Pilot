export function ChartTooltip({ active, payload, label, suffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3.5 py-2.5 text-xs shadow-2xl">
      {label && <p className="mb-1 font-semibold text-zinc-200">{label}</p>}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <p key={i} className="flex items-center gap-2 text-zinc-300">
            <span
              className="size-2 rounded-full"
              style={{ background: p.color ?? p.payload?.fill ?? "#8a63ff" }}
            />
            <span className="capitalize">{p.name}</span>
            <span className="ml-auto pl-4 font-semibold text-white">
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
              {suffix}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

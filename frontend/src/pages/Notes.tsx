import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  Eye,
  EyeOff,
  FileText,
  Pin,
  Plus,
  Search,
  StickyNote,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge, GlassCard, PageHeader } from "../components/ui";
import { Item, Reveal, Stagger } from "../components/motion";
import { initialNotes, type Note, type NoteCategory } from "../data/mock";
import { cn } from "../lib/utils";

const STORE = "careerpilot:notes";

const catTone: Record<NoteCategory, "brand" | "green" | "amber" | "cyan" | "neutral"> = {
  DSA: "brand",
  Java: "amber",
  Interview: "cyan",
  Revision: "green",
  General: "neutral",
};

const catColor: Record<NoteCategory, string> = {
  DSA: "bg-brand-500/12 text-brand-300 border-brand-500/25",
  Java: "bg-amber-500/12 text-amber-300 border-amber-500/25",
  Interview: "bg-accent-500/10 text-accent-300 border-accent-500/25",
  Revision: "bg-emerald-500/12 text-emerald-300 border-emerald-500/25",
  General: "bg-white/6 text-zinc-300 border-white/10",
};

/* tiny markdown renderer — headings, bullets, `code` and **bold** */
function inline(text: string): ReactNode[] {
  const parts = text.split("`");
  return parts.map((part, i) => {
    if (i % 2 === 1)
      return (
        <code key={i} className="rounded bg-white/8 px-1 py-0.5 font-mono text-[0.85em] text-accent-300">
          {part}
        </code>
      );
    const bold = part.split(/(\*\*[^*]+\*\*)/g).map((b, j) =>
      b.startsWith("**") && b.endsWith("**") ? (
        <strong key={j} className="font-semibold text-zinc-100">
          {b.slice(2, -2)}
        </strong>
      ) : (
        b
      )
    );
    return <span key={i}>{bold}</span>;
  });
}

function renderMarkdown(content: string): ReactNode[] {
  const out: ReactNode[] = [];
  let list: ReactNode[] = [];
  const flush = (key: string) => {
    if (list.length) {
      out.push(
        <ul key={key} className="mt-1.5 space-y-1 pl-1">
          {list.map((li, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-zinc-300">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brand-400" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  content.split("\n").forEach((line, idx) => {
    if (line.startsWith("## ")) {
      flush(`ul${idx}`);
      out.push(
        <h3 key={idx} className="mt-3 font-display text-[15px] font-bold text-white first:mt-0">
          {inline(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      list.push(inline(line.slice(2)));
    } else if (line.trim() === "") {
      flush(`ul${idx}`);
    } else {
      flush(`ul${idx}`);
      out.push(
        <p key={idx} className="text-[13.5px] leading-relaxed text-zinc-300">
          {inline(line)}
        </p>
      );
    }
  });
  flush("last");
  return out;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) return JSON.parse(raw) as Note[];
    } catch {
      /* ignore */
    }
    return initialNotes;
  });
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id ?? null);
  const [category, setCategory] = useState<"all" | NoteCategory>("all");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(notes));
  }, [notes]);

  const active = notes.find((n) => n.id === activeId) ?? null;

  const filtered = useMemo(() => {
    return [...notes]
      .sort((a, b) => Number(b.pinned) - Number(a.pinned))
      .filter((n) => (category === "all" ? true : n.category === category))
      .filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase())
      );
  }, [notes, category, query]);

  const open = (n: Note) => {
    setActiveId(n.id);
    setDraftTitle(n.title);
    setDraftBody(n.content);
  };

  const create = () => {
    const note: Note = {
      id: `n-${Date.now()}`,
      title: "Untitled note",
      category: "General",
      content: "",
      pinned: false,
      updatedAt: "just now",
    };
    setNotes((ns) => [note, ...ns]);
    open(note);
  };

  const save = () => {
    setNotes((ns) =>
      ns.map((n) =>
        n.id === activeId ? { ...n, title: draftTitle || "Untitled note", content: draftBody, updatedAt: "just now" } : n
      )
    );
  };

  const togglePin = (id: string) =>
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const remove = (id: string) => {
    setNotes((ns) => ns.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const countFor = (c: NoteCategory | "all") =>
    c === "all" ? notes.length : notes.filter((n) => n.category === c).length;

  const cats: ("all" | NoteCategory)[] = ["all", "DSA", "Java", "Interview", "Revision", "General"];

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader
          eyebrow="Notes Vault"
          title="Capture once, revise forever"
          description="Markdown-friendly notes for DSA patterns, Java internals, interview answers and revision — pinned notes float to the top."
          actions={
            <button
              onClick={create}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_-12px_rgba(138,99,255,0.8)] transition-all hover:brightness-110 active:scale-95"
            >
              <Plus className="size-4" /> New note
            </button>
          }
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* list column */}
        <div className="space-y-4 lg:col-span-2">
          <Stagger className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <Item key={c}>
                <button
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium capitalize transition-all active:scale-95",
                    category === c
                      ? "border-brand-500/50 bg-brand-500/15 text-brand-200"
                      : "border-white/10 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  )}
                >
                  {c === "all" ? "All" : c}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] font-bold",
                      category === c ? "bg-brand-500/30 text-brand-100" : "bg-white/8 text-zinc-500"
                    )}
                  >
                    {countFor(c)}
                  </span>
                </button>
              </Item>
            ))}
          </Stagger>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your notes…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-500/50 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <motion.button
                  layout
                  key={n.id}
                  onClick={() => open(n)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                    activeId === n.id
                      ? "border-brand-500/40 bg-brand-500/[0.08]"
                      : "border-white/8 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                      catColor[n.category]
                    )}
                  >
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13.5px] font-semibold text-white">{n.title}</p>
                      {n.pinned && <Pin className="size-3 shrink-0 fill-amber-400/80 text-amber-300" />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-zinc-500">
                      {n.content.replace(/^#+\s*/gm, "").replace(/[*`-]/g, "").slice(0, 140)}
                    </p>
                    <p className="mt-1.5 text-[10.5px] text-zinc-600">
                      {n.category} · updated {n.updatedAt}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <GlassCard className="p-6 text-center text-[12.5px] text-zinc-500">
                No notes here yet — hit “New note”.
              </GlassCard>
            )}
          </div>
        </div>

        {/* editor column */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="glass sticky top-24 rounded-2xl"
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-white/6 p-4">
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Note title"
                    className="min-w-0 flex-1 bg-transparent font-display text-lg font-bold text-white placeholder:text-zinc-600 focus:outline-none"
                  />
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      catColor[active.category]
                    )}
                  >
                    {active.category}
                  </span>
                  <button
                    onClick={() => togglePin(active.id)}
                    aria-label="Pin note"
                    className={cn(
                      "flex size-9 cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-90",
                      active.pinned
                        ? "border-amber-500/40 bg-amber-500/12 text-amber-300"
                        : "border-white/10 text-zinc-500 hover:text-zinc-200"
                    )}
                  >
                    <Pin className={cn("size-4", active.pinned && "fill-amber-400/70")} />
                  </button>
                  <button
                    onClick={() => remove(active.id)}
                    aria-label="Delete note"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 border-b border-white/6 px-4 py-2">
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 p-0.5">
                    <button
                      onClick={() => setPreview(false)}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                        !preview ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-200"
                      )}
                    >
                      <EyeOff className="size-3" /> Write
                    </button>
                    <button
                      onClick={() => setPreview(true)}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                        preview ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-200"
                      )}
                    >
                      <Eye className="size-3" /> Preview
                    </button>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <Code2 className="size-3.5" /> Markdown supported
                  </span>
                </div>

                <div className="p-4">
                  {preview ? (
                    <div className="min-h-[340px] space-y-0.5 rounded-xl border border-white/6 bg-ink-900/60 p-5">
                      {draftBody.trim() ? renderMarkdown(draftBody) : <p className="text-sm text-zinc-600">Nothing to preview yet.</p>}
                    </div>
                  ) : (
                    <textarea
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      placeholder={"Write in markdown…\n\n## Template\n- Point one\n- Point two\n\n`code` gets styled, **bold** works too."}
                      className="min-h-[340px] w-full resize-y rounded-xl border border-white/6 bg-ink-900/60 p-5 font-mono text-[13px] leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-brand-500/40 focus:outline-none"
                    />
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                      <StickyNote className="size-3.5" /> {active.updatedAt}
                    </span>
                    <button
                      onClick={save}
                      className="cursor-pointer rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
                    >
                      Save note
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="flex flex-col items-center gap-3 p-12 text-center">
                  <StickyNote className="size-8 text-zinc-600" />
                  <p className="text-sm font-semibold text-zinc-300">Select a note to edit</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

"""Generate the CareerPilot mid-evaluation presentation.

Usage:  python docs/presentation/build_deck.py
Writes: docs/presentation/CareerPilot_Presentation.pptx
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches

sys.path.insert(0, str(Path(__file__).parent))

from deck_kit import (  # noqa: E402
    AMBER, ASSETS, BG, BLUE, BLUE_SOFT, BORDER, CONTENT_BOTTOM, CONTENT_TOP, CW,
    CYAN, DIM, FONT, FONT_B, GREEN, ML, MONO, MUTED, PANEL, PANEL_HI, ROSE,
    SHOTS, SLATE, SLIDE_H, SLIDE_W, TEXT, VIOLET, WARNINGS, WHITE, arrow, card,
    dot, fit, glow, offslide, para, rect, rule, textbox,
)

OUT = Path(__file__).parent / "CareerPilot_Presentation.pptx"
MARK = ASSETS / "careerpilot-mark.png"
TOTAL = 18

STACK = Path(__file__).parent.parent.parent


# ---------------------------------------------------------------- helpers ----
def write(slide, x, y, w, h, lines, *, anchor=MSO_ANCHOR.TOP, label=None):
    """Text box. ``lines`` is a list of ``(runs, opts)``; runs may be a str."""
    tb, tf = textbox(slide, x, y, w, h, anchor=anchor)
    joined, pts = [], []
    for i, (runs, opts) in enumerate(lines):
        para(tf, runs, first=(i == 0), **opts)
        items = [(runs, {})] if isinstance(runs, str) else runs
        joined.append("".join(t for t, _ in items))
        pts.append(max([o.get("size", opts.get("size", 11)) for _, o in items] or [11]))
    if label:
        need = sum(fit(label, t, p, False, w, 99.0) for t, p in zip(joined, pts))
        if need > h + 0.03:
            WARNINGS.append(f"OVERFLOW {label}: {need:.2f}in in {h:.2f}in box")
    offslide(label or "text", x, y, w, h)
    return tb


def chip(slide, x, y, w, h, text, *, fill=PANEL_HI, colour=TEXT, size=9.5, align=PP_ALIGN.CENTER, border_alpha=13):
    rect(slide, x, y, w, h, fill=fill, line=BORDER, line_alpha=border_alpha, rounded=True, radius=0.34)
    write(slide, x, y, w, h, [(text, {"colour": colour, "size": size})], anchor=MSO_ANCHOR.MIDDLE)
    _centre(slide, x, y, w, h, align)


def _centre(slide, x, y, w, h, align):
    """Re-align the just-added text box (helper keeps chip() signature small)."""
    tf = slide.shapes[-1].text_frame
    for p in tf.paragraphs:
        p.alignment = align


def base(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    rect(s, 0, 0, SLIDE_W, SLIDE_H, fill=BG, line=None)
    return s


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def furniture(s, idx, kicker, title, subtitle=None, title_size=26):
    glow(s, 1.5, 0.8, 3.0, BLUE, 5)
    glow(s, 11.8, 6.8, 3.0, VIOLET, 4)

    s.shapes.add_picture(str(MARK), Inches(ML), Inches(0.34), height=Inches(0.30))
    write(
        s, ML + 0.40, 0.34, 3.0, 0.30,
        [([("Career", {"colour": WHITE, "bold": True, "size": 12}),
           ("Pilot", {"colour": BLUE_SOFT, "bold": True, "size": 12})], {})],
        anchor=MSO_ANCHOR.MIDDLE,
    )
    write(s, ML, 0.96, CW, 0.22,
          [(kicker.upper(), {"colour": BLUE_SOFT, "size": 9.5, "bold": True, "spc": 1.6})])
    write(s, ML, 1.16, CW, 0.66,
          [(title, {"colour": WHITE, "bold": True, "size": title_size})], label=f"s{idx} title")
    rule(s, ML, 1.88, 1.5)

    top = CONTENT_TOP
    if subtitle:
        write(s, ML, 1.99, CW, 0.26, [(subtitle, {"colour": MUTED, "size": 11.5})],
              label=f"s{idx} subtitle")
        top = 2.34

    rect(s, ML, 6.92, CW, 0.012, fill=BORDER, alpha=9, line=None)
    write(s, ML, 7.03, 8.0, 0.22,
          [("CareerPilot  ·  Mid-Evaluation Progress Review", {"colour": DIM, "size": 8.5})])
    write(s, SLIDE_W - ML - 2.5, 7.03, 2.5, 0.22,
          [([(f"{idx:02d}", {"colour": MUTED, "size": 8.5, "bold": True}),
             (f"  /  {TOTAL}", {"colour": DIM, "size": 8.5})], {"align": PP_ALIGN.RIGHT})])
    return top


def shot(s, name, x, y, w, h, *, caption=None, tint=BLUE):
    p = SHOTS / name
    iw, ih = Image.open(p).size
    ar = iw / ih
    if w / h >= ar:
        ww, hh = h * ar, h
    else:
        ww, hh = w, w / ar
    left, top = x + (w - ww) / 2, y + (h - hh) / 2
    glow(s, x + w / 2, y + h / 2, max(ww, hh) * 0.60, tint, 6)
    s.shapes.add_picture(str(p), Inches(left), Inches(top), Inches(ww), Inches(hh))
    rect(s, left, top, ww, hh, fill=None, line=BORDER, line_alpha=26, line_w=1.0)
    if caption:
        write(s, x, top + hh + 0.11, w, 0.26,
              [(caption, {"colour": MUTED, "size": 10})],
              anchor=MSO_ANCHOR.TOP, label=f"cap {name}")


# ------------------------------------------------------------------ slides ---
def s01_title(prs):
    s = base(prs)
    glow(s, 3.0, 4.2, 4.6, BLUE, 8)
    glow(s, 10.6, 5.6, 4.0, VIOLET, 6)

    s.shapes.add_picture(str(MARK), Inches(0.85), Inches(1.72), height=Inches(2.2))

    x = 3.50
    write(s, x, 1.92, 9.4, 0.95,
          [([("Career", {"colour": WHITE, "size": 50, "bold": True}),
             ("Pilot", {"colour": BLUE_SOFT, "size": 50, "bold": True})], {})],
          label="title wordmark")
    write(s, x + 0.06, 2.96, 9.0, 0.26,
          [([("PLAN", {"colour": MUTED, "size": 10, "bold": True, "spc": 2.0}),
             ("   ·   ", {"colour": CYAN, "size": 10, "bold": True}),
             ("PREPARE", {"colour": MUTED, "size": 10, "bold": True, "spc": 2.0}),
             ("   ·   ", {"colour": CYAN, "size": 10, "bold": True}),
             ("PERFORM", {"colour": MUTED, "size": 10, "bold": True, "spc": 2.0}),
             ("   ·   ", {"colour": CYAN, "size": 10, "bold": True}),
             ("SUCCEED", {"colour": MUTED, "size": 10, "bold": True, "spc": 2.0})], {})])

    rule(s, x + 0.06, 3.42, 2.6)

    write(s, x + 0.06, 3.70, 8.6, 0.34,
          [("Mid-Evaluation Progress Review", {"colour": WHITE, "size": 17, "bold": True})])
    write(s, x + 0.06, 4.16, 8.6, 0.30,
          [("Karan Rana  ·  B.Tech Computer Science & Engineering  ·  2nd Year",
            {"colour": TEXT, "size": 12})])
    write(s, x + 0.06, 4.50, 8.6, 0.30,
          [("Madhav Institute of Technology and Science, Gwalior", {"colour": MUTED, "size": 12})])

    rect(s, x + 0.06, 5.02, 5.4, 0.012, fill=BORDER, alpha=12, line=None)
    write(s, x + 0.06, 5.20, 8.6, 0.26,
          [([("github.com/karan-rxna/Career-Pilot", {"colour": BLUE_SOFT, "size": 10, "font": MONO})], {})])

    write(s, ML, 6.90, 9.0, 0.24,
          [("All-in-one student preparation & placement platform", {"colour": DIM, "size": 9.5})])
    write(s, SLIDE_W - ML - 2.5, 6.90, 2.5, 0.24,
          [("01  /  18", {"colour": MUTED, "size": 8.5, "bold": True})], )

    notes(s, "Open plainly: CareerPilot is a placement-preparation workspace for engineering "
             "students. It does not list opportunities — it reads the progress a student is already "
             "generating on the platforms they already use, and turns it into analytics, a plan and "
             "a portfolio. This review covers the problem, the objectives, the architecture and "
             "exactly what is built and verified so far.")


def s02_contents(prs):
    s = base(prs)
    furniture(s, 2, "Contents", "What this review covers",
              "Ten areas, from the problem to the plan for the next milestone.")

    items = [
        "Introduction", "Problem Statement", "Objectives",
        "Motive", "Technology Stack", "System Architecture",
        "Database Design", "Authentication & Security", "Current Status",
        "Product Walkthrough", "Roadmap & Future Scope", "Conclusion",
    ]
    cw_ = (CW - 2 * 0.24) / 3
    ch = (4.30 - 3 * 0.16) / 4
    for i, label in enumerate(items):
        col, row = i % 3, i // 3
        x = ML + col * (cw_ + 0.24)
        y = 2.20 + row * (ch + 0.16)
        card(s, x, y, cw_, ch)
        write(s, x + 0.22, y, 0.7, ch,
              [(f"{i + 1:02d}", {"colour": BLUE_SOFT, "size": 13, "bold": True, "font": MONO})],
              anchor=MSO_ANCHOR.MIDDLE)
        write(s, x + 0.86, y, cw_ - 1.0, ch,
              [(label, {"colour": TEXT, "size": 12})], anchor=MSO_ANCHOR.MIDDLE,
              label=f"contents {i}")

    notes(s, "Signpost the structure so the invigilator knows where you are going. "
             "Flag up front that the last third is about what is already verified and what comes "
             "next — that is where the questions usually land.")


def s03_intro(prs):
    s = base(prs)
    top = furniture(
        s, 3, "01 · Introduction", "One workspace for the whole placement journey",
        "CareerPilot connects to the platforms a student already uses, reads the progress already "
        "there, and turns it into analytics, a plan and a portfolio.")
    del top

    write(s, ML, 2.92, CW, 0.60,
          [("Existing tools stop at listing opportunities. CareerPilot starts where they stop — "
            "with the student's own activity.", {"colour": TEXT, "size": 13})],
          label="intro lede")

    cw_ = (CW - 2 * 0.26) / 3
    cards = [
        ("Portals only list", "Placement portals publish openings, but offer no path from "
                              "'interested' to 'ready'.", AMBER),
        ("Trackers make you type", "DSA trackers ask the student to mark problems solved by hand, "
                                   "so they go stale within a week.", ROSE),
        ("Evidence is scattered", "Solved counts, contest ratings and commits live on separate "
                                  "platforms with no single view.", CYAN),
    ]
    for i, (t, body, col) in enumerate(cards):
        x = ML + i * (cw_ + 0.26)
        card(s, x, 3.80, cw_, 2.00)
        dot(s, x + 0.30, 4.06, 0.11, col)
        write(s, x + 0.56, 3.99, cw_ - 0.86, 0.30,
              [(t, {"colour": WHITE, "size": 13.5, "bold": True})])
        write(s, x + 0.30, 4.44, cw_ - 0.60, 1.15,
              [(body, {"colour": MUTED, "size": 10.5})], label=f"intro card {i}")

    write(s, ML, 6.06, CW, 0.40,
          [([("The answer: ", {"colour": MUTED, "size": 11.5}),
             ("one dashboard that reads what you have already done and plans what to do next.",
              {"colour": TEXT, "size": 11.5, "bold": True})], {})],
          label="intro strip")

    notes(s, "The single sentence that matters: portals list, CareerPilot prepares. "
             "If asked 'isn't this just LeetCode plus a dashboard?' — no, LeetCode reports what you "
             "did on LeetCode. CareerPilot is the only place where DSA progress, contest rating, "
             "GitHub activity and the placement plan sit in one model.")


def s04_problem(prs):
    s = base(prs)
    furniture(s, 4, "02 · Problem Statement", "Preparation is fragmented, and progress is invisible")

    cw_ = (CW - 0.30) / 2
    rows = [
        ("Opportunities without preparation",
         "Placement portals post jobs and internships, but nothing helps a student become the "
         "candidate who gets shortlisted.", ROSE),
        ("Manual, self-reported DSA tracking",
         "Every DSA tracker depends on the student marking problems solved — and rots the moment "
         "they stop.", AMBER),
        ("No unified progress view",
         "Platform statistics live in silos, so weak topics stay invisible until an interview "
         "exposes them.", CYAN),
        ("Scattered placement material",
         "Contests, hackathons, roadmaps, notes and interview preparation sit in unrelated tools "
         "and browser tabs.", VIOLET),
    ]
    for i, (t, body, col) in enumerate(rows):
        col_i, row_i = i % 2, i // 2
        x = ML + col_i * (cw_ + 0.30)
        y = 2.20 + row_i * (1.75 + 0.20)
        card(s, x, y, cw_, 1.75)
        rect(s, x, y + 0.22, 0.045, 0.72, fill=col, alpha=100, line=None, rounded=True, radius=0.5)
        write(s, x + 0.34, y + 0.26, cw_ - 0.66, 0.30,
              [(t, {"colour": WHITE, "size": 13, "bold": True})], label=f"problem h {i}")
        write(s, x + 0.34, y + 0.70, cw_ - 0.66, 0.82,
              [(body, {"colour": MUTED, "size": 10.5})], label=f"problem b {i}")

    write(s, ML, 6.08, CW, 0.42,
          [([("The gap: ", {"colour": BLUE_SOFT, "size": 11.5, "bold": True}),
             ("students are already generating the data — it is simply never assembled into a "
              "picture they can act on.", {"colour": TEXT, "size": 11.5})], {})],
          label="problem strip")

    notes(s, "Frame this as an information problem, not a motivation problem. Students are working "
             "hard; the data exists but is scattered across four platforms. That framing is what "
             "makes the solution obviously worth building rather than another to-do app.")


def s05_objectives(prs):
    s = base(prs)
    furniture(s, 5, "03 · Objectives", "Six concrete objectives for version 1")

    cw_ = (CW - 2 * 0.26) / 3
    ch = 1.92
    items = [
        ("Unify analytics", "One dashboard for DSA progress, GitHub activity and contest "
                            "performance."),
        ("Auto-sync progress", "Connect a profile and statistics update themselves — no manual "
                               "entry anywhere."),
        ("Plan the work", "Goals, roadmaps and a daily plan derived from real activity."),
        ("Surface opportunities", "Contests and hackathons, searchable, filterable and "
                                  "bookmarkable."),
        ("Centralise knowledge", "A notes vault and a categorised interview-preparation hub."),
        ("Be AI-ready", "An architecture where recommendations need no rework to switch on."),
    ]
    for i, (t, body) in enumerate(items):
        col, row = i % 3, i // 3
        x = ML + col * (cw_ + 0.26)
        y = 2.20 + row * (ch + 0.22)
        card(s, x, y, cw_, ch)
        write(s, x + 0.28, y + 0.22, cw_ - 0.56, 0.26,
              [(f"0{i + 1}", {"colour": BLUE_SOFT, "size": 11, "bold": True, "font": MONO})])
        write(s, x + 0.28, y + 0.56, cw_ - 0.56, 0.34,
              [(t, {"colour": WHITE, "size": 13, "bold": True})], label=f"obj h {i}")
        write(s, x + 0.28, y + 1.00, cw_ - 0.56, 0.76,
              [(body, {"colour": MUTED, "size": 10.5})], label=f"obj b {i}")

    notes(s, "Objectives 1–5 are the product. Objective 6 is the engineering promise: the database "
             "already has the tables and the AI endpoints are already in the API contract, so "
             "switching AI on is configuration plus one adapter, not a rewrite.")


def s06_motive(prs):
    s = base(prs)
    furniture(s, 6, "04 · Motive", "Why I am building this")

    cw_ = (CW - 2 * 0.26) / 3
    cards = [
        ("Built from the inside", "As a 2nd-year CSE student preparing for placements, every "
                                  "problem in this deck is one I have hit myself."),
        ("Practice without proof is invisible", "A recruiter sees a résumé, not the 300 problems "
                                                "behind it. Progress needs to be presentable."),
        ("Consistency needs feedback", "Streaks, heatmaps and weekly analytics turn daily practice "
                                       "into something sustainable."),
    ]
    for i, (t, body) in enumerate(cards):
        x = ML + i * (cw_ + 0.26)
        card(s, x, 2.20, cw_, 2.30)
        glow(s, x + cw_ / 2, 2.36, 1.2, BLUE, 7)
        write(s, x + 0.30, 2.48, cw_ - 0.60, 0.56,
              [(t, {"colour": WHITE, "size": 14, "bold": True})], label=f"motive h {i}")
        write(s, x + 0.30, 3.20, cw_ - 0.60, 1.10,
              [(body, {"colour": MUTED, "size": 10.5})], label=f"motive b {i}")

    card(s, ML, 4.80, CW, 1.55, fill=PANEL_HI)
    rect(s, ML + 0.02, 4.94, 0.05, 1.25, fill=VIOLET, alpha=100, line=None, rounded=True, radius=0.5)
    write(s, ML + 0.52, 5.06, CW - 1.1, 0.60,
          [("“The problem was never a lack of effort — it was never having one place to see it.”",
            {"colour": TEXT, "size": 16, "bold": True})], label="motive quote")
    write(s, ML + 0.52, 5.74, CW - 1.1, 0.30,
          [("That sentence is the whole product requirement.", {"colour": MUTED, "size": 11})])

    notes(s, "This slide exists to answer 'why you, why this'. Keep it personal and short. "
             "The strongest point is the résumé one: students do the work but cannot show it, and "
             "that is a solvable engineering problem.")


def s07_stack(prs):
    s = base(prs)
    furniture(s, 7, "05 · Technology Stack", "Chosen for the job each layer actually does")

    cols = [
        ("Frontend", BLUE, [
            "React 19", "Vite 8", "TypeScript", "Tailwind CSS v4",
            "React Router 7", "Framer Motion", "Recharts", "lucide-react",
        ], "Type-safe SPA with a component model that keeps 11 feature screens maintainable."),
        ("Backend", VIOLET, [
            "Java 21", "Spring Boot 4.1", "Spring Security", "JWT (HS256)",
            "Spring Data JPA", "Bean Validation", "Flyway", "Maven",
        ], "Batteries-included REST API: dependency injection, security and transactions built in."),
        ("Data", CYAN, [
            "PostgreSQL 17 (Neon)", "Hibernate · validate", "23 tables",
            "Flyway V1 + V2", "127 seed rows", "HikariCP pooling", "TIMESTAMPTZ (UTC)",
            "JSONB snapshots",
        ], "Managed Postgres with branching and scale-to-zero; Flyway owns every schema change."),
        ("Delivery", GREEN, [
            "Docker (multi-stage)", "GitHub Actions CI", "Render (API)",
            "Vercel (SPA)", "Actuator health", "Neon pooled URL",
        ], "Both halves deploy from main; a free-tier stack that still mirrors production."),
    ]
    cw_ = (CW - 3 * 0.22) / 4
    for i, (name, col, items, why) in enumerate(cols):
        x = ML + i * (cw_ + 0.22)
        card(s, x, 2.20, cw_, 4.30)
        rect(s, x + 0.24, 2.44, 0.10, 0.10, fill=col, alpha=100, line=None, shape=MSO_SHAPE.OVAL)
        write(s, x + 0.44, 2.36, cw_ - 0.68, 0.28,
              [(name, {"colour": WHITE, "size": 13.5, "bold": True})])
        rect(s, x + 0.24, 2.74, cw_ - 0.48, 0.012, fill=BORDER, alpha=12, line=None)
        y = 2.90
        for it in items:
            chip(s, x + 0.24, y, cw_ - 0.48, 0.29, it, size=9.5)
            y += 0.345
        write(s, x + 0.24, 5.52, cw_ - 0.48, 0.86,
              [(why, {"colour": MUTED, "size": 9.5})], label=f"stack why {name}")

    notes(s, "Do not read the chips out loud — point at the layers and talk about choices. "
             "The two worth defending: Flyway instead of Hibernate DDL, because schema changes must "
             "be reviewable; and validate mode, so the app refuses to boot when an entity drifts "
             "from the table rather than silently corrupting data.")


def s08_architecture(prs):
    s = base(prs)
    furniture(s, 8, "06 · System Architecture", "Three tiers, one contract")

    main_w = 8.30
    rail_x = ML + main_w + 0.35
    rail_w = CW - main_w - 0.35

    # --- tier 1: client
    card(s, ML, 2.20, main_w, 1.02)
    write(s, ML + 0.28, 2.32, main_w - 0.56, 0.26,
          [("CLIENT", {"colour": BLUE_SOFT, "size": 9, "bold": True, "spc": 1.4})])
    write(s, ML + 0.28, 2.58, 3.2, 0.26,
          [("React 19 SPA", {"colour": WHITE, "size": 13, "bold": True})])
    for i, t in enumerate(["Route guards", "fetch client + auto-refresh", "Recharts · Framer Motion"]):
        chip(s, ML + 3.70 + i * 1.50, 2.58, 1.42, 0.30, t, size=8.5)

    arrow(s, ML + main_w / 2 - 0.14, 3.28, 0.28, colour=BLUE, alpha=80)
    write(s, ML + main_w / 2 + 0.24, 3.24, 3.6, 0.26,
          [("HTTPS  ·  JSON  ·  Bearer JWT", {"colour": MUTED, "size": 9.5, "font": MONO})])

    # --- tier 2: API
    card(s, ML, 3.66, main_w, 1.62)
    write(s, ML + 0.28, 3.78, main_w - 0.56, 0.26,
          [("API  ·  SPRING BOOT 4  ·  JAVA 21", {"colour": BLUE_SOFT, "size": 9, "bold": True, "spc": 1.4})])
    bw = (main_w - 0.56 - 3 * 0.22) / 4
    boxes = ["Security\nfilter chain", "Controllers\n@RestController",
             "Services\nownership rules", "Repositories\nSpring Data JPA"]
    for i, b in enumerate(boxes):
        bx = ML + 0.28 + i * (bw + 0.22)
        rect(s, bx, 4.14, bw, 0.94, fill=PANEL_HI, line=BORDER, line_alpha=13, rounded=True, radius=0.10)
        write(s, bx + 0.10, 4.14, bw - 0.20, 0.94,
              [(b.replace("\n", " "), {"colour": TEXT, "size": 9.5})], anchor=MSO_ANCHOR.MIDDLE,
              label=f"arch box {i}")
        if i < 3:
            arrow(s, bx + bw + 0.03, 4.50, 0.16, direction="right", colour=BLUE, alpha=70)

    arrow(s, ML + main_w / 2 - 0.14, 5.36, 0.28, colour=BLUE, alpha=80)
    write(s, ML + main_w / 2 + 0.24, 5.32, 3.6, 0.26,
          [("JDBC  ·  HikariCP  ·  SSL", {"colour": MUTED, "size": 9.5, "font": MONO})])

    # --- tier 3: database
    card(s, ML, 5.74, main_w, 0.92)
    write(s, ML + 0.28, 5.86, main_w - 0.56, 0.26,
          [("DATA", {"colour": BLUE_SOFT, "size": 9, "bold": True, "spc": 1.4})])
    write(s, ML + 0.28, 6.12, 3.6, 0.26,
          [("PostgreSQL on Neon", {"colour": WHITE, "size": 13, "bold": True})])
    for i, t in enumerate(["23 tables", "Flyway V1+V2", "scale-to-zero"]):
        chip(s, ML + 4.10 + i * 1.40, 6.10, 1.32, 0.30, t, size=8.5)

    # --- right rail: delivery
    card(s, rail_x, 2.20, rail_w, 4.46)
    write(s, rail_x + 0.24, 2.34, rail_w - 0.48, 0.26,
          [("DELIVERY", {"colour": GREEN, "size": 9, "bold": True, "spc": 1.4})])
    steps = [
        ("GitHub Actions", "build + test on every push"),
        ("Docker image", "multi-stage, backend only"),
        ("Render", "API · /actuator/health"),
        ("Vercel", "React SPA build"),
        ("Neon", "pooled connection, SSL"),
    ]
    y = 2.72
    for i, (t, sub) in enumerate(steps):
        rect(s, rail_x + 0.24, y, rail_w - 0.48, 0.66, fill=PANEL_HI, line=BORDER,
             line_alpha=12, rounded=True, radius=0.12)
        write(s, rail_x + 0.38, y + 0.09, rail_w - 0.76, 0.24,
              [(t, {"colour": TEXT, "size": 10.5, "bold": True})])
        write(s, rail_x + 0.38, y + 0.34, rail_w - 0.76, 0.24,
              [(sub, {"colour": MUTED, "size": 8.5})], label=f"rail {t}")
        if i < len(steps) - 1:
            arrow(s, rail_x + rail_w / 2 - 0.07, y + 0.68, 0.14, colour=GREEN, alpha=55)
        y += 0.80

    notes(s, "Walk the request path once, left to right, then top to bottom: browser → security "
             "filter → controller → service → repository → Postgres. The important point is the "
             "middle tier — ownership is enforced in the service layer, so the user id always comes "
             "from the token's subject claim, never from a URL or request body. It is therefore "
             "structurally impossible for one account to read another's rows.")


def s09_database(prs):
    s = base(prs)
    furniture(s, 9, "07 · Database Design", "23 tables, all under migration control")

    lw = 5.95
    rx_ = ML + lw + 0.34
    rw = CW - lw - 0.34

    write(s, ML, 2.14, lw, 0.24,
          [("IN USE TODAY", {"colour": GREEN, "size": 9, "bold": True, "spc": 1.4})])
    live = [
        ("users", "id · email (unique) · password_hash · name · handle · college · batch · headline · readiness_score · role · timestamps"),
        ("user_skills", "user_id → users · skill · proficiency — the profile's skill list"),
        ("refresh_tokens", "token_hash · user_id · expires_at · revoked_at — rotated on every use"),
        ("password_reset_tokens", "token_hash · user_id · expires_at · used_at — single-use, 60 min"),
    ]
    y = 2.46
    for name, cols in live:
        card(s, ML, y, lw, 0.90)
        write(s, ML + 0.26, y + 0.16, 2.2, 0.26,
              [(name, {"colour": WHITE, "size": 11.5, "bold": True, "font": MONO})])
        write(s, ML + 0.26, y + 0.44, lw - 0.52, 0.38,
              [(cols, {"colour": MUTED, "size": 8.5})], label=f"db {name}")
        y += 1.00

    write(s, rx_, 2.14, rw, 0.24,
          [("DESIGNED & SEEDED — 19 MORE", {"colour": AMBER, "size": 9, "bold": True, "spc": 1.4})])
    card(s, rx_, 2.46, rw, 3.90)
    groups = [
        ("Coding & portfolio", "platform_accounts · coding_snapshots · topic_stats · repos · activity_events"),
        ("Productivity", "goals · notes · bookmarks · daily_plans · daily_plan_items"),
        ("Learning", "roadmaps · roadmap_stages · roadmap_resources · roadmap_progress"),
        ("Interview & discovery", "interview_categories · interview_topics · interview_progress · contests · hackathons"),
    ]
    y = 2.70
    for title, tables in groups:
        write(s, rx_ + 0.26, y, rw - 0.52, 0.24,
              [(title, {"colour": BLUE_SOFT, "size": 10.5, "bold": True})])
        write(s, rx_ + 0.26, y + 0.26, rw - 0.52, 0.52,
              [(tables, {"colour": MUTED, "size": 8.5})], label=f"db group {title}")
        y += 0.92

    strip = ["23 tables", "2 Flyway migrations", "127 seed rows",
             "Flyway owns DDL", "ddl-auto = validate", "TIMESTAMPTZ stored in UTC"]
    sw = (CW - 5 * 0.14) / 6
    for i, t in enumerate(strip):
        chip(s, ML + i * (sw + 0.14), 6.42, sw, 0.34, t, size=9,
             fill=PANEL_HI, colour=TEXT)

    notes(s, "Two design decisions to defend here. First, Flyway owns the schema and Hibernate runs "
             "in validate mode, so the app refuses to start if an entity drifts from its table — "
             "that converts a silent data-corruption class of bug into a startup error. Second, the "
             "19 unused tables are not dead weight: they are the contract already written down, "
             "seeded with 127 rows of real content, so each feature is a vertical slice rather than "
             "a schema redesign.")


def s10_auth(prs):
    s = base(prs)
    furniture(s, 10, "08 · Authentication & Security", "Login, then a session that survives a reload")

    lanes = ["Browser", "Spring API", "Security filter", "PostgreSQL"]
    lw = (CW - 3 * 0.16) / 4
    centres = []
    for i, name in enumerate(lanes):
        x = ML + i * (lw + 0.16)
        centres.append(x + lw / 2)
        rect(s, x, 2.20, lw, 0.42, fill=PANEL_HI, line=BORDER, line_alpha=14,
             rounded=True, radius=0.30)
        write(s, x, 2.20, lw, 0.42, [(name, {"colour": WHITE, "size": 10.5, "bold": True})],
              anchor=MSO_ANCHOR.MIDDLE)
        _centre(s, x, 2.20, lw, 0.42, PP_ALIGN.CENTER)
        rect(s, centres[-1] - 0.005, 2.62, 0.01, 4.10, fill=BORDER, alpha=9, line=None)

    msgs = [
        (0, 1, "POST /api/auth/login  { email, password }"),
        (1, 3, "SELECT user WHERE email = ?"),
        (1, 2, "BCrypt.matches(raw, password_hash)"),
        (1, 0, "200 · access JWT (15 min)  +  httpOnly refresh cookie (30 d, rotated)"),
        (0, 1, "GET /api/users/me   Authorization: Bearer <jwt>"),
        (1, 2, "verify signature · read user id from sub claim"),
        (0, 1, "401 expired  →  POST /api/auth/refresh  →  200 new token  →  replay request"),
        (0, 1, "POST /api/auth/logout  →  204 · refresh row revoked"),
    ]
    y = 2.86
    ahead = 0.15
    for i, (a, b, label) in enumerate(msgs):
        x1, x2 = centres[a], centres[b]
        left = min(x1, x2)
        colour = BLUE if i in (0, 4, 6, 7) else (VIOLET if i in (1, 3) else CYAN)
        if x2 > x1:
            # Arrowhead sits on the receiving lifeline, pointing right.
            arrow(s, x2 - ahead, y + 0.09, ahead, direction="right", colour=colour, alpha=80)
            rect(s, x1, y + 0.165, x2 - x1 - ahead, 0.02, fill=colour, alpha=60, line=None)
        else:
            arrow(s, x1, y + 0.09, ahead, direction="left", colour=colour, alpha=80)
            rect(s, x2 + ahead, y + 0.165, x1 - x2 - ahead, 0.02, fill=colour, alpha=60, line=None)
        write(s, left, y - 0.06, SLIDE_W - ML - left, 0.22,
              [(label, {"colour": TEXT, "size": 9})], label=f"auth step {i}")
        y += 0.44

    write(s, ML, 6.62, CW, 0.26,
          [([("Access token lives in memory only — never localStorage — so an XSS payload cannot "
              "read it.", {"colour": MUTED, "size": 9.5})], {})])

    notes(s, "The two things to emphasise. One: the access token is kept in memory and never in "
             "localStorage, which is exactly why the httpOnly refresh cookie is load-bearing — a "
             "reload restores the session through a refresh call rather than a stored credential. "
             "Two: refresh tokens are rotated and single-use, so a stolen refresh token is "
             "detectable because reusing it fails. Expect the question 'why not just a long-lived "
             "JWT?' — answer: because it cannot be revoked, whereas this design has a server-side "
             "revocation point.")


def s11_status(prs):
    s = base(prs)
    furniture(s, 11, "09 · Current Status", "What is verified, what is seeded, what is next",
              "Stated precisely — the deeper feature screens still render mock data by design.")

    cw_ = (CW - 2 * 0.26) / 3
    cols = [
        ("LIVE & VERIFIED", GREEN, [
            "Register · login · refresh · logout",
            "Forgot & reset password (single-use)",
            "GET · PATCH /api/users/me",
            "GET /api/users/me/stats",
            "23-table schema applied on Neon",
            "BCrypt ($2a$10$) password hashing",
            "JWT + rotated httpOnly refresh cookie",
            "Route guards · 401 for anonymous",
            "GitHub Actions CI green",
        ]),
        ("DESIGNED & SEEDED", AMBER, [
            "goals · notes · bookmarks",
            "daily_plans · daily_plan_items",
            "roadmaps (+ stages, resources, progress)",
            "interview categories, topics, progress",
            "contests · hackathons",
            "127 seed rows already loaded",
            "Endpoints defined in the API contract",
            "Frontend screens already built",
            "Mock data layer still in use",
        ]),
        ("NEXT MILESTONES", SLATE, [
            "Goals vertical slice (real DB reads/writes)",
            "Feature fan-out across all 11 sections",
            "Platform sync: GitHub · Codeforces · LeetCode",
            "Rule-based recommendations + daily plan",
            "AI layer: portfolio review, README, bullets",
            "Retire mock.ts entirely",
            "Production deploy: Vercel + Render",
            "Rate limits, monitoring, backups",
            "Root README + LICENSE",
        ]),
    ]
    for i, (title, col, items) in enumerate(cols):
        x = ML + i * (cw_ + 0.26)
        card(s, x, 2.46, cw_, 3.86)
        rect(s, x + 0.26, 2.68, 0.11, 0.11, fill=col, alpha=100, line=None, shape=MSO_SHAPE.OVAL)
        write(s, x + 0.46, 2.60, cw_ - 0.72, 0.26,
              [(title, {"colour": col, "size": 9.5, "bold": True, "spc": 1.3})])
        rect(s, x + 0.26, 2.96, cw_ - 0.52, 0.012, fill=BORDER, alpha=11, line=None)
        y = 3.10
        for it in items:
            dot(s, x + 0.30, y + 0.055, 0.075, col)
            write(s, x + 0.48, y, cw_ - 0.76, 0.28,
                  [(it, {"colour": MUTED, "size": 9.5})], label=f"status {title} {it[:18]}")
            y += 0.315

    notes(s, "This is the honesty slide and it is deliberate. Say plainly: the authentication and "
             "data layer is production-shaped and verified end to end; the feature endpoints are "
             "designed and seeded but not yet exposed; the UI is built ahead of the API against a "
             "frozen contract. Invigilators reward a candidate who knows exactly where their own "
             "boundary is — and it pre-empts 'so does the dashboard work?', which you want to "
             "answer before they ask it.")


def s12_shot_dashboard(prs):
    s = base(prs)
    furniture(s, 12, "10 · Product Walkthrough", "The dashboard: everything in one screen")

    shot(s, "02-dashboard.png", ML, 2.30, 8.35, 4.30)

    x = ML + 8.70
    w = CW - 8.70
    points = [
        ("Welcome & pace", "Goal pace, streak and a nudge, computed from the week's activity."),
        ("Daily flight plan", "A short, achievable checklist for today — not a backlog."),
        ("Stat tiles", "Problems solved, contest rating, GitHub contributions, day streak."),
        ("GitHub heatmap", "Contribution graph with longest streak and top language."),
        ("Contests & roadmaps", "What's coming up, and where you are in each learning path."),
    ]
    y = 2.30
    for t, body in points:
        card(s, x, y, w, 0.80)
        write(s, x + 0.22, y + 0.12, w - 0.44, 0.24,
              [(t, {"colour": WHITE, "size": 10.5, "bold": True})])
        write(s, x + 0.22, y + 0.38, w - 0.44, 0.38,
              [(body, {"colour": MUTED, "size": 8.5})], label=f"dash point {t}")
        y += 0.88

    write(s, ML, 6.66, CW, 0.24,
          [("Real screenshot from the running build — the sidebar, top bar and avatar all resolve "
            "from the live API.", {"colour": DIM, "size": 8.5})])

    notes(s, "Point at five things, no more. The most persuasive detail is the top-right clock and "
             "the streak chip — small touches that make it feel like a product rather than a "
             "college project. Be ready to say which numbers are live (the user identity) and which "
             "are still mock (the statistics), because that question will come.")


def s13_shot_analytics(prs):
    s = base(prs)
    furniture(s, 13, "10 · Product Walkthrough", "DSA analytics and the GitHub portfolio analyzer",
              "These two pages replaced a single combined 'coding analytics' screen — the data they "
              "show has different refresh rates and different owners.")

    cw_ = (CW - 0.34) / 2
    shot(s, "03-dsa.png", ML, 2.62, cw_, 3.20, tint=CYAN)
    write(s, ML, 5.92, cw_, 0.66,
          [([("DSA Analytics — ", {"colour": WHITE, "size": 11, "bold": True}),
             ("platform cards per profile, difficulty split, topic intelligence with weak-topic "
              "flags, Codeforces rating trend, practice heatmap, and a reserved card for AI "
              "recommendations.", {"colour": MUTED, "size": 10})], {})],
          label="dsa caption")

    x2 = ML + cw_ + 0.34
    shot(s, "04-projects.png", x2, 2.62, cw_, 3.20, tint=VIOLET)
    write(s, x2, 5.92, cw_, 0.66,
          [([("Projects — ", {"colour": WHITE, "size": 11, "bold": True}),
             ("GitHub statistics, a repo grid with live-demo and source links, language breakdown, "
              "and portfolio-quality scoring across documentation and structure.", {"colour": MUTED, "size": 10})], {})],
          label="projects caption")

    notes(s, "Explain the split deliberately: DSA is a fast-moving, per-platform time series, while "
             "a portfolio changes slowly and is analysed as a document set. Merging them produced a "
             "screen that did neither job well, so they are separate routes driven by separate "
             "data. This shows product judgement, which is what separates a build from a project.")


def s14_shot_planner(prs):
    s = base(prs)
    furniture(s, 14, "10 · Product Walkthrough", "Planning and discovery surfaces")

    cw_ = (CW - 0.30) / 2
    ch = 1.72
    panes = [
        ("05-goals.png", "Goals", "Progress, deadlines, priority and status — with completion "
                                  "percentages that update from linked activity.", GREEN),
        ("06-roadmaps.png", "Roadmaps", "Curated Java Backend, Full Stack, AI, DevOps and "
                                        "Competitive Programming paths with staged progress.", VIOLET),
        ("07-contests.png", "Contests", "A single timeline across LeetCode, Codeforces, CodeChef "
                                        "and AtCoder, with start times and bookmarks.", CYAN),
        ("08-hackathons.png", "Hackathons", "Search and filter by mode, team size, theme and prize "
                                            "pool, with bookmarks and admin management.", AMBER),
    ]
    for i, (name, title, body, col) in enumerate(panes):
        col_i, row_i = i % 2, i // 2
        x = ML + col_i * (cw_ + 0.30)
        y = 2.20 + row_i * (ch + 1.28)
        shot(s, name, x, y, cw_ * 0.46, ch, tint=col)
        write(s, x + cw_ * 0.50, y + 0.06, cw_ * 0.50, 0.26,
              [(title, {"colour": WHITE, "size": 12.5, "bold": True})])
        write(s, x + cw_ * 0.50, y + 0.40, cw_ * 0.50, 1.20,
              [(body, {"colour": MUTED, "size": 10})], label=f"planner {title}")

    notes(s, "Move quickly here — these are the productivity surfaces, and the argument is breadth: "
             "goals, roadmaps, contests and hackathons all live behind the same navigation, the same "
             "design system and the same data contract. Notes and the interview hub are two more "
             "screens built the same way.")


def s15_roadmap(prs):
    s = base(prs)
    furniture(s, 15, "11 · Roadmap & Future Scope", "Where the build stands, stage by stage")

    # progress bar
    rect(s, ML, 2.24, CW, 0.16, fill=PANEL_HI, line=BORDER, line_alpha=10, rounded=True, radius=0.5)
    done_w = CW * 0.40
    bar = rect(s, ML, 2.24, done_w, 0.16, fill=BLUE, line=None, rounded=True, radius=0.5)
    write(s, ML, 2.46, 6.0, 0.22,
          [("Stages 0–3 complete  ·  roughly 40% of the planned build", {"colour": TEXT, "size": 9.5})])
    write(s, CW - 4.0 + ML, 2.46, 4.0, 0.22,
          [("8–10 weeks part-time remaining", {"colour": MUTED, "size": 9.5})])

    stages = [
        ("0", "Contracts & docs", "done"), ("1", "Database & migrations", "done"),
        ("2", "Backend skeleton", "done"), ("3", "Auth & identity", "done"),
        ("4", "Goals vertical slice", "next"), ("5", "Feature fan-out", "planned"),
        ("6", "Platform sync engine", "planned"), ("7", "Recommendations", "planned"),
        ("8", "AI layer", "planned"), ("9", "Hardening & ship", "planned"),
    ]
    colours = {"done": GREEN, "next": BLUE_SOFT, "planned": SLATE}
    cw_ = (CW - 4 * 0.17) / 5
    for i, (num, name, state) in enumerate(stages):
        col, row = i % 5, i // 5
        x = ML + col * (cw_ + 0.17)
        y = 2.90 + row * (1.62 + 0.22)
        card(s, x, y, cw_, 1.62)
        dot(s, x + 0.24, y + 0.26, 0.11, colours[state])
        write(s, x + 0.44, y + 0.19, cw_ - 0.68, 0.26,
              [(f"STAGE {num}", {"colour": colours[state], "size": 8.5, "bold": True, "spc": 1.2})])
        write(s, x + 0.24, y + 0.60, cw_ - 0.48, 0.60,
              [(name, {"colour": WHITE, "size": 12, "bold": True})], label=f"stage {num}")
        tag = {"done": "Verified", "next": "In progress", "planned": "Planned"}[state]
        chip(s, x + 0.24, y + 1.16, cw_ - 0.48, 0.28, tag, size=8.5, colour=colours[state],
             fill=PANEL_HI)

    write(s, ML, 6.44, CW, 0.26,
          [("Milestone 1 (Stages 0–3) is complete and verified. Milestone 2 begins with the Goals "
            "vertical slice, which proves the full browser → API → database path on real data.",
            {"colour": MUTED, "size": 9.5})], label="roadmap footer")

    notes(s, "Be explicit that stages 0–3 are done *and verified*, not merely written. Explain why "
             "auth came first: every later feature inherits ownership rules and the request pipeline "
             "from it, so building it after the features would mean retrofitting security into "
             "eleven screens. The Goals slice is next because it proves Vercel → Render → Neon end "
             "to end with real writes.")


def s16_future(prs):
    s = base(prs)
    furniture(s, 16, "11 · Future Scope", "What version 2 unlocks")

    cw_ = (CW - 4 * 0.18) / 5
    items = [
        ("AI recommendation engine", "Next question to solve, weak-topic drills, a weekly practice "
                                     "plan and a revision schedule.", VIOLET),
        ("Live platform sync", "Codeforces, GitHub and LeetCode pulled on a schedule into "
                               "time-series snapshots, with a 'synced X ago' badge.", BLUE),
        ("AI portfolio review", "Resume bullets, README suggestions and project improvements "
                                "generated from real repository data.", CYAN),
        ("Career readiness score", "A single score built from solved problems, contest rating, "
                                   "portfolio quality and interview coverage.", GREEN),
        ("Harden & scale", "Rate limits, lazy-loaded routes to cut the bundle, monitoring, PITR "
                           "backups and a separate production environment.", AMBER),
    ]
    for i, (t, body, col) in enumerate(items):
        x = ML + i * (cw_ + 0.18)
        card(s, x, 2.20, cw_, 3.30)
        rect(s, x + 0.22, 2.42, 0.42, 0.05, fill=col, alpha=100, line=None, rounded=True, radius=0.5)
        write(s, x + 0.22, 2.62, cw_ - 0.44, 0.82,
              [(t, {"colour": WHITE, "size": 12, "bold": True})], label=f"future h {i}")
        write(s, x + 0.22, 3.56, cw_ - 0.44, 1.80,
              [(body, {"colour": MUTED, "size": 9.5})], label=f"future b {i}")

    write(s, ML, 5.66, CW, 0.50,
          [([("The AI layer is deliberately last, and deliberately optional. ",
              {"colour": TEXT, "size": 11, "bold": True}),
             ("Stage 7 is a rule-based engine that produces the same recommendations "
              "deterministically — so recommendations work, and keep working, with no model in the "
              "loop. AI then explains and personalises them; it never invents the numbers.",
              {"colour": MUTED, "size": 11})], {})], label="future strip")

    notes(s, "The line to land: deterministic analytics stay deterministic, and AI only explains and "
             "suggests. If the invigilator asks 'what if the AI is wrong?', the answer is that no "
             "number on any screen depends on a model — the rule-based engine is the permanent "
             "fallback, and the AI layer adds prose on top of computed facts.")


def s17_conclusion(prs):
    s = base(prs)
    furniture(s, 17, "12 · Conclusion", "What this milestone establishes")

    cw_ = (CW - 2 * 0.26) / 3
    cards = [
        ("The foundation is real", "A 23-table schema on managed Postgres, a secured REST API and a "
                                   "complete authentication lifecycle — all running, not sketched.",
         GREEN),
        ("The contract is frozen", "Every endpoint, request body and error code for all eleven "
                                   "feature areas is written down, so features are built against "
                                   "an agreed interface.", BLUE),
        ("The UI is ahead by design", "Eleven screens are already built against that contract, "
                                      "which is why swapping mock data for live data is a "
                                      "data-layer change, not a rewrite.", VIOLET),
    ]
    for i, (t, body, col) in enumerate(cards):
        x = ML + i * (cw_ + 0.26)
        card(s, x, 2.20, cw_, 2.50)
        rect(s, x + 0.28, 2.44, 0.44, 0.05, fill=col, alpha=100, line=None, rounded=True, radius=0.5)
        write(s, x + 0.28, 2.66, cw_ - 0.56, 0.56,
              [(t, {"colour": WHITE, "size": 14, "bold": True})], label=f"concl h {i}")
        write(s, x + 0.28, 3.34, cw_ - 0.56, 1.20,
              [(body, {"colour": MUTED, "size": 10.5})], label=f"concl b {i}")

    card(s, ML, 4.96, CW, 1.42, fill=PANEL_HI)
    glow(s, ML + 2.4, 5.30, 2.2, BLUE, 7)
    write(s, ML + 0.55, 5.16, CW - 1.1, 0.60,
          [("CareerPilot is not another opportunity board or manual DSA tracker — it is the "
            "workspace that reads what a student has already done and turns it into a plan.",
            {"colour": TEXT, "size": 15, "bold": True})], label="concl strip")
    write(s, ML + 0.55, 5.86, CW - 1.1, 0.30,
          [("Next: finish the feature slices on this foundation, then switch on the "
            "recommendation engine.", {"colour": MUTED, "size": 11})])

    notes(s, "Close on the engineering story, not the feature list: schema under migration control, "
             "authentication verified in both directions, a frozen API contract and a UI built "
             "against it. Then state the next step concretely — the Goals vertical slice — so the "
             "reviewer leaves knowing exactly what comes next.")


def s18_thanks(prs):
    s = base(prs)
    glow(s, 4.0, 4.0, 4.6, BLUE, 8)
    glow(s, 10.4, 5.4, 4.0, VIOLET, 6)

    s.shapes.add_picture(str(MARK), Inches(1.05), Inches(2.05), height=Inches(2.1))

    x = 3.30
    write(s, x, 2.30, 9.0, 0.90,
          [("Thank you", {"colour": WHITE, "size": 46, "bold": True})])
    write(s, x, 3.24, 9.0, 0.34,
          [("Questions and discussion", {"colour": BLUE_SOFT, "size": 17})])
    rule(s, x, 3.78, 2.4)

    write(s, x, 4.08, 9.0, 0.30,
          [("Karan Rana  ·  B.Tech Computer Science & Engineering  ·  2nd Year",
            {"colour": TEXT, "size": 12})])
    write(s, x, 4.42, 9.0, 0.30,
          [("Madhav Institute of Technology and Science, Gwalior", {"colour": MUTED, "size": 12})])
    write(s, x, 4.88, 9.0, 0.28,
          [([("github.com/karan-rxna/Career-Pilot", {"colour": BLUE_SOFT, "size": 11, "font": MONO})], {})])

    write(s, ML, 6.90, 9.0, 0.24,
          [("Plan  ·  Prepare  ·  Perform  ·  Succeed", {"colour": DIM, "size": 9.5, "bold": True, "spc": 1.6})])
    write(s, SLIDE_W - ML - 2.5, 6.90, 2.5, 0.24,
          [("18  /  18", {"colour": MUTED, "size": 8.5, "bold": True})])

    notes(s, "Stop talking and invite questions — the deck has already made the argument. Have the "
             "running app open in a second window so you can jump straight to a live login and the "
             "dashboard rather than describing it.")


SLIDES = [
    s01_title, s02_contents, s03_intro, s04_problem, s05_objectives, s06_motive,
    s07_stack, s08_architecture, s09_database, s10_auth, s11_status,
    s12_shot_dashboard, s13_shot_analytics, s14_shot_planner, s15_roadmap,
    s16_future, s17_conclusion, s18_thanks,
]


def main() -> int:
    if not MARK.exists():
        print(f"missing brand mark: {MARK}\nrun: python docs/presentation/brand.py")
        return 1

    prs = Presentation()
    prs.slide_width = Inches(SLIDE_W)
    prs.slide_height = Inches(SLIDE_H)
    for fn in SLIDES:
        fn(prs)

    prs.core_properties.title = "CareerPilot — Mid-Evaluation Progress Review"
    prs.core_properties.author = "Karan Rana"
    prs.core_properties.subject = "All-in-one student preparation & placement platform"

    prs.save(OUT)
    print(f"wrote {OUT.name}: {len(prs.slides.__iter__.__self__._sldIdLst)} slides")

    if WARNINGS:
        print(f"\n{len(WARNINGS)} layout warning(s):")
        for w in WARNINGS:
            print("  -", w)
    else:
        print("layout audit: clean")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

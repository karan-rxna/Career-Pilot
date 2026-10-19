"""Shared theme + drawing kit for the CareerPilot presentation.

Everything is drawn with native PowerPoint shapes so the deck stays editable.
Text is measured with the real Segoe UI font files so overflow can be detected
before the deck is ever opened.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFont
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

# ------------------------------------------------------------------ layout ---
SLIDE_W = 13.3333
SLIDE_H = 7.5
ML = 0.62  # left margin
CW = SLIDE_W - 2 * ML  # content width
CONTENT_TOP = 2.06
CONTENT_BOTTOM = 6.72

# ------------------------------------------------------------------ palette --
BG = "05050B"
PANEL = "0D0D16"
PANEL_HI = "14141F"
BORDER = "FFFFFF"
WHITE = "FFFFFF"
TEXT = "E8E9F0"
MUTED = "9A9CAB"
DIM = "6B6D7C"
CYAN = "7FD4FF"
BLUE = "2F7DFF"
BLUE_SOFT = "4F8CFF"
VIOLET = "9D3BFF"
GREEN = "34D399"
AMBER = "FBBF24"
ROSE = "FB7185"
SLATE = "6B7280"

FONT = "Segoe UI"
FONT_B = "Segoe UI Semibold"
MONO = "Consolas"

ASSETS = Path(__file__).parent / "assets"
SHOTS = Path(__file__).parent / "shots"

_FONT_FILES = {
    (False, False): r"C:\Windows\Fonts\segoeui.ttf",
    (True, False): r"C:\Windows\Fonts\segoeuib.ttf",
    (False, True): r"C:\Windows\Fonts\consola.ttf",
    (True, True): r"C:\Windows\Fonts\consolab.ttf",
}

WARNINGS: list[str] = []


# ------------------------------------------------------------------ colour ---
def rgb(hexstr: str) -> RGBColor:
    return RGBColor.from_string(hexstr)


def _srgb(shape, inside_line: bool = False):
    spPr = shape._element.spPr
    holder = spPr.find(qn("a:ln")) if inside_line else spPr
    if holder is None:
        return None
    fill = holder.find(qn("a:solidFill"))
    if fill is None:
        return None
    return fill.find(qn("a:srgbClr"))


def set_fill_alpha(shape, pct: float) -> None:
    """pct 0-100. OOXMLalpha is in thousandths of a percent."""
    el = _srgb(shape)
    if el is None:
        return
    for old in el.findall(qn("a:alpha")):
        el.remove(old)
    el.append(el.makeelement(qn("a:alpha"), {"val": str(int(pct * 1000))}))


def set_line_alpha(shape, pct: float) -> None:
    el = _srgb(shape, inside_line=True)
    if el is None:
        return
    for old in el.findall(qn("a:alpha")):
        el.remove(old)
    el.append(el.makeelement(qn("a:alpha"), {"val": str(int(pct * 1000))}))


def _strip_shadow(shape) -> None:
    try:
        shape.shadow.inherit = False
    except Exception:  # noqa: BLE001 - some shapes have no shadow element
        pass


# ------------------------------------------------------------------ shapes ---
def rect(
    slide,
    x,
    y,
    w,
    h,
    *,
    fill=None,
    alpha=100,
    line=None,
    line_alpha=100,
    line_w=0.75,
    rounded=False,
    radius=0.06,
    shape=MSO_SHAPE.RECTANGLE,
):
    shp = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if rounded else shape,
        Inches(x),
        Inches(y),
        Inches(w),
        Inches(h),
    )
    if rounded:
        try:
            shp.adjustments[0] = radius
        except Exception:  # noqa: BLE001
            pass
    if fill is None:
        shp.fill.background()
    else:
        shp.fill.solid()
        shp.fill.fore_color.rgb = rgb(fill)
        set_fill_alpha(shp, alpha)
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = rgb(line)
        shp.line.width = Pt(line_w)
        set_line_alpha(shp, line_alpha)
    _strip_shadow(shp)
    return shp


def card(slide, x, y, w, h, *, fill=PANEL, alpha=100, border=BORDER, border_alpha=13, radius=0.09):
    return rect(
        slide,
        x,
        y,
        w,
        h,
        fill=fill,
        alpha=alpha,
        line=border,
        line_alpha=border_alpha,
        rounded=True,
        radius=radius,
    )


def glow(slide, cx, cy, r, colour=BLUE, alpha=7):
    """Soft ambient halo behind hero content."""
    return rect(
        slide,
        cx - r,
        cy - r,
        r * 2,
        r * 2,
        fill=colour,
        alpha=alpha,
        line=None,
        rounded=True,
        radius=0.5,
    )


def rule(slide, x, y, w, h=0.045, colour=None):
    """Accent rule under a title."""
    colour = colour or BLUE
    shp = rect(slide, x, y, w, h, fill=colour, line=None, rounded=True, radius=0.5)
    spPr = shp._element.spPr
    solid = spPr.find(qn("a:solidFill"))
    srgb = solid.find(qn("a:srgbClr"))
    for old in srgb.findall(qn("a:alpha")):
        srgb.remove(old)
    grad_lst = srgb.makeelement(qn("a:gradFill"), {})
    # Replace the flat fill with a cyan -> blue -> violet gradient.
    gs_lst = grad_lst.makeelement(qn("a:gsLst"), {})
    for pos, col in ((0, CYAN), (50000, BLUE), (100000, VIOLET)):
        gs = grad_lst.makeelement(qn("a:gs"), {"pos": str(pos)})
        c = grad_lst.makeelement(qn("a:srgbClr"), {"val": col})
        gs.append(c)
        gs_lst.append(gs)
    grad_lst.append(gs_lst)
    lin = grad_lst.makeelement(qn("a:lin"), {"ang": "0", "scaled": "1"})
    grad_lst.append(lin)
    solid.getparent().replace(solid, grad_lst)
    return shp


_ARROWS = {
    "down": MSO_SHAPE.DOWN_ARROW,
    "right": MSO_SHAPE.RIGHT_ARROW,
    "left": MSO_SHAPE.LEFT_ARROW,
    "up": MSO_SHAPE.UP_ARROW,
}


def arrow(slide, x, y, size=0.30, *, direction="down", colour=BLUE, alpha=85):
    return rect(
        slide,
        x,
        y,
        size,
        size,
        fill=colour,
        alpha=alpha,
        line=None,
        shape=_ARROWS[direction],
    )


def dot(slide, x, y, d=0.10, colour=BLUE):
    return rect(slide, x, y, d, d, fill=colour, line=None, shape=MSO_SHAPE.OVAL)


# ------------------------------------------------------------------- text ----
def textbox(slide, x, y, w, h, *, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    return tb, tf


def para(
    tf,
    runs,
    *,
    size=11,
    colour=TEXT,
    bold=False,
    font=None,
    align=PP_ALIGN.LEFT,
    space_before=0,
    space_after=0,
    line_spacing=None,
    first=False,
    spc=None,
):
    """``runs`` is a str or a list of (text, overrides) tuples."""
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.alignment = align
    if space_before:
        p.space_before = Pt(space_before)
    if space_after:
        p.space_after = Pt(space_after)
    if line_spacing:
        p.line_spacing = line_spacing
    items = [(runs, {})] if isinstance(runs, str) else runs
    for text, ov in items:
        run = p.add_run()
        run.text = text
        f = run.font
        f.name = ov.get("font", font or FONT)
        f.size = Pt(ov.get("size", size))
        f.bold = ov.get("bold", bold)
        f.color.rgb = rgb(ov.get("colour", colour))
        spacing = ov.get("spc", spc)
        if spacing is not None:
            run.font._rPr.set("spc", str(int(spacing * 100)))
        # East-asian/complex-script fonts so PowerPoint never substitutes.
        rPr = run.font._rPr
        for tag in ("a:latin", "a:cs"):
            el = rPr.find(qn(tag))
            if el is None:
                el = rPr.makeelement(qn(tag), {})
                rPr.append(el)
            el.set("typeface", ov.get("font", font or FONT))
    return p


def fit(label, text, pt, bold, w_in, h_in, *, font=None, line_factor=1.24):
    """Flag text that will not fit its box, measured with the real font file."""
    lines = wrap_lines(text, pt, bold, w_in, font=font)
    needed = len(lines) * pt * line_factor / 72.0
    if needed > h_in + 0.012:
        WARNINGS.append(
            f"OVERFLOW {label}: needs {needed:.2f}in, box {h_in:.2f}in ({len(lines)} lines)"
        )
    if len(lines) > 1 and "\n" not in text and needed > h_in + 0.012:
        WARNINGS.append(f"  text: {text[:90]!r}")
    return needed


_font_cache: dict = {}


def _font(pt: float, bold: bool, mono: bool):
    key = (round(pt, 1), bold, mono)
    if key not in _font_cache:
        path = _FONT_FILES[(bold, mono)]
        _font_cache[key] = ImageFont.truetype(path, max(int(round(pt * 96 / 72)), 6))
    return _font_cache[key]


def text_width(text: str, pt: float, bold: bool = False, font=None) -> float:
    """Width in points."""
    f = _font(pt, bold, font == MONO)
    return f.getlength(text) * 72.0 / 96.0


def wrap_lines(text: str, pt: float, bold: bool, w_in: float, font=None) -> list[str]:
    """Greedy wrap at the given width, honouring explicit newlines."""
    max_pt = w_in * 72.0
    out: list[str] = []
    for hard in text.split("\n"):
        words = hard.split()
        if not words:
            out.append("")
            continue
        line = words[0]
        for wd in words[1:]:
            trial = f"{line} {wd}"
            if text_width(trial, pt, bold, font) <= max_pt:
                line = trial
            else:
                out.append(line)
                line = wd
        out.append(line)
    return out


def offslide(label, x, y, w, h) -> None:
    if x < 0.18 or y < 0.14 or x + w > SLIDE_W - 0.18 or y + h > SLIDE_H - 0.14:
        WARNINGS.append(
            f"OFF-SLIDE {label}: x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}"
        )

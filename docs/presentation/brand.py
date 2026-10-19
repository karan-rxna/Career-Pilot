"""CareerPilot brand mark renderer.

Draws the CP monogram + paper-plane mark with Pillow so it can be placed on the
deck's dark slides with a genuinely transparent background. The geometry is the
same as the SVG component in ``frontend/src/components/Logo.tsx`` (a 64-unit
viewBox with the group offset already baked in), so the two stay in sync.

Run directly to regenerate ``assets/careerpilot-mark.png``.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

# ---------------------------------------------------------------- geometry ---
# 64-unit design grid, matching the SVG component's translate(3 0) group.
VIEW = 64.0
STROKE = 9.2

C_CENTRE = (29.1, 27.7)
C_RADIUS = 17.5
C_START_DEG = 72.6
C_END_DEG = 316.9

P_STEM_X = 37.9
P_STEM_TOP = 20.2
P_STEM_BOTTOM = 53.5
P_BOWL_CENTRE = (37.9, 34.2)
P_BOWL_RADIUS = 14.0
P_BOWL_TOP_DEG = -90.0
P_BOWL_END_DEG = 90.0

ARROW = [(34.0, 37.0), (11.5, 59.0), (25.0, 45.0)]
PLANE_LIT = [(26.5, 33.0), (48.0, 27.0), (31.5, 36.5)]
PLANE_SHADE = [(31.5, 36.5), (48.0, 27.0), (35.0, 40.5)]

# ------------------------------------------------------------------ colours --
GRAD_C = [(0.0, (0x7F, 0xD4, 0xFF)), (0.5, (0x2F, 0x7D, 0xFF)), (1.0, (0x1B, 0x46, 0xD6))]
GRAD_P = [(0.0, (0x3B, 0x6B, 0xFF)), (0.55, (0x6B, 0x4B, 0xFF)), (1.0, (0x9D, 0x3B, 0xFF))]
GRAD_ARROW = [(0.0, (0x8F, 0xE6, 0xFF)), (0.55, (0x3B, 0x9D, 0xFF)), (1.0, (0x23, 0x58, 0xF0))]
PLANE_LIT_COLOUR = (0xEE, 0xF2, 0xFA)
PLANE_SHADE_COLOUR = (0xA3, 0xB6, 0xD3)


def _lerp_colour(stops, t: float) -> tuple[int, int, int]:
    t = min(max(t, 0.0), 1.0)
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]
        t1, c1 = stops[i + 1]
        if t0 <= t <= t1 or i == len(stops) - 2:
            span = (t1 - t0) or 1.0
            f = (t - t0) / span
            return tuple(int(round(c0[k] + (c1[k] - c0[k]) * f)) for k in range(3))
    return stops[-1][1]


def _gradient(size: tuple[int, int], stops, direction: tuple[float, float]) -> Image.Image:
    """Linear gradient along ``direction``, built small then upscaled."""
    w, h = size
    small = 256
    dx, dy = direction
    norm = math.hypot(dx, dy)
    dx, dy = dx / norm, dy / norm

    proj_min = min(0 * dx + 0 * dy, small * dx, small * dy, small * dx + small * dy)
    proj_max = max(0 * dx + 0 * dy, small * dx, small * dy, small * dx + small * dy)
    span = (proj_max - proj_min) or 1.0

    ramp_bytes = bytearray(small * small)
    for y in range(small):
        row = y * small
        base = y * dy
        for x in range(small):
            t = ((x * dx + base) - proj_min) / span
            ramp_bytes[row + x] = int(t * 255)

    ramp = Image.frombytes("L", (small, small), bytes(ramp_bytes)).resize(size, Image.BILINEAR)
    lut_r = [_lerp_colour(stops, t / 255.0)[0] for t in range(256)]
    lut_g = [_lerp_colour(stops, t / 255.0)[1] for t in range(256)]
    lut_b = [_lerp_colour(stops, t / 255.0)[2] for t in range(256)]
    return Image.merge("RGB", (ramp.point(lut_r), ramp.point(lut_g), ramp.point(lut_b)))


def _dot(draw: ImageDraw.ImageDraw, x: float, y: float, r: float, scale: float) -> None:
    draw.ellipse(
        [(x - r) * scale, (y - r) * scale, (x + r) * scale, (y + r) * scale],
        fill=255,
    )


def _stroke_arc(
    draw: ImageDraw.ImageDraw,
    centre: tuple[float, float],
    radius: float,
    start_deg: float,
    end_deg: float,
    scale: float,
    half_width: float = STROKE / 2,
) -> None:
    """Round-capped thick arc, stamped as a run of circles (matches SVG round caps)."""
    span = end_deg - start_deg
    steps = max(int(abs(span) * 3), 2)
    for i in range(steps + 1):
        a = math.radians(start_deg + span * i / steps)
        _dot(
            draw,
            centre[0] + radius * math.cos(a),
            centre[1] + radius * math.sin(a),
            half_width,
            scale,
        )


def _stroke_line(
    draw: ImageDraw.ImageDraw,
    x: float,
    y0: float,
    y1: float,
    scale: float,
    half_width: float = STROKE / 2,
) -> None:
    steps = max(int(abs(y1 - y0) * 4), 2)
    for i in range(steps + 1):
        _dot(draw, x, y0 + (y1 - y0) * i / steps, half_width, scale)


def _polygon_mask(
    size: tuple[int, int], points, scale: float, inset: float = 0.0
) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    pts = [(x * scale, y * scale) for x, y in points]
    draw.polygon(pts, fill=255, outline=255)
    if inset:
        # Hairline light edge, drawn as a stroked outline.
        draw.line(pts + [pts[0]], fill=255, width=max(int(inset * scale), 1), joint="curve")
    return mask


def render_mark(target_px: int = 512, supersample: int = 12, tight: bool = True) -> Image.Image:
    """Return the brand mark as an RGBA image with a transparent background."""
    scale = supersample
    span = int(VIEW * scale)
    size = (span, span)

    # --- masks, painted in the same order as the SVG: P, C, arrow, plane ----
    p_mask = Image.new("L", size, 0)
    p_draw = ImageDraw.Draw(p_mask)
    _stroke_line(p_draw, P_STEM_X, P_STEM_BOTTOM, P_STEM_TOP, scale)
    _stroke_arc(
        p_draw,
        P_BOWL_CENTRE,
        P_BOWL_RADIUS,
        P_BOWL_TOP_DEG,
        P_BOWL_END_DEG,
        scale,
    )

    c_mask = Image.new("L", size, 0)
    _stroke_arc(
        ImageDraw.Draw(c_mask), C_CENTRE, C_RADIUS, C_START_DEG, C_END_DEG, scale
    )

    arrow_mask = _polygon_mask(size, ARROW, scale)
    lit_mask = _polygon_mask(size, PLANE_LIT, scale, inset=0.6)
    shade_mask = _polygon_mask(size, PLANE_SHADE, scale, inset=0.6)

    # --- composite ---------------------------------------------------------
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(_gradient(size, GRAD_P, (1.0, 1.0)), (0, 0), p_mask)
    canvas.paste(_gradient(size, GRAD_C, (1.0, 1.0)), (0, 0), c_mask)
    canvas.paste(_gradient(size, GRAD_ARROW, (1.0, -1.0)), (0, 0), arrow_mask)
    canvas.paste(Image.new("RGBA", size, PLANE_LIT_COLOUR + (255,)), (0, 0), lit_mask)
    canvas.paste(Image.new("RGBA", size, PLANE_SHADE_COLOUR + (255,)), (0, 0), shade_mask)

    if tight:
        bbox = canvas.getbbox()
        if bbox:
            pad = int(0.02 * max(bbox[2] - bbox[0], bbox[3] - bbox[1]))
            box = (
                max(bbox[0] - pad, 0),
                max(bbox[1] - pad, 0),
                min(bbox[2] + pad, size[0]),
                min(bbox[3] + pad, size[1]),
            )
            canvas = canvas.crop(box)
            # Keep it square so callers can rely on a 1:1 aspect.
            side = max(canvas.size)
            square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
            square.paste(canvas, ((side - canvas.width) // 2, (side - canvas.height) // 2))
            canvas = square

    return canvas.resize((target_px, target_px), Image.LANCZOS)


if __name__ == "__main__":
    out = Path(__file__).parent / "assets" / "careerpilot-mark.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    mark = render_mark(1024)
    mark.save(out)
    print(f"wrote {out}  ({mark.width}x{mark.height}, transparent)")

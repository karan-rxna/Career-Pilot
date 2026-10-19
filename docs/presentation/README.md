# CareerPilot — Presentation

Mid-evaluation deck for the CareerPilot project. Dark theme matched to the app, 16:9, 18 slides
with speaker notes on every slide.

| File | What it is |
| --- | --- |
| `CareerPilot_Presentation.pptx` | The deck — fully editable, all diagrams are native PowerPoint shapes |
| `CareerPilot_Presentation.pdf` | PDF export for uploading to a college portal or printing |
| `build_deck.py` | The generator. Edit content here, then re-run |
| `deck_kit.py` | Theme, shape/text helpers and the layout auditor |
| `brand.py` | Renders the brand mark to a transparent PNG with Pillow |
| `assets/careerpilot-mark.png` | The brand mark used on the title and section slides |
| `shots/*.png` | Real screenshots captured from the running app |

## Regenerate

```bash
python docs/presentation/brand.py        # only if the mark changes
python docs/presentation/build_deck.py   # rebuilds the .pptx
```

Requires `python-pptx` and `Pillow`:

```bash
pip install python-pptx Pillow
```

`build_deck.py` runs a layout audit as it builds: it measures every text block with the real Segoe
UI font files and reports text that will not fit its box, plus any shape that falls off the slide.
A clean run prints `layout audit: clean` — if it prints warnings, fix them before presenting. The
audit is the reason the deck has no clipped or overflowing text.

To export a PDF after rebuilding, open the deck in PowerPoint and use **Save As → PDF**, or on
Windows:

```powershell
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open("path\to\CareerPilot_Presentation.pptx", $true, $false, $false)
$pres.SaveAs("path\to\CareerPilot_Presentation.pdf", 32)
$pres.Close(); $app.Quit()
```

## Notes

- **Fonts:** the deck uses Segoe UI (sans) and Consolas (mono) because both ship with Windows. The
  app itself uses Inter and Space Grotesk via Google Fonts, which are not installed as system fonts
  and would silently fall back in PowerPoint.
- **Screenshots:** `shots/` was captured from the running dev build with headless Chrome. The
  authenticated pages needed a temporary sign-in harness, which is deleted after capture — it must
  never be copied into `frontend/public/`, because it contains the demo credentials.
- **One claim to keep accurate:** only authentication and the profile endpoints are wired to the
  live API. The deeper feature screens render from `frontend/src/data/mock.ts`. Slide 11 states this
  deliberately — keep it that way as features land.

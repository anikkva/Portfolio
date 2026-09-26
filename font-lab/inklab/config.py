"""Base fonts, ink strengths and character set for Anikkva Ink."""
from pathlib import Path

from .geometry import InkParams

LAB_DIR = Path(__file__).resolve().parent.parent
SOURCES_DIR = LAB_DIR / "sources"

SOURCES = {
    "jetbrains": {
        "label": "JetBrains Mono",
        "ofl": "OFL-jetbrains.txt",
        "regular": ("JetBrainsMono[wght].ttf", {"wght": 400}),
        "bold": ("JetBrainsMono[wght].ttf", {"wght": 700}),
    },
    "martian": {
        "label": "Martian Mono",
        "ofl": "OFL-martian.txt",
        "regular": ("MartianMono[wdth,wght].ttf", {"wght": 400, "wdth": 100}),
        "bold": ("MartianMono[wdth,wght].ttf", {"wght": 700, "wdth": 100}),
    },
    "plex": {
        "label": "IBM Plex Mono",
        "ofl": "OFL-plex.txt",
        "regular": ("IBMPlexMono-Regular.ttf", None),
        "bold": ("IBMPlexMono-Bold.ttf", None),
    },
}

# Units per 1000 UPM; values come from the 2026-09-26 prototype.
STRENGTHS = {
    "none": InkParams(fill=0, spread=0, soften=0),
    "soft": InkParams(fill=22, spread=4, soften=4),
    "medium": InkParams(fill=40, spread=8, soften=8),
    "strong": InkParams(fill=65, spread=14, soften=12),
}

SYMBOLS = "№€₽←↑→↓↗⇦∴∷⊗☰♺"
CHARSET = sorted(
    set(range(0x20, 0x7F))
    | set(range(0xA0, 0x100))
    | set(range(0x400, 0x460))
    | set(range(0x2010, 0x2028))
    | {ord(c) for c in SYMBOLS}
)

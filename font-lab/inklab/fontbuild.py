"""Source OFL font -> Anikkva Ink font file."""
from __future__ import annotations

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

from .config import CHARSET
from .geometry import InkParams, glyph_to_geometry, ink
from .writer import geometry_to_glyph

HINTING_TABLES = ("fpgm", "prep", "cvt ", "hdmx", "LTSH", "VDMX", "DSIG")
WEIGHTS = {"Regular": 400, "Bold": 700}


def load_instance(src: Path, location: dict | None) -> TTFont:
    font = TTFont(src)
    if "fvar" in font:
        axes = {axis.axisTag: axis for axis in font["fvar"].axes}
        pinned = {tag: axis.defaultValue for tag, axis in axes.items()}
        pinned.update({tag: v for tag, v in (location or {}).items() if tag in axes})
        font = instancer.instantiateVariableFont(font, pinned)
    return font


def subset_font(font: TTFont) -> None:
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.glyph_names = True
    options.hinting = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=CHARSET)
    subsetter.subset(font)


def apply_ink(font: TTFont, params: InkParams) -> None:
    scaled = params.scaled(font["head"].unitsPerEm / 1000)
    glyph_set = font.getGlyphSet()
    # Compute everything first: composites still reference the original outlines.
    new_glyphs = {
        name: geometry_to_glyph(ink(glyph_to_geometry(glyph_set, name), scaled))
        for name in font.getGlyphOrder()
    }
    glyf, hmtx = font["glyf"], font["hmtx"]
    for name, glyph in new_glyphs.items():
        glyf[name] = glyph
        glyph.recalcBounds(glyf)
        advance, _ = hmtx[name]
        hmtx[name] = (advance, getattr(glyph, "xMin", 0) if glyph.numberOfContours else 0)


def rename(font: TTFont, family: str, style: str, based_on: str) -> None:
    name = font["name"]
    ps_name = f"{family.replace(' ', '')}-{style}"
    copyright_line = name.getDebugName(0) or ""
    name.removeNames(platformID=1)
    for name_id in (16, 17, 21, 22, 25):
        name.removeNames(nameID=name_id)
    records = {
        0: f"{copyright_line} Modified as {family}, based on {based_on} (SIL OFL 1.1).".strip(),
        1: family,
        2: style,
        3: f"1.000;ANKV;{ps_name}",
        4: f"{family} {style}",
        6: ps_name,
    }
    for name_id, value in records.items():
        name.setName(value, name_id, 3, 1, 0x409)


def set_style_bits(font: TTFont, style: str) -> None:
    os2, head = font["OS/2"], font["head"]
    os2.usWeightClass = WEIGHTS[style]
    bold = style == "Bold"
    os2.fsSelection = (os2.fsSelection & ~0b1100001) | (1 << 5 if bold else 1 << 6)
    head.macStyle = (head.macStyle & ~0b1) | (1 if bold else 0)


def build_font(src: Path, dst: Path, *, location: dict | None, params: InkParams,
               family: str, style: str, based_on: str) -> None:
    font = load_instance(src, location)
    subset_font(font)
    apply_ink(font, params)
    for table in HINTING_TABLES:
        if table in font:
            del font[table]
    rename(font, family, style, based_on)
    set_style_bits(font, style)
    dst.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2" if dst.suffix == ".woff2" else None
    font.save(dst)

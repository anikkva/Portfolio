from pathlib import Path

import pytest
from fontTools.pens.areaPen import AreaPen
from fontTools.ttLib import TTFont

from inklab.config import SOURCES_DIR, STRENGTHS
from inklab.fontbuild import build_font

SRC = SOURCES_DIR / "IBMPlexMono-Regular.ttf"
pytestmark = pytest.mark.skipif(not SRC.exists(), reason="run ./fetch_sources.sh first")


@pytest.fixture(scope="module")
def fonts(tmp_path_factory):
    dst = tmp_path_factory.mktemp("out") / "AnikkvaInk-Regular.woff2"
    build_font(SRC, dst, location=None, params=STRENGTHS["medium"],
               family="Anikkva Ink", style="Regular", based_on="IBM Plex Mono")
    return TTFont(dst), TTFont(SRC)


def glyph_area(font, char):
    gs = font.getGlyphSet()
    pen = AreaPen(gs)
    gs[font.getBestCmap()[ord(char)]].draw(pen)
    return abs(pen.value)


def test_is_woff2(fonts):
    assert fonts[0].flavor == "woff2"


def test_renamed(fonts):
    name = fonts[0]["name"]
    assert name.getDebugName(1) == "Anikkva Ink"
    assert name.getDebugName(4) == "Anikkva Ink Regular"
    assert name.getDebugName(6) == "AnikkvaInk-Regular"
    for name_id in (1, 3, 4, 6):
        assert "Plex" not in name.getDebugName(name_id)


def test_covers_latin_and_cyrillic(fonts):
    cmap = fonts[0].getBestCmap()
    for char in "ANIKKVA anikkva АНИККВА ЖЁё №→":
        assert ord(char) in cmap, char


def test_advance_widths_preserved(fonts):
    built, src = fonts
    for char in "AЖ0 ":
        g_built = built.getBestCmap()[ord(char)]
        g_src = src.getBestCmap()[ord(char)]
        assert built["hmtx"][g_built][0] == src["hmtx"][g_src][0]


def test_ink_adds_area(fonts):
    built, src = fonts
    for char in "AЖK":
        assert glyph_area(built, char) > glyph_area(src, char)


def test_hinting_removed(fonts):
    for table in ("fpgm", "prep", "cvt "):
        assert table not in fonts[0]

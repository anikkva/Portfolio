import math

import pytest
from shapely.geometry import Polygon, box

from inklab.geometry import InkParams, glyph_to_geometry, ink


class FakeGlyph:
    def __init__(self, contours):
        self.contours = contours

    def draw(self, pen):
        for contour in self.contours:
            pen.moveTo(contour[0])
            for point in contour[1:]:
                pen.lineTo(point)
            pen.closePath()


CW_SQUARE = [(0, 0), (0, 100), (100, 100), (100, 0)]


def test_overlapping_contours_are_unioned():
    shifted = [(x + 50, y) for x, y in CW_SQUARE]
    geom = glyph_to_geometry({"g": FakeGlyph([CW_SQUARE, shifted])}, "g")
    assert geom.area == pytest.approx(15000, rel=1e-3)


def test_counter_becomes_hole():
    hole = [(25, 25), (75, 25), (75, 75), (25, 75)]  # opposite direction
    geom = glyph_to_geometry({"g": FakeGlyph([CW_SQUARE, hole])}, "g")
    assert geom.area == pytest.approx(7500, rel=1e-3)


def test_empty_glyph_is_empty():
    geom = glyph_to_geometry({"space": FakeGlyph([])}, "space")
    assert geom.is_empty
    assert ink(geom, InkParams(40, 8, 8)).is_empty


def test_fill_leaves_convex_shape_unchanged():
    out = ink(box(0, 0, 100, 100), InkParams(fill=20, spread=0, soften=0))
    assert out.area == pytest.approx(10000, rel=1e-2)


def test_fill_pools_ink_in_inner_corner():
    l_shape = Polygon([(0, 0), (100, 0), (100, 20), (20, 20), (20, 100), (0, 100)])
    out = ink(l_shape, InkParams(fill=15, spread=0, soften=0))
    fillet = 15 ** 2 * (1 - math.pi / 4)  # ≈ 48
    assert out.area == pytest.approx(3600 + fillet, abs=10)


def test_spread_bleeds_outward():
    out = ink(box(0, 0, 100, 100), InkParams(fill=0, spread=5, soften=0))
    expected = 100 * 100 + 4 * 100 * 5 + math.pi * 5 ** 2
    assert out.area == pytest.approx(expected, rel=1e-2)


def test_soften_rounds_outer_corners():
    out = ink(box(0, 0, 100, 100), InkParams(fill=0, spread=0, soften=10))
    expected = 10000 - (4 - math.pi) * 10 ** 2
    assert out.area == pytest.approx(expected, abs=10)


def test_params_scale():
    assert InkParams(10, 2, 3).scaled(2) == InkParams(20, 4, 6)

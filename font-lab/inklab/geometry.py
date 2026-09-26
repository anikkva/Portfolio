"""Glyph outlines as shapely geometry, and the ink-bleed transform."""
from __future__ import annotations

from dataclasses import dataclass

from fontTools.pens.basePen import BasePen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from pathops import Path
from shapely import make_valid
from shapely.geometry import Polygon
from shapely.geometry.base import BaseGeometry

BUFFER_SEGMENTS = 8


@dataclass(frozen=True)
class InkParams:
    fill: float    # closing radius: ink pools in inner corners and stroke joints
    spread: float  # outward bleed of the whole outline
    soften: float  # opening radius: rounds outer corners and stroke ends

    def scaled(self, factor: float) -> "InkParams":
        return InkParams(self.fill * factor, self.spread * factor, self.soften * factor)


class FlattenPen(BasePen):
    """Collects closed contours as point lists, flattening curves."""

    def __init__(self, steps: int):
        super().__init__(None)
        self.steps = steps
        self.contours: list[list[tuple[float, float]]] = []
        self._current: list[tuple[float, float]] = []

    def _moveTo(self, pt):
        self._current = [pt]

    def _lineTo(self, pt):
        self._current.append(pt)

    def _curveToOne(self, p1, p2, p3):
        (x0, y0) = self._current[-1]
        for i in range(1, self.steps + 1):
            t = i / self.steps
            mt = 1 - t
            self._current.append((
                mt ** 3 * x0 + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0],
                mt ** 3 * y0 + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1],
            ))

    def _qCurveToOne(self, p1, p2):
        (x0, y0) = self._current[-1]
        for i in range(1, self.steps + 1):
            t = i / self.steps
            mt = 1 - t
            self._current.append((
                mt * mt * x0 + 2 * mt * t * p1[0] + t * t * p2[0],
                mt * mt * y0 + 2 * mt * t * p1[1] + t * t * p2[1],
            ))

    def _closePath(self):
        if len(self._current) > 2:
            self.contours.append(self._current)
        self._current = []

    _endPath = _closePath


def glyph_to_geometry(glyph_set, name: str, steps: int = 16) -> BaseGeometry:
    recording = DecomposingRecordingPen(glyph_set)
    glyph_set[name].draw(recording)
    if not recording.value:
        return Polygon()

    # Nonzero winding -> non-overlapping contours, so even-odd (XOR) is then exact.
    path = Path()
    recording.replay(path.getPen())
    path.simplify(fix_winding=True)

    flat = FlattenPen(steps)
    path.draw(flat)
    geom: BaseGeometry = Polygon()
    for ring in flat.contours:
        geom = geom.symmetric_difference(make_valid(Polygon(ring)))
    return geom


def ink(geom: BaseGeometry, params: InkParams, tolerance: float = 0.4) -> BaseGeometry:
    if geom.is_empty:
        return geom
    out = geom
    if params.fill:
        out = out.buffer(params.fill, join_style="round", quad_segs=BUFFER_SEGMENTS)
        out = out.buffer(-params.fill, join_style="round", quad_segs=BUFFER_SEGMENTS)
    if params.soften:
        out = out.buffer(-params.soften, quad_segs=BUFFER_SEGMENTS)
        out = out.buffer(params.soften, quad_segs=BUFFER_SEGMENTS)
    if params.spread:
        out = out.buffer(params.spread, quad_segs=BUFFER_SEGMENTS)
    return out.simplify(tolerance)

"""shapely geometry -> TrueType glyph."""
from __future__ import annotations

from fontTools.pens.ttGlyphPen import TTGlyphPen
from shapely.geometry.base import BaseGeometry
from shapely.geometry.polygon import Polygon, orient


def _polygons(geom: BaseGeometry) -> list[Polygon]:
    if geom.is_empty:
        return []
    if geom.geom_type == "Polygon":
        return [geom]
    if hasattr(geom, "geoms"):
        return [p for part in geom.geoms for p in _polygons(part)]
    return []  # points / lines left over from make_valid carry no ink


def _ring_points(ring) -> list[tuple[int, int]]:
    points: list[tuple[int, int]] = []
    for x, y in ring.coords[:-1]:
        pt = (round(x), round(y))
        if not points or points[-1] != pt:
            points.append(pt)
    if len(points) > 1 and points[0] == points[-1]:
        points.pop()
    return points


def geometry_to_glyph(geom: BaseGeometry):
    pen = TTGlyphPen(None)
    for polygon in _polygons(geom):
        polygon = orient(polygon, sign=-1.0)  # exterior clockwise, holes counter-clockwise
        for ring in (polygon.exterior, *polygon.interiors):
            points = _ring_points(ring)
            if len(points) < 3:
                continue
            pen.moveTo(points[0])
            for pt in points[1:]:
                pen.lineTo(pt)
            pen.closePath()
    return pen.glyph()

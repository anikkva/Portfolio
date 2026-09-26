from shapely.geometry import MultiPolygon, Polygon, box

from inklab.writer import geometry_to_glyph


def contour_areas(glyph):
    """Signed shoelace area per contour (negative = clockwise in y-up)."""
    coords = list(glyph.coordinates)
    areas, start = [], 0
    for end in glyph.endPtsOfContours:
        pts = coords[start:end + 1]
        a = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1])) / 2
        areas.append(a)
        start = end + 1
    return areas


def test_square_with_hole_orientation_and_area():
    shape = Polygon(
        [(0, 0), (100, 0), (100, 100), (0, 100)],
        holes=[[(25, 25), (75, 25), (75, 75), (25, 75)]],
    )
    areas = contour_areas(geometry_to_glyph(shape))
    assert areas[0] == -10000  # outer: clockwise
    assert areas[1] == 2500    # hole: counter-clockwise


def test_multipolygon_writes_every_part():
    glyph = geometry_to_glyph(MultiPolygon([box(0, 0, 10, 10), box(20, 0, 30, 10)]))
    assert glyph.numberOfContours == 2


def test_empty_geometry_gives_empty_glyph():
    assert geometry_to_glyph(Polygon()).numberOfContours == 0


def test_coordinates_are_integers():
    glyph = geometry_to_glyph(box(0.4, 0.6, 10.2, 10.7))
    assert all(isinstance(v, int) for pt in glyph.coordinates for v in pt)

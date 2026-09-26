"""Exports the chosen Anikkva Ink Regular + Bold for the website."""
import argparse
from pathlib import Path

from inklab.config import SOURCES, SOURCES_DIR, STRENGTHS
from inklab.fontbuild import build_font

PUBLIC_FONTS = Path(__file__).resolve().parent.parent / "public" / "fonts"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True, choices=SOURCES)
    parser.add_argument("--strength", required=True, choices=STRENGTHS)
    args = parser.parse_args()

    source = SOURCES[args.base]
    for style in ("Regular", "Bold"):
        filename, location = source[style.lower()]
        dst = PUBLIC_FONTS / f"AnikkvaInk-{style}.woff2"
        build_font(SOURCES_DIR / filename, dst, location=location, params=STRENGTHS[args.strength],
                   family="Anikkva Ink", style=style, based_on=source["label"])
        print(f"wrote {dst}")

    ofl = (SOURCES_DIR / source["ofl"]).read_text(encoding="utf-8")
    header = (f"Anikkva Ink is a modified version of {source['label']}, "
              f"distributed under the SIL Open Font License 1.1.\n"
              f"Ink strength preset: {args.strength}.\n\n")
    (PUBLIC_FONTS / "OFL.txt").write_text(header + ofl, encoding="utf-8")
    print(f"wrote {PUBLIC_FONTS / 'OFL.txt'}")


if __name__ == "__main__":
    main()

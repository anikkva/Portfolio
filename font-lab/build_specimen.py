"""Builds every base x strength (Regular) and a specimen page to compare them."""
from pathlib import Path

from inklab.config import SOURCES, SOURCES_DIR, STRENGTHS
from inklab.fontbuild import build_font

OUT = Path(__file__).resolve().parent / "build" / "specimen"

PAGE = """<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anikkva Ink — specimen</title>
<style>
{faces}
:root {{ --bg:#FFFFFF; --ink:#141726; --plate:#F2F2F2; --accent:#2B3BFF; --font:"ink-plex-medium"; }}
* {{ box-sizing:border-box; margin:0; }}
body {{ background:var(--bg); color:var(--ink); font-family:var(--font), monospace; padding:16px; }}
.controls {{ position:sticky; top:0; background:var(--bg); display:flex; flex-wrap:wrap; gap:8px; padding:8px 0 16px; z-index:1; }}
.pill {{ font:12px/1 var(--font), monospace; text-transform:uppercase; letter-spacing:.04em; border:0; border-radius:999px;
        background:var(--plate); color:var(--ink); padding:9px 14px; cursor:pointer; }}
.pill[aria-pressed="true"] {{ background:var(--ink); color:var(--bg); }}
.swatch {{ width:30px; height:30px; border-radius:999px; border:2px solid transparent; cursor:pointer; }}
.swatch[aria-pressed="true"] {{ border-color:var(--ink); }}
.hero {{ background:var(--plate); font-size:21vw; line-height:1; letter-spacing:-.04em; padding:4vw 2vw; margin-bottom:48px; }}
.manifesto {{ font-size:clamp(32px, 6vw, 96px); line-height:1.05; margin-bottom:48px; }}
.manifesto em {{ font-style:normal; color:var(--accent); }}
.nav {{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:48px; }}
.body {{ font-size:18px; line-height:1.5; max-width:60ch; margin-bottom:48px; }}
.small {{ font-size:13px; line-height:1.5; margin-bottom:48px; }}
.chars {{ font-size:40px; line-height:1.3; word-break:break-all; margin-bottom:48px; }}
h2 {{ font-size:12px; text-transform:uppercase; letter-spacing:.06em; opacity:.5; margin-bottom:12px; }}
</style></head><body>
<div class="controls">
  <span class="pill" style="background:none">BASE</span>{base_buttons}
  <span class="pill" style="background:none">INK</span>{strength_buttons}
  <span class="pill" style="background:none">ACCENT</span>
  <button class="swatch" style="background:#2B3BFF" data-accent="#2B3BFF" aria-pressed="true"></button>
  <button class="swatch" style="background:#FF3B1F" data-accent="#FF3B1F"></button>
  <button class="swatch" style="background:#141726" data-accent="#141726"></button>
</div>
<h2>Hero</h2><div class="hero">anikkva</div>
<h2>Nav</h2><div class="nav">
  <span class="pill">ANIKKVA</span><span class="pill">PROJECTS VIEW</span><span class="pill">♺ RANDOM</span>
  <span class="pill">∷ GRID</span><span class="pill">☰ LIST</span><span class="pill">ABOUT</span><span class="pill">CV</span>
  <span class="pill">PLAY</span><span class="pill">RU/EN</span><span class="pill">GET IN TOUCH ↗</span></div>
<h2>Manifesto RU</h2><p class="manifesto">Я проектирую ∴ продукты, которые <em>понятны</em> ⊗ людям и полезны бизнесу ⇦</p>
<h2>Manifesto EN</h2><p class="manifesto">I design ∴ products that feel <em>obvious</em> ⊗ to people and work for business ⇦</p>
<h2>Body 18px</h2><p class="body">Редизайн корзины сократил путь до оплаты с пяти шагов до двух. Conversion grew by 12% in the first month, and support tickets about checkout dropped by a third.</p>
<h2>Small 13px</h2><p class="small">2025 · LEAD PRODUCT DESIGNER · КОМАНДА 6 ЧЕЛОВЕК · 4 МЕСЯЦА · MOBILE, E-COMMERCE</p>
<h2>Characters</h2><p class="chars">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ абвгдеёжзийклмнопрстуфхцчшщъыьэюя 0123456789 !?.,:;—–«»“”() № € ₽ ← ↑ → ↓ ↗</p>
<script>
const state = {{ base: "plex", strength: "medium" }};
const apply = () => {{
  document.documentElement.style.setProperty("--font", `"ink-${{state.base}}-${{state.strength}}"`);
  document.querySelectorAll("[data-base]").forEach(b => b.setAttribute("aria-pressed", b.dataset.base === state.base));
  document.querySelectorAll("[data-strength]").forEach(b => b.setAttribute("aria-pressed", b.dataset.strength === state.strength));
}};
document.querySelectorAll("[data-base]").forEach(b => b.onclick = () => {{ state.base = b.dataset.base; apply(); }});
document.querySelectorAll("[data-strength]").forEach(b => b.onclick = () => {{ state.strength = b.dataset.strength; apply(); }});
document.querySelectorAll("[data-accent]").forEach(b => b.onclick = () => {{
  document.documentElement.style.setProperty("--accent", b.dataset.accent);
  document.querySelectorAll("[data-accent]").forEach(s => s.setAttribute("aria-pressed", s === b));
}});
apply();
</script></body></html>
"""


def main() -> None:
    faces, base_buttons, strength_buttons = [], [], []
    for base_key, source in SOURCES.items():
        filename, location = source["regular"]
        base_buttons.append(f'<button class="pill" data-base="{base_key}">{source["label"]}</button>')
        for strength_key, params in STRENGTHS.items():
            dst = OUT / f"{base_key}-{strength_key}.woff2"
            print(f"building {dst.name} …", flush=True)
            build_font(SOURCES_DIR / filename, dst, location=location, params=params,
                       family="Anikkva Ink", style="Regular", based_on=source["label"])
            faces.append(f'@font-face {{ font-family:"ink-{base_key}-{strength_key}"; '
                         f'src:url("{dst.name}") format("woff2"); font-display:block; }}')
    for strength_key in STRENGTHS:
        strength_buttons.append(f'<button class="pill" data-strength="{strength_key}">{strength_key}</button>')
    html = PAGE.format(faces="\n".join(faces), base_buttons="".join(base_buttons),
                       strength_buttons="".join(strength_buttons))
    (OUT / "index.html").write_text(html, encoding="utf-8")
    print(f"specimen: {OUT / 'index.html'}")


if __name__ == "__main__":
    main()

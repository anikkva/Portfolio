import s from './DotNumber.module.css'

type Glyph = { r: number; dots: number[][] }

/** A dot-matrix number drawn as circles sampled from the 5by7 glyph outline exported from Figma. */
export function DotNumber({ glyph, width, height }: { glyph: Glyph; width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={s.number} aria-hidden="true">
      {glyph.dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={glyph.r} />
      ))}
    </svg>
  )
}

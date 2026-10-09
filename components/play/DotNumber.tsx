import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import s from './DotNumber.module.css'

type Glyph = { r: number; dots: number[][] }
type Props = { glyph: Glyph; width: number; height: number; assemble?: boolean; className?: string }

/** Deterministic pseudo-random in [-1, 1) per dot, so the scatter looks the same every time. */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/**
 * A dot-matrix number drawn as individual circles (sampled from the 5by7 glyph outline).
 * With `assemble`, the dots scatter and gather back into the number.
 */
export function DotNumber({ glyph, width, height, assemble = false, className }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cx(s.number, assemble && s.assemble, className)}
      aria-hidden="true"
    >
      {glyph.dots.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={glyph.r}
          style={
            {
              '--sx': `${(jitter(i, 1) * width * 0.6).toFixed(1)}px`,
              '--sy': `${(jitter(i, 2) * height * 0.6).toFixed(1)}px`,
              '--delay': `${((jitter(i, 3) + 1) * 0.08).toFixed(3)}s`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
}

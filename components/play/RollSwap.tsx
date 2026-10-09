import type { CSSProperties, ReactNode } from 'react'
import s from './RollSwap.module.css'

type Props = { from: ReactNode; to: ReactNode; active: boolean; delay?: number }

/** Swaps two values in place: the old one rolls up and out, the new one rolls in from below. */
export function RollSwap({ from, to, active, delay = 0 }: Props) {
  return (
    <span className={s.roll} data-active={active} style={{ '--roll-delay': `${delay}s` } as CSSProperties}>
      <span className={s.from} aria-hidden={active}>
        {from}
      </span>
      <span className={s.to} aria-hidden={!active}>
        {to}
      </span>
    </span>
  )
}

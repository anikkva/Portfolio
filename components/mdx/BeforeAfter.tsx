'use client'

import { useState, type CSSProperties } from 'react'
import s from './mdx.module.css'

type Props = { before: string; after: string; alt?: string }

export function BeforeAfter({ before, after, alt = '' }: Props) {
  const [pos, setPos] = useState(50)
  return (
    <figure className={s.ba} style={{ '--pos': `${pos}%` } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={alt} className={s.baImg} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={before} alt="" className={`${s.baImg} ${s.baTop}`} />
      <span className={s.baLine} aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={s.baRange}
        aria-label="Before / after"
      />
      <span className={`ui ${s.baLabel} ${s.baLeft}`}>Before</span>
      <span className={`ui ${s.baLabel} ${s.baRight}`}>After</span>
    </figure>
  )
}

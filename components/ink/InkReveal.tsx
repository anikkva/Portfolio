'use client'

import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { INK_THRESHOLD, filterId } from './constants'
import s from './ink.module.css'

const revealed = new Set<string>()

type Props = { children: ReactNode; className?: string; revealKey?: string }

/** Content spreads in like an ink drop when it enters the viewport (once per revealKey). */
export function InkReveal({ children, className, revealKey }: Props) {
  const id = filterId(useId(), 'reveal')
  const ref = useRef<HTMLDivElement>(null)
  const blur = useRef<SVGFEGaussianBlurElement>(null)
  const reduced = useReducedMotion()
  const [done, setDone] = useState(() => (revealKey ? revealed.has(revealKey) : false))

  useEffect(() => {
    const el = ref.current
    if (!el || done) return
    if (reduced) {
      setDone(true)
      return
    }
    let controls: { stop: () => void } | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        controls = animate(0, 1, {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (p) => {
            el.style.setProperty('--ink-r', `${(p * 160).toFixed(1)}%`)
            blur.current?.setAttribute('stdDeviation', (10 * (1 - p)).toFixed(2))
          },
          onComplete: () => {
            if (revealKey) revealed.add(revealKey)
            setDone(true)
          },
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      controls?.stop()
    }
  }, [done, reduced, revealKey])

  return (
    <div
      ref={ref}
      data-ink-reveal=""
      className={cx(s.reveal, done && s.done, className)}
      style={done ? undefined : { filter: `url(#${id})` }}
    >
      {!done && (
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <filter id={id}>
            <feGaussianBlur ref={blur} in="SourceGraphic" stdDeviation="10" />
            <feColorMatrix values={INK_THRESHOLD} />
          </filter>
        </svg>
      )}
      <div className={s.inner}>{children}</div>
    </div>
  )
}

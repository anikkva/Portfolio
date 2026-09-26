'use client'

import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ElementType, type ReactNode } from 'react'
import { INK_THRESHOLD, filterId } from './constants'

type Props = { children: ReactNode; as?: ElementType; className?: string; appear?: boolean; hover?: boolean }

const APPEAR_BLUR = 14

export function InkText({ children, as: Tag = 'span', className, appear = true, hover = true }: Props) {
  const id = filterId(useId(), 'ink')
  const blur = useRef<SVGFEGaussianBlurElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(appear)

  const play = (keyframes: number[], duration: number) => {
    if (reduced) {
      setActive(false)
      return
    }
    setActive(true)
    animate(keyframes[0], keyframes, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => blur.current?.setAttribute('stdDeviation', v.toFixed(2)),
      onComplete: () => setActive(false),
    })
  }

  useEffect(() => {
    if (appear) play([APPEAR_BLUR, 0], 1.4)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id={id} x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur ref={blur} in="SourceGraphic" stdDeviation={appear ? APPEAR_BLUR : 0} />
          <feColorMatrix values={INK_THRESHOLD} />
        </filter>
      </svg>
      <Tag
        className={className}
        data-ink=""
        style={active ? { filter: `url(#${id})` } : undefined}
        onMouseEnter={hover ? () => play([0, 5, 0], 0.9) : undefined}
      >
        {children}
      </Tag>
    </>
  )
}

'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'
import s from './ink.module.css'

export function InkCursor() {
  const fine = useMediaQuery('(pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = fine && !reduced
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('ink-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.('[data-cursor]')
      setLabel(target ? (target.getAttribute('data-cursor-label') ?? '') : null)
    }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    return () => {
      root.classList.remove('ink-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const big = label !== null
  return (
    <motion.div
      aria-hidden="true"
      className={s.cursor}
      style={{ x: sx, y: sy }}
      animate={{ width: big ? 88 : 12, height: big ? 88 : 12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <span className={`ui ${s.cursorLabel}`} style={{ opacity: big ? 1 : 0 }}>
        {label}
      </span>
    </motion.div>
  )
}

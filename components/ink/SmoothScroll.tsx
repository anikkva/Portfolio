'use client'

import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function SmoothScroll() {
  const reduced = useReducedMotion()
  const pathname = usePathname()
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced !== false) return
    const instance = new Lenis({ autoRaf: true, anchors: true })
    lenis.current = instance
    return () => {
      instance.destroy()
      lenis.current = null
    }
  }, [reduced])

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}

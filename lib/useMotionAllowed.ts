'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * False on the server and on the first client render, so hydration always matches;
 * then true unless the user prefers reduced motion.
 */
export function useMotionAllowed(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && reduced === false
}

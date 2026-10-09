'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useMotionAllowed } from '@/lib/useMotionAllowed'
import type { PlayScreenName } from '@/lib/playScreens'
import { WeatherList } from './screens/weather/WeatherList'
import s from './PlayScreen.module.css'

export type ScreenProps = { active: boolean }

const SCREENS: Record<PlayScreenName, ComponentType<ScreenProps>> = {
  'weather-list': WeatherList,
}

/** Designed size of every Pragmatica screen. */
const W = 393
const H = 852

/**
 * A coded phone screen scaled to its container. Its micro-animation plays while hovered;
 * on touch devices, while the screen sits in the middle of the viewport.
 */
export function PlayScreen({ name }: { name: PlayScreenName }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const [centered, setCentered] = useState(false)
  const touch = useMediaQuery('(hover: none)')
  const allowed = useMotionAllowed()
  const Screen = SCREENS[name]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W))
    resize.observe(el)
    return () => resize.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !touch) return
    const observer = new IntersectionObserver(([entry]) => setCentered(entry.isIntersecting), {
      rootMargin: '-35% 0px -35% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [touch])

  const active = allowed && (touch ? centered : hovered)

  return (
    <div
      ref={ref}
      className={s.frame}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      <div
        className={s.canvas}
        style={{ width: W, height: H, transform: `scale(${scale ?? 0})`, visibility: scale ? 'visible' : 'hidden' }}
      >
        <Screen active={active} />
      </div>
    </div>
  )
}

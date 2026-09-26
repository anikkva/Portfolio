'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

type Props = { src: string; poster?: string; className?: string; style?: CSSProperties }

/** Muted looping video that only plays while visible. */
export function AutoplayVideo({ src, poster, className, style }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video ref={ref} src={src} poster={poster} className={className} style={style} muted loop playsInline preload="metadata" />
  )
}

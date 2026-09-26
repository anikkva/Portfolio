import type { CSSProperties } from 'react'
import { AutoplayVideo } from './AutoplayVideo'

type Props = {
  src: string
  alt?: string
  poster?: string
  className?: string
  style?: CSSProperties
  eager?: boolean
}

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src)

export function Media({ src, alt = '', poster, className, style, eager = false }: Props) {
  if (isVideo(src)) return <AutoplayVideo src={src} poster={poster} className={className} style={style} />
  return (
    // eslint-disable-next-line @next/next/no-img-element -- placeholders are SVG; real media can move to next/image later
    <img src={src} alt={alt} className={className} style={style} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  )
}

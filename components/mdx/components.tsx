import type { CSSProperties, ReactNode } from 'react'
import { InkReveal } from '@/components/ink/InkReveal'
import { Media } from '@/components/Media/Media'
import { BeforeAfter } from './BeforeAfter'
import s from './mdx.module.css'

type FigureProps = { src: string; alt?: string; caption?: string; poster?: string; full?: boolean }

function Figure({ src, alt = '', caption, poster, full = false }: FigureProps) {
  return (
    <figure className={full ? s.full : s.figure}>
      <InkReveal>
        <Media src={src} alt={alt} poster={poster} className={s.media} />
      </InkReveal>
      {caption && <figcaption className={`ui ${s.caption}`}>{caption}</figcaption>}
    </figure>
  )
}

function MediaGrid({ cols = 2, children }: { cols?: number; children: ReactNode }) {
  return (
    <div className={s.grid} style={{ '--cols': cols } as CSSProperties}>
      {children}
    </div>
  )
}

function Quote({ author, children }: { author?: string; children: ReactNode }) {
  return (
    <blockquote className={s.quote}>
      <div>{children}</div>
      {author && <cite className={`ui ${s.cite}`}>{author}</cite>}
    </blockquote>
  )
}

function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className={s.stats}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className={s.statValue}>{item.value}</dt>
          <dd className={`ui ${s.statLabel}`}>{item.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export const mdxComponents = { Media: Figure, Video: Figure, MediaGrid, BeforeAfter, Quote, Stats }

'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import { useRef, ViewTransition, type CSSProperties, type ReactNode } from 'react'
import { Media } from '@/components/Media/Media'
import type { CardData } from '@/lib/content/projects'
import { cx } from '@/lib/cx'
import s from './Projects.module.css'

type Props = {
  item: CardData
  ratio: string
  speed?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const SPRING = { type: 'spring', stiffness: 170, damping: 26 } as const

function Drift({ speed, children }: { speed: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 400, speed * -400])
  return (
    <motion.div ref={ref} style={{ y: reduced || speed === 0 ? 0 : y }}>
      {children}
    </motion.div>
  )
}

export function ProjectCard({ item, ratio, speed = 0, className, style, children }: Props) {
  const inner = (
    <>
      <ViewTransition name={`cover-${item.slug}`}>
        <Media src={item.cover} alt="" className={s.cover} style={{ aspectRatio: ratio }} />
      </ViewTransition>
      <span className={`ui ${s.hoverTitle}`}>
        {item.title}
        {item.external ? ' ↗' : ''}
      </span>
    </>
  )
  const linkProps = {
    className: s.link,
    'data-cursor': 'card',
    'data-cursor-label': item.external ? '↗' : 'VIEW',
    'aria-label': item.title,
  }
  return (
    <motion.div layoutId={`card-${item.slug}`} transition={SPRING} className={cx(s.card, className)} style={style}>
      <Drift speed={speed}>
        {item.external ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" {...linkProps}>
            {inner}
          </a>
        ) : (
          <Link href={item.href} {...linkProps}>
            {inner}
          </Link>
        )}
        {children}
      </Drift>
    </motion.div>
  )
}

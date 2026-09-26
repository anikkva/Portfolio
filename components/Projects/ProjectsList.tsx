'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import { Media } from '@/components/Media/Media'
import type { CardData } from '@/lib/content/projects'
import { useMediaQuery } from '@/lib/useMediaQuery'
import s from './Projects.module.css'

export function ProjectsList({ items }: { items: CardData[] }) {
  const finePointer = useMediaQuery('(pointer: fine)')
  const [hovered, setHovered] = useState<CardData | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30 })
  const sy = useSpring(y, { stiffness: 300, damping: 30 })

  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX + 24)
        y.set(e.clientY - 90)
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className={s.list}>
        {items.map((item, i) => {
          const content = (
            <>
              <span>{item.year}</span>
              <span>
                {item.title}
                {item.external ? ' ↗' : ''}
              </span>
              <span className={s.rowMeta}>{item.role}</span>
              <span className={s.rowMeta}>{item.tags.join(', ')}</span>
            </>
          )
          const props = { className: s.row, onPointerEnter: () => setHovered(item) }
          return (
            <motion.li
              key={item.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} {...props}>
                  {content}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ul>
      {finePointer && hovered && (
        <motion.div className={s.preview} style={{ x: sx, y: sy }} aria-hidden="true">
          <Media src={hovered.cover} className={s.previewMedia} eager />
        </motion.div>
      )}
    </div>
  )
}

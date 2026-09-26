'use client'

import type { CardData } from '@/lib/content/projects'
import { RATIO_CSS, type Scatter } from '@/lib/scatter'
import { ProjectCard } from './ProjectCard'
import s from './Projects.module.css'

export function ProjectsRandom({ items, scatter }: { items: CardData[]; scatter: Scatter }) {
  return (
    <div className={s.canvas} style={{ height: `${scatter.height}cqw` }}>
      {items.map((item, i) => {
        const p = scatter.items[i]
        return (
          <ProjectCard
            key={item.slug}
            item={item}
            ratio={RATIO_CSS[item.size]}
            speed={p.speed}
            className={s.scattered}
            style={{ left: `${p.x}cqw`, top: `${p.y}cqw`, width: `${p.w}cqw` }}
          />
        )
      })}
    </div>
  )
}

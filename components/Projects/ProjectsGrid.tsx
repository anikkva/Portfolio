'use client'

import type { CardData } from '@/lib/content/projects'
import { ProjectCard } from './ProjectCard'
import s from './Projects.module.css'

export function ProjectsGrid({ items }: { items: CardData[] }) {
  return (
    <div className={s.grid}>
      {items.map((item) => (
        <ProjectCard key={item.slug} item={item} ratio="4 / 3">
          <p className={`ui ${s.caption}`}>
            <span>
              {item.title}
              {item.external ? ' ↗' : ''}
            </span>
            <span>{item.year}</span>
          </p>
        </ProjectCard>
      ))}
    </div>
  )
}

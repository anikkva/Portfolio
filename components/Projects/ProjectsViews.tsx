'use client'

import { LayoutGroup } from 'motion/react'
import { useMemo } from 'react'
import type { CardData } from '@/lib/content/projects'
import { t, type Locale } from '@/lib/i18n'
import { scatterLayout } from '@/lib/scatter'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useViewState } from '@/lib/viewStore'
import { ProjectsGrid } from './ProjectsGrid'
import { ProjectsList } from './ProjectsList'
import { ProjectsRandom } from './ProjectsRandom'
import s from './Projects.module.css'

export function ProjectsViews({ items, lang }: { items: CardData[]; lang: Locale }) {
  const { view, seed } = useViewState()
  const mobile = useMediaQuery('(max-width: 767px)')
  const scatter = useMemo(
    () => scatterLayout(items.map((item) => item.size), seed, mobile ? 'mobile' : 'desktop'),
    [items, seed, mobile],
  )

  return (
    <section id="work" className={s.projects} aria-label={t(lang, 'projectsView')}>
      <LayoutGroup>
        {view === 'random' && <ProjectsRandom items={items} scatter={scatter} />}
        {view === 'grid' && <ProjectsGrid items={items} />}
        {view === 'list' && <ProjectsList items={items} />}
      </LayoutGroup>
    </section>
  )
}

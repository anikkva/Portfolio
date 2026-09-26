import Link from 'next/link'
import { Media } from '@/components/Media/Media'
import type { Project } from '@/lib/content/projects'
import { t, type Locale } from '@/lib/i18n'
import s from './Case.module.css'

export function NextProject({ project, lang }: { project: Project; lang: Locale }) {
  return (
    <Link href={`/${lang}/work/${project.slug}`} className={s.next} data-cursor="card" data-cursor-label="NEXT">
      <span className="ui">{t(lang, 'nextProject')}</span>
      <span className={s.nextTitle}>{project.title}</span>
      <Media src={project.cover} className={s.nextCover} />
    </Link>
  )
}

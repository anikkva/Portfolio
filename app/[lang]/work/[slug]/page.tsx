import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { NextProject } from '@/components/Case/NextProject'
import { Passport } from '@/components/Case/Passport'
import s from '@/components/Case/Case.module.css'
import { Media } from '@/components/Media/Media'
import { getNextProject, getProject, getProjects } from '@/lib/content/projects'
import { asLocale, t } from '@/lib/i18n'
import { Mdx } from '@/lib/mdx'
import { extractToc } from '@/lib/toc'

type Params = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getProjects(asLocale(params.lang))
    .filter((p) => p.type !== 'link')
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const project = getProject(slug, asLocale(lang))
  return { title: project?.title }
}

export default async function WorkPage({ params }: Params) {
  const { lang: rawLang, slug } = await params
  const lang = asLocale(rawLang)
  const project = getProject(slug, lang)
  if (!project || project.type === 'link') notFound()

  const toc = project.type === 'case' ? extractToc(project.body) : []
  const next = getNextProject(slug, lang)

  return (
    <article className="page">
      <header className={s.head}>
        <h1 className={s.title}>{project.title}</h1>
        <Passport project={project} />
      </header>

      <ViewTransition name={`cover-${project.slug}`}>
        <Media src={project.cover} className={s.cover} eager />
      </ViewTransition>

      <div className={s.body}>
        {toc.length > 0 && (
          <aside className={s.toc} aria-label={t(lang, 'contents')}>
            <p className="ui">{t(lang, 'contents')}</p>
            <ol>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
        <div className={`prose ${toc.length === 0 ? s.wide : ''}`}>
          <Mdx source={project.body} />
        </div>
      </div>

      {next && <NextProject project={next} lang={lang} />}
    </article>
  )
}

import type { Metadata } from 'next'
import { InkReveal } from '@/components/ink/InkReveal'
import { InkText } from '@/components/ink/InkText'
import { getAbout } from '@/lib/content/pages'
import { asLocale, t } from '@/lib/i18n'
import { Mdx } from '@/lib/mdx'
import s from './about.module.css'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: getAbout(asLocale((await params).lang)).title }
}

export default async function AboutPage({ params }: Params) {
  const lang = asLocale((await params).lang)
  const about = getAbout(lang)
  return (
    <article className="page">
      <InkText as="h1" className="page-title">
        {about.title}
      </InkText>
      <div className={s.layout}>
        <InkReveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={about.photo} alt="" className={s.photo} />
        </InkReveal>
        <div>
          <div className="prose">
            <Mdx source={about.body} />
          </div>
          <section className={s.block}>
            <h2 className={`ui ${s.label}`}>{t(lang, 'skills')}</h2>
            <ul className={s.pills}>
              {about.skills.map((skill) => (
                <li key={skill} className="pill pill--ghost">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
          <section className={s.block}>
            <h2 className={`ui ${s.label}`}>{t(lang, 'clients')}</h2>
            <ul className={s.clients}>
              {about.clients.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  )
}

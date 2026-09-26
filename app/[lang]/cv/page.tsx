import type { Metadata } from 'next'
import { getCv } from '@/lib/content/pages'
import { asLocale, t } from '@/lib/i18n'
import { Mdx } from '@/lib/mdx'
import s from './cv.module.css'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: getCv(asLocale((await params).lang)).title }
}

export default async function CvPage({ params }: Params) {
  const lang = asLocale((await params).lang)
  const cv = getCv(lang)
  return (
    <article className="page">
      <h1 className="page-title">{cv.title}</h1>
      <div className={s.intro}>
        <div className="prose">
          <Mdx source={cv.body} />
        </div>
        <a href={cv.pdf} download className="pill">
          {t(lang, 'downloadPdf')}
        </a>
      </div>
      <section className={s.section}>
        <h2 className={`ui ${s.label}`}>{t(lang, 'experience')}</h2>
        <ol className={s.rows}>
          {cv.experience.map((row) => (
            <li key={`${row.years}-${row.company}`} className={s.row}>
              <span>{row.years}</span>
              <span>{row.company}</span>
              <span className={s.muted}>{row.role}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.section}>
        <h2 className={`ui ${s.label}`}>{t(lang, 'education')}</h2>
        <ol className={s.rows}>
          {cv.education.map((row) => (
            <li key={`${row.years}-${row.place}`} className={s.row}>
              <span>{row.years}</span>
              <span>{row.place}</span>
              <span className={s.muted}>{row.degree}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}

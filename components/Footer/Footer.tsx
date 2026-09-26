import type { Site } from '@/lib/content/site'
import { t, type Locale } from '@/lib/i18n'
import s from './Footer.module.css'

export function Footer({ lang, site }: { lang: Locale; site: Site }) {
  return (
    <footer className={s.footer}>
      <div>
        <p className={`ui ${s.label}`}>{t(lang, 'contact')}</p>
        <a className={s.big} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
      <div>
        <p className={`ui ${s.label}`}>{t(lang, 'follow')}</p>
        <ul className={s.links}>
          {site.socials.map((social) => (
            <li key={social.url}>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a href="#top" className={`pill ${s.top}`}>
        {t(lang, 'backToTop')}
      </a>
    </footer>
  )
}

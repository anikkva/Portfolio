'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { switchLocalePath, t, type Locale } from '@/lib/i18n'
import { ViewSwitch } from './ViewSwitch'
import s from './Header.module.css'

type Props = { lang: Locale; name: string; email: string }

export function Header({ lang, name, email }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const isHome = pathname === `/${lang}`
  const other: Locale = lang === 'ru' ? 'en' : 'ru'
  const links = [
    { href: `/${lang}/about`, label: t(lang, 'about') },
    { href: `/${lang}/cv`, label: t(lang, 'cv') },
    { href: `/${lang}/playground`, label: t(lang, 'play') },
  ]

  const items = (
    <>
      {isHome ? (
        <ViewSwitch lang={lang} />
      ) : (
        <Link href={`/${lang}`} className="pill">
          {t(lang, 'work')}
        </Link>
      )}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="pill"
          aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
      <Link href={switchLocalePath(pathname, other)} className="pill" hrefLang={other} lang={other}>
        {other.toUpperCase()}
      </Link>
      <a href={`mailto:${email}`} className="pill">
        {t(lang, 'getInTouch')}
      </a>
    </>
  )

  return (
    <header className={s.header}>
      <Link href={`/${lang}`} className="pill">
        {name}
      </Link>
      <nav className={s.nav} aria-label="Main">
        {items}
      </nav>
      <button
        type="button"
        className={`pill ${s.menuButton}`}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? t(lang, 'close') : t(lang, 'menu')}
      </button>
      {open && (
        <nav id="mobile-menu" className={s.overlay} aria-label="Mobile">
          {items}
        </nav>
      )}
    </header>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { InkCursor } from '@/components/ink/InkCursor'
import { SmoothScroll } from '@/components/ink/SmoothScroll'
import { getSite } from '@/lib/content/site'
import { ink } from '@/lib/fonts'
import { LOCALES, isLocale } from '@/lib/i18n'
import 'lenis/dist/lenis.css'
import '../globals.css'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: { default: 'ANIKKVA — Product Designer', template: '%s — ANIKKVA' },
  description: 'Portfolio of ANIKKVA, product designer.',
}

const NO_JS_CSS =
  '[data-ink],[data-ink-reveal]{filter:none!important}' +
  '[data-ink-reveal]>div{-webkit-mask-image:none!important;mask-image:none!important}'

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const site = getSite()
  return (
    <html lang={lang} className={ink.variable}>
      <body id="top">
        <noscript>
          <style>{NO_JS_CSS}</style>
        </noscript>
        <SmoothScroll />
        <Header lang={lang} name={site.name} email={site.email} />
        <main>{children}</main>
        <Footer lang={lang} site={site} />
        <InkCursor />
      </body>
    </html>
  )
}

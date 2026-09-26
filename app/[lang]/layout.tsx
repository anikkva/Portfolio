import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { getSite } from '@/lib/content/site'
import { ink } from '@/lib/fonts'
import { LOCALES, isLocale } from '@/lib/i18n'
import '../globals.css'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: { default: 'ANIKKVA — Product Designer', template: '%s — ANIKKVA' },
  description: 'Portfolio of ANIKKVA, product designer.',
}

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
        <Header lang={lang} name={site.name} email={site.email} />
        <main>{children}</main>
        <Footer lang={lang} site={site} />
      </body>
    </html>
  )
}

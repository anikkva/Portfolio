import type { Metadata } from 'next'
import { Playground } from '@/components/Playground/Playground'
import { getPlayground } from '@/lib/content/playground'
import { asLocale, t } from '@/lib/i18n'

export const metadata: Metadata = { title: 'Playground' }

export default async function PlaygroundPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asLocale((await params).lang)
  const items = getPlayground().map((item) => ({ id: item.id, media: item.media, caption: item.caption[lang], year: item.year }))
  return (
    <section className="page">
      <h1 className="page-title">Playground</h1>
      <Playground items={items} closeLabel={t(lang, 'close')} />
    </section>
  )
}

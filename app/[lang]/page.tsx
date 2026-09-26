import { Hero } from '@/components/Hero/Hero'
import { ProjectsViews } from '@/components/Projects/ProjectsViews'
import { getProjects, toCard } from '@/lib/content/projects'
import { getSite } from '@/lib/content/site'
import { asLocale } from '@/lib/i18n'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asLocale((await params).lang)
  const site = getSite()
  const cards = getProjects(lang)
    .filter((p) => p.featured)
    .map((p) => toCard(p, lang))
  return (
    <>
      <Hero name={site.name} />
      <ProjectsViews items={cards} lang={lang} />
    </>
  )
}

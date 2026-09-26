import { Hero } from '@/components/Hero/Hero'
import { getSite } from '@/lib/content/site'

export default function HomePage() {
  const site = getSite()
  return <Hero name={site.name} />
}

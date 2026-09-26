import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getNextProject, getProject, getProjects, toCard } from '@/lib/content/projects'
import { getSite } from '@/lib/content/site'

const FIX = fileURLToPath(new URL('./fixtures/content', import.meta.url))
const BROKEN = fileURLToPath(new URL('./fixtures/broken', import.meta.url))

describe('projects', () => {
  it('loads all projects sorted by order', () => {
    expect(getProjects('ru', FIX).map((p) => p.slug)).toEqual(['alpha', 'beta', 'gamma'])
  })

  it('uses the requested language', () => {
    expect(getProject('alpha', 'en', FIX)?.title).toBe('Alpha EN')
    expect(getProject('alpha', 'ru', FIX)?.body).toContain('## Задача')
  })

  it('falls back to Russian when a translation is missing', () => {
    expect(getProject('beta', 'en', FIX)?.title).toBe('Бета')
  })

  it('applies defaults', () => {
    const beta = getProject('beta', 'ru', FIX)!
    expect(beta.size).toBe('M')
    expect(beta.featured).toBe(true)
    expect(beta.tags).toEqual([])
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProject('nope', 'ru', FIX)).toBeUndefined()
  })

  it('names the file and field on invalid frontmatter', () => {
    expect(() => getProjects('ru', BROKEN)).toThrow(/bad[\\/]index\.ru\.mdx[\s\S]*externalUrl/)
  })

  it('finds the next page project, skipping links and wrapping', () => {
    expect(getNextProject('alpha', 'ru', FIX)?.slug).toBe('gamma')
    expect(getNextProject('gamma', 'ru', FIX)?.slug).toBe('alpha')
  })

  it('maps projects to cards with the right href', () => {
    expect(toCard(getProject('beta', 'ru', FIX)!, 'ru')).toMatchObject({ href: 'https://example.com', external: true })
    expect(toCard(getProject('alpha', 'en', FIX)!, 'en')).toMatchObject({ href: '/en/work/alpha', external: false })
  })
})

describe('site', () => {
  it('parses site.json', () => {
    const site = getSite(FIX)
    expect(site.name).toBe('TEST')
    expect(site.manifesto.en[1]).toEqual({ img: '/manifesto/01.svg' })
  })
})

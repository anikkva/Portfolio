import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAbout, getCv } from '@/lib/content/pages'
import { getPlayground } from '@/lib/content/playground'
import { getProjects } from '@/lib/content/projects'
import { getSite } from '@/lib/content/site'

const PUBLIC = path.join(process.cwd(), 'public')
const exists = (publicPath: string) => fs.existsSync(path.join(PUBLIC, publicPath))

describe('real content', () => {
  it('has 8 projects in both languages', () => {
    const ru = getProjects('ru')
    const en = getProjects('en')
    expect(ru).toHaveLength(8)
    expect(en).toHaveLength(8)
    expect(ru.map((p) => p.type).sort()).toEqual(['case', 'case', 'case', 'case', 'case', 'gallery', 'gallery', 'link'])
    en.forEach((p, i) => expect(p.title).not.toBe(ru[i].title))
  })

  it('references only existing media', () => {
    for (const lang of ['ru', 'en'] as const) {
      for (const p of getProjects(lang)) {
        expect(exists(p.cover), p.cover).toBe(true)
        for (const [, src] of p.body.matchAll(/(?:src|before|after)="([^"]+)"/g)) {
          expect(exists(src), `${p.slug}: ${src}`).toBe(true)
        }
      }
    }
  })

  it('parses site, about, cv and playground', () => {
    const site = getSite()
    expect(site.name).toBe('ANIKKVA')
    for (const token of [...site.manifesto.ru, ...site.manifesto.en]) {
      if (typeof token === 'object' && 'img' in token) expect(exists(token.img)).toBe(true)
    }
    for (const lang of ['ru', 'en'] as const) {
      expect(exists(getAbout(lang).photo)).toBe(true)
      expect(exists(getCv(lang).pdf)).toBe(true)
    }
    const playground = getPlayground()
    expect(playground).toHaveLength(9)
    playground.forEach((item) => expect(exists(item.media)).toBe(true))
  })
})

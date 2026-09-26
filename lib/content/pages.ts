import type { z } from 'zod'
import type { Locale } from '@/lib/i18n'
import { CONTENT_ROOT, localizedFile, parseWith, readMdx } from './load'
import { aboutSchema, cvSchema } from './schema'

export type About = z.output<typeof aboutSchema> & { body: string }
export type Cv = z.output<typeof cvSchema> & { body: string }

function readPage(base: string, lang: Locale, root: string) {
  const file = localizedFile(root, base, lang)
  if (!file) throw new Error(`Missing content/${base}.${lang}.mdx`)
  return { file, ...readMdx(file) }
}

export function getAbout(lang: Locale, root = CONTENT_ROOT): About {
  const { file, data, body } = readPage('about', lang, root)
  return { ...parseWith(aboutSchema, data, file), body }
}

export function getCv(lang: Locale, root = CONTENT_ROOT): Cv {
  const { file, data, body } = readPage('cv', lang, root)
  return { ...parseWith(cvSchema, data, file), body }
}

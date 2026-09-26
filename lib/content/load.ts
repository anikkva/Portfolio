import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'

export const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function parseWith<T extends z.ZodType>(schema: T, data: unknown, file: string): z.output<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`Invalid content in ${file}:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

export function readMdx(file: string): { data: unknown; body: string } {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  return { data, body: content }
}

export function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

/** `<dir>/<base>.<lang>.mdx`, falling back to the default locale. */
export function localizedFile(dir: string, base: string, lang: Locale): string | undefined {
  for (const candidate of [lang, DEFAULT_LOCALE]) {
    const file = path.join(dir, `${base}.${candidate}.mdx`)
    if (fs.existsSync(file)) return file
  }
  return undefined
}

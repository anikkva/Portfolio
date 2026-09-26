import path from 'node:path'
import type { z } from 'zod'
import { CONTENT_ROOT, parseWith, readJson } from './load'
import { siteSchema } from './schema'

export type Site = z.output<typeof siteSchema>

export function getSite(root = CONTENT_ROOT): Site {
  const file = path.join(root, 'site.json')
  return parseWith(siteSchema, readJson(file), file)
}

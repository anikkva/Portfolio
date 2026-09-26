import fs from 'node:fs'
import path from 'node:path'
import type { z } from 'zod'
import { CONTENT_ROOT, parseWith, readJson } from './load'
import { playgroundSchema } from './schema'

export type PlaygroundItem = z.output<typeof playgroundSchema> & { id: string }

export function getPlayground(root = CONTENT_ROOT): PlaygroundItem[] {
  const dir = path.join(root, 'playground')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const file = path.join(dir, name)
      return { ...parseWith(playgroundSchema, readJson(file), file), id: name.replace(/\.json$/, '') }
    })
}

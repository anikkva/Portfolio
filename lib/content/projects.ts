import fs from 'node:fs'
import path from 'node:path'
import type { Locale } from '@/lib/i18n'
import { CONTENT_ROOT, localizedFile, parseWith, readMdx } from './load'
import { projectSchema, type ProjectMeta } from './schema'

export type Project = ProjectMeta & { slug: string; body: string }

export type CardData = {
  slug: string
  title: string
  year: number
  role: string
  tags: string[]
  cover: string
  size: ProjectMeta['size']
  href: string
  external: boolean
}

function loadProject(dir: string, slug: string, lang: Locale): Project | undefined {
  const file = localizedFile(dir, 'index', lang)
  if (!file) return undefined
  const { data, body } = readMdx(file)
  return { ...parseWith(projectSchema, data, file), slug, body }
}

export function getProjects(lang: Locale, root = CONTENT_ROOT): Project[] {
  const dir = path.join(root, 'projects')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadProject(path.join(dir, entry.name), entry.name, lang))
    .filter((p): p is Project => p !== undefined)
    .sort((a, b) => a.order - b.order)
}

export function getProject(slug: string, lang: Locale, root = CONTENT_ROOT): Project | undefined {
  const dir = path.join(root, 'projects', slug)
  return fs.existsSync(dir) ? loadProject(dir, slug, lang) : undefined
}

export function getNextProject(slug: string, lang: Locale, root = CONTENT_ROOT): Project | undefined {
  const pages = getProjects(lang, root).filter((p) => p.type !== 'link')
  const index = pages.findIndex((p) => p.slug === slug)
  if (index === -1 || pages.length < 2) return undefined
  return pages[(index + 1) % pages.length]
}

export function toCard(p: Project, lang: Locale): CardData {
  const external = p.type === 'link'
  return {
    slug: p.slug,
    title: p.title,
    year: p.year,
    role: p.role,
    tags: p.tags,
    cover: p.cover,
    size: p.size,
    href: external ? p.externalUrl! : `/${lang}/work/${p.slug}`,
    external,
  }
}

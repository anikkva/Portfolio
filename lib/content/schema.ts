import { z } from 'zod'
import { PLAY_SCREENS } from '@/lib/playScreens'

const localized = z.object({ ru: z.string(), en: z.string() })
const publicPath = z.string().startsWith('/')

export const projectSchema = z
  .object({
    title: z.string().min(1),
    type: z.enum(['case', 'gallery', 'link']),
    externalUrl: z.url().optional(),
    year: z.number().int(),
    role: z.string(),
    team: z.string().optional(),
    duration: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: publicPath,
    size: z.enum(['S', 'M', 'L']).default('M'),
    order: z.number(),
    featured: z.boolean().default(true),
    /** Work in progress: kept in the repo, hidden from the site. */
    draft: z.boolean().default(false),
  })
  .refine((p) => p.type !== 'link' || p.externalUrl !== undefined, {
    message: 'externalUrl is required for type: link',
    path: ['externalUrl'],
  })

export type ProjectMeta = z.output<typeof projectSchema>

const manifestoToken = z.union([z.string(), z.object({ img: publicPath }), z.object({ sym: z.string() })])
export type ManifestoToken = z.output<typeof manifestoToken>

export const siteSchema = z.object({
  name: z.string(),
  role: localized,
  email: z.email(),
  socials: z.array(z.object({ label: z.string(), url: z.url() })),
  manifesto: z.object({ ru: z.array(manifestoToken), en: z.array(manifestoToken) }),
})

export const aboutSchema = z.object({
  title: z.string(),
  photo: publicPath,
  skills: z.array(z.string()),
  clients: z.array(z.string()),
})

export const cvSchema = z.object({
  title: z.string(),
  pdf: publicPath,
  experience: z.array(z.object({ years: z.string(), company: z.string(), role: z.string() })),
  education: z.array(z.object({ years: z.string(), place: z.string(), degree: z.string() })),
})

export const playgroundSchema = z
  .object({
    media: publicPath.optional(),
    screen: z.enum(PLAY_SCREENS).optional(),
    caption: localized,
    year: z.number().int(),
  })
  .refine((item) => (item.media === undefined) !== (item.screen === undefined), {
    message: 'set exactly one of media or screen',
  })

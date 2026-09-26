import GithubSlugger from 'github-slugger'

export type TocItem = { id: string; text: string }

const FENCE = '`'.repeat(3)

/** H2 headings with the same ids rehype-slug assigns (one slugger over all headings, in order). */
export function extractToc(body: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  let inFence = false
  for (const line of body.split('\n')) {
    if (line.trimStart().startsWith(FENCE)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue
    const id = slugger.slug(match[2])
    if (match[1].length === 2) items.push({ id, text: match[2] })
  }
  return items
}

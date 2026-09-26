export const VIEWS = ['random', 'grid', 'list'] as const
export type View = (typeof VIEWS)[number]

export function parseView(value: string | null): View {
  return (VIEWS as readonly string[]).includes(value ?? '') ? (value as View) : 'random'
}

export function parseSeed(value: string | null): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 1
}

/** Query string after choosing `view`; choosing random again reshuffles. */
export function nextViewQuery(current: { get(name: string): string | null }, view: View): string {
  const seed = parseSeed(current.get('seed'))
  const wasRandom = parseView(current.get('view')) === 'random'
  const nextSeed = view === 'random' && wasRandom ? seed + 1 : seed
  return new URLSearchParams({ view, seed: String(nextSeed) }).toString()
}

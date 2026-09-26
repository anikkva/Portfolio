export type CardSize = 'S' | 'M' | 'L'
export type Placement = { x: number; y: number; w: number; h: number; speed: number }
export type Scatter = { items: Placement[]; height: number }

/** Width in % of the container, ratio = height / width. */
const SIZES: Record<CardSize, { w: number; ratio: number }> = {
  S: { w: 20, ratio: 5 / 4 },
  M: { w: 28, ratio: 3 / 4 },
  L: { w: 40, ratio: 10 / 16 },
}

export const RATIO_CSS: Record<CardSize, string> = { S: '4 / 5', M: '4 / 3', L: '16 / 10' }

const EDGE = 2
const MOBILE_W = 76
const ROW_GAP = { min: 10, max: 16 }

export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function scatterLayout(sizes: CardSize[], seed: number, mode: 'desktop' | 'mobile'): Scatter {
  const rand = mulberry32(seed)
  const between = (min: number, max: number) => min + rand() * (max - min)
  const items: Placement[] = []
  let cursor = EDGE

  if (mode === 'mobile') {
    for (const size of sizes) {
      const h = MOBILE_W * SIZES[size].ratio
      items.push({ x: between(EDGE, 100 - EDGE - MOBILE_W), y: cursor, w: MOBILE_W, h, speed: 0 })
      cursor += h + between(8, 14)
    }
    return { items, height: cursor }
  }

  const place = (size: CardSize, minX: number, maxRight: number, top: number): Placement => {
    const { w, ratio } = SIZES[size]
    return { x: between(minX, maxRight - w), y: top + between(0, 8), w, h: w * ratio, speed: between(-0.12, 0.12) }
  }

  let i = 0
  while (i < sizes.length) {
    const first = sizes[i]
    const second = sizes[i + 1]
    const solo = second === undefined || first === 'L' || rand() < 0.2
    const row = solo
      ? [place(first, EDGE, 100 - EDGE, cursor)]
      : [place(first, EDGE, 50 - EDGE, cursor), place(second, 50 + EDGE, 100 - EDGE, cursor)]
    items.push(...row)
    cursor = Math.max(...row.map((p) => p.y + p.h)) + between(ROW_GAP.min, ROW_GAP.max)
    i += row.length
  }
  return { items, height: cursor }
}

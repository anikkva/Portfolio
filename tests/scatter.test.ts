import { describe, expect, it } from 'vitest'
import { scatterLayout, type CardSize } from '@/lib/scatter'

const SIZES: CardSize[] = ['L', 'M', 'M', 'S', 'L', 'M', 'S', 'S']

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

describe('scatterLayout', () => {
  it('is deterministic for a seed', () => {
    expect(scatterLayout(SIZES, 5, 'desktop')).toEqual(scatterLayout(SIZES, 5, 'desktop'))
  })

  it('changes with the seed', () => {
    expect(scatterLayout(SIZES, 5, 'desktop')).not.toEqual(scatterLayout(SIZES, 6, 'desktop'))
  })

  for (const mode of ['desktop', 'mobile'] as const) {
    it(`never overlaps and stays in bounds (${mode})`, () => {
      for (let seed = 1; seed <= 50; seed++) {
        const { items, height } = scatterLayout(SIZES, seed, mode)
        expect(items).toHaveLength(SIZES.length)
        items.forEach((a, i) => {
          expect(a.x).toBeGreaterThanOrEqual(0)
          expect(a.x + a.w).toBeLessThanOrEqual(100)
          expect(a.y + a.h).toBeLessThanOrEqual(height)
          items.slice(i + 1).forEach((b) => expect(overlaps(a, b)).toBe(false))
        })
      }
    })
  }

  it('keeps the heights consistent with card ratios', () => {
    const { items } = scatterLayout(['S', 'M', 'L'], 1, 'desktop')
    expect(items[0].h / items[0].w).toBeCloseTo(5 / 4)
    expect(items[1].h / items[1].w).toBeCloseTo(3 / 4)
    expect(items[2].h / items[2].w).toBeCloseTo(10 / 16)
  })

  it('has no parallax on mobile', () => {
    scatterLayout(SIZES, 3, 'mobile').items.forEach((p) => expect(p.speed).toBe(0))
  })
})

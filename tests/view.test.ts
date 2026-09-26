import { describe, expect, it } from 'vitest'
import { nextViewQuery, parseSeed, parseView } from '@/lib/view'

const q = (s: string) => new URLSearchParams(s)

describe('view params', () => {
  it('parses view with random as default', () => {
    expect(parseView('grid')).toBe('grid')
    expect(parseView(null)).toBe('random')
    expect(parseView('weird')).toBe('random')
  })

  it('parses seed as a positive integer, default 1', () => {
    expect(parseSeed('7')).toBe(7)
    expect(parseSeed(null)).toBe(1)
    expect(parseSeed('-3')).toBe(1)
    expect(parseSeed('abc')).toBe(1)
  })

  it('reshuffles when random is chosen again', () => {
    expect(nextViewQuery(q(''), 'random')).toBe('view=random&seed=2')
    expect(nextViewQuery(q('view=random&seed=3'), 'random')).toBe('view=random&seed=4')
  })

  it('keeps the seed when switching views', () => {
    expect(nextViewQuery(q('view=random&seed=3'), 'grid')).toBe('view=grid&seed=3')
    expect(nextViewQuery(q('view=grid&seed=3'), 'random')).toBe('view=random&seed=3')
  })
})

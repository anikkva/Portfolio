import { describe, expect, it } from 'vitest'
import { extractToc } from '@/lib/toc'

describe('extractToc', () => {
  it('collects H2 headings with rehype-slug compatible ids', () => {
    const fence = '`'.repeat(3)
    const body = ['## Задача', 'text', '### Детали', '## Result & Impact', fence, '## not a heading', fence, '## Задача'].join('\n')
    expect(extractToc(body)).toEqual([
      { id: 'задача', text: 'Задача' },
      { id: 'result--impact', text: 'Result & Impact' },
      { id: 'задача-1', text: 'Задача' },
    ])
  })

  it('returns an empty list without headings', () => {
    expect(extractToc('just text')).toEqual([])
  })
})

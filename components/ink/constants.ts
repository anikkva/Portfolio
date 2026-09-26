/** Alpha threshold after blur: keeps colour, turns soft edges into liquid ink edges. */
export const INK_THRESHOLD = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10'

export function filterId(reactId: string, prefix: string): string {
  return `${prefix}-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`
}

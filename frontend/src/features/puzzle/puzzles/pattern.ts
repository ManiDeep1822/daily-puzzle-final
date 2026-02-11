import { seededRandom } from '../engine/base'
import type { Puzzle } from '../engine/types'

export function generatePatternPuzzle(seed: number): Puzzle<string, number> {
  const rand = seededRandom(seed)

  const start = Math.floor(rand() * 5) + 1
  const step = Math.floor(rand() * 5) + 1

  const sequence = [start, start + step, start + 2 * step]

  return {
    question: `${sequence.join(', ')}, ?`,
    solution: start + 3 * step,
  }
}

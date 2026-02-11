import type { Puzzle } from '../engine/types'
import { seededRandom } from '../engine/base'

export function generateMathPuzzle(seed: number): Puzzle<string, number> {
  const rand = seededRandom(seed)

  const a = Math.floor(rand() * 50) + 1
  const b = Math.floor(rand() * 50) + 1

  return {
    question: `${a} + ${b} = ?`,
    solution: a + b,
  }
}

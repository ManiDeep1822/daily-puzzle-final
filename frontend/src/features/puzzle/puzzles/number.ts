import { seededRandom } from '../engine/base'
import type { Puzzle } from '../engine/types'

export function generateNumberPuzzle(seed: number): Puzzle<string, number> {
  const rand = seededRandom(seed)

  const n = Math.floor(rand() * 10) + 5

  return {
    question: `What is ${n} squared?`,
    solution: n * n,
  }
}

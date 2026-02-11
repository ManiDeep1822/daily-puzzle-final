import { seededRandom } from '../engine/base'
import type { Puzzle } from '../engine/types'

const TRIVIA = [
  { q: 'Capital of France?', a: 'paris' },
  { q: '5 + 7 = ?', a: '12' },
  { q: 'Color of sky?', a: 'blue' },
]

export function generateTriviaPuzzle(seed: number): Puzzle<string, string> {
  const rand = seededRandom(seed)

  const item = TRIVIA[Math.floor(rand() * TRIVIA.length)]

  return {
    question: item.q,
    solution: item.a,
  }
}

import { seededRandom } from '../engine/base'
import type { Puzzle } from '../engine/types'

const WORDS = ['react', 'typescript', 'puzzle', 'engine', 'daily']

export function generateWordPuzzle(seed: number): Puzzle<string, string> {
  const rand = seededRandom(seed)

  const word = WORDS[Math.floor(rand() * WORDS.length)]

  const scrambled = word
    .split('')
    .sort(() => rand() - 0.5)
    .join('')

  return {
    question: `Unscramble: ${scrambled}`,
    solution: word,
  }
}

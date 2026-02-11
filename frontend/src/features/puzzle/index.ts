import { getDailySeed } from './engine/seed'

import { generateMathPuzzle } from './puzzles/math'
import { generateWordPuzzle } from './puzzles/word'
import { generatePatternPuzzle } from './puzzles/pattern'
import { generateTriviaPuzzle } from './puzzles/trivia'
import { generateNumberPuzzle } from './puzzles/number'

const generators = [
  generateMathPuzzle,
  generateWordPuzzle,
  generatePatternPuzzle,
  generateTriviaPuzzle,
  generateNumberPuzzle,
]

export function getTodayPuzzle() {
  const seed = getDailySeed()
  const index = seed % generators.length
  return generators[index](seed)
}

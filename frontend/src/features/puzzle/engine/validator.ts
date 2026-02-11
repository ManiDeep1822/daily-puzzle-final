/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateAnswer(correct: any, user: any): boolean {
  if (typeof correct === 'string') {
    return String(user).toLowerCase().trim() === correct.toLowerCase()
  }
  return Number(user) === correct
}

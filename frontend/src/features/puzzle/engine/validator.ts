export function validateAnswer(correct: any, user: any): boolean {
  const c = String(correct).trim().toLowerCase()
  const u = String(user).trim().toLowerCase()

  // if both are numeric → compare as numbers
  if (!isNaN(Number(c)) && !isNaN(Number(u))) {
    return Number(c) === Number(u)
  }

  // otherwise compare as text
  return c === u
}

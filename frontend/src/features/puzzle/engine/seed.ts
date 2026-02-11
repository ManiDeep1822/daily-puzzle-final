export function getDailySeed(): number {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = today.getMonth() + 1
  const dd = today.getDate()

  return Number(
    `${yyyy}${mm.toString().padStart(2, '0')}${dd.toString().padStart(2, '0')}`,
  )
}

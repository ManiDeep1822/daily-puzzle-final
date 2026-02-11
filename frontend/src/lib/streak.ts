import { getStreak, saveStreak } from './indexeddb'

export async function updateStreak(today: string) {
  const existing = await getStreak()

  if (!existing) {
    const streak = { current: 1, lastCompletedDate: today }
    await saveStreak(streak)
    return streak
  }

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = yesterday.toISOString().slice(0, 10)

  let newCurrent = 1

  if (existing.lastCompletedDate === today) return existing

  if (existing.lastCompletedDate === yStr) {
    newCurrent = existing.current + 1
  }

  const updated = { current: newCurrent, lastCompletedDate: today }
  await saveStreak(updated)
  return updated
}

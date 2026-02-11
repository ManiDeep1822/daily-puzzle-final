import { openDB } from 'idb'

const DB_NAME = 'daily-puzzle-db'
const PROGRESS_STORE = 'progress'
const SYNC_STORE = 'sync_queue'
const STREAK_STORE = 'streak'

export interface PuzzleProgress {
  date: string
  answer: string
  correct: boolean
}

async function getDB() {
  return openDB(DB_NAME, 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'date' })
      }
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { autoIncrement: true })
      }
      if (!db.objectStoreNames.contains(STREAK_STORE)) {
        db.createObjectStore(STREAK_STORE)
      }
    },
  })
}

/* ---------- Progress ---------- */

export async function saveProgress(progress: PuzzleProgress) {
  const db = await getDB()
  await db.put(PROGRESS_STORE, progress)
}

export async function getProgress(date: string) {
  const db = await getDB()
  return db.get(PROGRESS_STORE, date)
}

/* ---------- Sync Queue ---------- */

export async function addToSyncQueue(progress: PuzzleProgress) {
  const db = await getDB()
  await db.add(SYNC_STORE, progress)
}

export async function getSyncQueue() {
  const db = await getDB()
  return db.getAll(SYNC_STORE)
}

export async function clearSyncQueue() {
  const db = await getDB()
  await db.clear(SYNC_STORE)
}

/* ---------- Streak ---------- */

export async function getStreak() {
  const db = await getDB()
  return db.get(STREAK_STORE, 'main')
}

export async function saveStreak(streak: {
  current: number
  lastCompletedDate: string
}) {
  const db = await getDB()
  await db.put(STREAK_STORE, streak, 'main')
}

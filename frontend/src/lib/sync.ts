import { getSyncQueue, clearSyncQueue } from './indexeddb'

const API = import.meta.env.VITE_API_URL

export async function syncProgress(jwt: string | null) {
  if (!jwt) return

  const queue = await getSyncQueue()
  if (queue.length === 0) return

  try {
    const res = await fetch(`${API}/progress/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ progress: queue }),
    })

    if (res.ok) {
      await clearSyncQueue()
      console.log('✅ Synced progress')
    }
  } catch {
    console.log('⚠️ Sync failed, retry later')
  }
}

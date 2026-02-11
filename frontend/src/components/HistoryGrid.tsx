/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { getProgress } from '../lib/indexeddb'

interface DayStatus {
  date: string
  correct: boolean | null
}

function getLastNDays(n: number): string[] {
  const days: string[] = []

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  return days
}

export default function HistoryGrid() {
  const [history, setHistory] = useState<DayStatus[]>([])

  useEffect(() => {
    const load = async () => {
      const dates = getLastNDays(30)

      const results: DayStatus[] = []

      for (const date of dates) {
        const progress = await getProgress(date)

        if (!progress) {
          results.push({ date, correct: null })
        } else {
          results.push({ date, correct: progress.correct })
        }
      }

      setHistory(results)
    }

    load()
  }, [])

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400 uppercase tracking-wider">
        Last 30 Days
      </p>

      <div className="grid grid-cols-10 gap-2 justify-center">
        {history.map((day) => {
          let color = 'bg-zinc-700'

          if (day.correct === true) color = 'bg-green-500'
          if (day.correct === false) color = 'bg-red-500'

          return (
            <div
              key={day.date}
              title={day.date}
              className={`w-6 h-6 rounded-md ${color}`}
            />
          )
        })}
      </div>
    </div>
  )
}

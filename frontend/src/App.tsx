/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './lib/firebase'
import { getTodayPuzzle } from './features/puzzle'
import { validateAnswer } from './features/puzzle/engine/validator'
import HistoryGrid from './components/HistoryGrid'

import {
  saveProgress,
  getProgress,
  addToSyncQueue,
  getSyncQueue,
  getStreak,
} from './lib/indexeddb'

import { syncProgress } from './lib/sync'
import { updateStreak } from './lib/streak'

const API = import.meta.env.VITE_API_URL

function App() {
  const [user, setUser] = useState<any>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [streakCount, setStreakCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const puzzle = useMemo(() => getTodayPuzzle(), [])

  /* ---------------- Load saved progress ---------------- */
  useEffect(() => {
    const load = async () => {
      const saved = await getProgress(today)

      if (saved) {
        if (saved.answer) {
          setAnswer(saved.answer)
        }

        const correct = Boolean(saved.correct)
        setResult(correct ? 'Correct 🎉' : 'Wrong ❌')

        if (correct) setLocked(true)
      }

      const s = await getStreak()
      if (s) setStreakCount(s.current)
    }

    load()
  }, [today])

  /* ---------------- Login ---------------- */
  const handleLogin = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await signInWithPopup(auth, googleProvider)
      setUser(res.user)

      const idToken = await res.user.getIdToken()

      const backendRes = await fetch(`${API}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!backendRes.ok) throw new Error('Backend auth failed')

      const data = await backendRes.json()
      setJwt(data.token)
    } catch (err: any) {
      console.error(err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    try {
      await syncProgress(jwt)
      await signOut(auth)
    } catch (e) {
      console.error(e)
    }

    setUser(null)
    setJwt(null)
    setAnswer('')
    setResult(null)
    setLocked(false)
  }

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (locked) return

    const trimmedAnswer = answer.trim()
    if (!trimmedAnswer) {
      setResult('Enter an answer ❗')
      return
    }

    const isCorrect = validateAnswer(puzzle.solution, trimmedAnswer)

    setResult(isCorrect ? 'Correct 🎉' : 'Wrong ❌')

    const progress = {
      date: today,
      answer: trimmedAnswer, // ALWAYS STRING
      correct: isCorrect,
    }

    await saveProgress(progress)
    await addToSyncQueue(progress)

    if (isCorrect) {
      setLocked(true)
      const streak = await updateStreak(today)
      setStreakCount(streak.current)
    }

    const queue = await getSyncQueue()
    if (queue.length >= 5) await syncProgress(jwt)
  }

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Daily Puzzle
          </h1>

          <p className="text-zinc-400 text-sm">
            Solve one puzzle every day. Keep your streak alive.
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : '🔐 Continue with Google'}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  /* =======================================================
     GAME SCREEN
  ======================================================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Daily Puzzle</h1>

        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-semibold">
            🔥 {streakCount}
          </span>

          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            Today’s Puzzle
          </p>

          <p className="text-4xl font-extrabold tracking-tight">
            {puzzle.question}
          </p>

          {/* Input */}
          <input
            type="text"
            value={answer}
            onChange={(e) => !locked && setAnswer(e.target.value)}
            disabled={locked}
            placeholder="Type your answer"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-40"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={locked}
            className="w-full py-3 rounded-xl font-semibold bg-white text-black hover:scale-[1.02] transition disabled:bg-zinc-600 disabled:text-zinc-300 disabled:scale-100 cursor-pointer"
          >
            {locked ? 'Come back tomorrow ⏳' : 'Submit Answer'}
          </button>

          {/* Result */}
          {result && (
            <p
              className={`text-lg font-semibold ${
                result.includes('Correct') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {result}
            </p>
          )}

          {/* History */}
          <HistoryGrid />
        </div>
      </main>
    </div>
  )
}

export default App

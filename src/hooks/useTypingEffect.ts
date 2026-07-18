import { useEffect, useRef, useState } from 'react'

const TYPING_INTERVAL_MS = 18
const CHARS_PER_TICK = 2

/**
 * Progressively reveals `text` to simulate the coach typing. Returns the
 * visible slice plus a `done` flag; restarts whenever `text` changes.
 */
export function useTypingEffect(text: string, enabled: boolean): { visible: string; done: boolean } {
  const [count, setCount] = useState(enabled ? 0 : text.length)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setCount(text.length)
      return
    }
    setCount(0)
    intervalRef.current = window.setInterval(() => {
      setCount((current) => {
        const next = current + CHARS_PER_TICK
        if (next >= text.length && intervalRef.current !== null) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return Math.min(next, text.length)
      })
    }, TYPING_INTERVAL_MS)

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    }
  }, [text, enabled])

  return { visible: text.slice(0, count), done: count >= text.length }
}

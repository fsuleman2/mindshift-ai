/** Deterministic djb2 string hash — used to pick template variants without a real RNG. */
function hashString(input: string): number {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return Math.abs(hash)
}

/**
 * Picks an item from a non-empty array deterministically based on a seed.
 * Same seed always yields the same item; different seeds spread across the
 * array. Used so AI responses vary by context (date, trigger, mood) instead
 * of feeling copy-pasted, while staying stable within a single situation.
 */
export function pickVariant<T>(items: readonly T[], seed: string): T {
  const index = hashString(seed) % items.length
  return items[index]
}

export function enforceWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()

  const truncated = words.slice(0, maxWords).join(' ')
  const lastSentenceEnd = Math.max(truncated.lastIndexOf('. '), truncated.lastIndexOf('! '))
  if (lastSentenceEnd > truncated.length * 0.5) {
    return truncated.slice(0, lastSentenceEnd + 1)
  }
  return `${truncated.replace(/[,;:]$/, '')}.`
}

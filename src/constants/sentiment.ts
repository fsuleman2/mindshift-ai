/** Lightweight keyword lists used for local sentiment scanning (no real NLU). */

export const POSITIVE_WORDS = [
  'good', 'great', 'happy', 'proud', 'strong', 'better', 'calm', 'relieved',
  'confident', 'excited', 'grateful', 'hopeful', 'motivated', 'clean', 'win',
]

export const NEGATIVE_WORDS = [
  'bad', 'sad', 'angry', 'anxious', 'stressed', 'stress', 'tired', 'lonely',
  'tempted', 'crave', 'craving', 'relapse', 'relapsed', 'slip', 'slipped',
  'struggling', 'overwhelmed', 'hopeless', 'frustrated', 'worried', 'ashamed',
]

export function scanSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase()
  const positiveHits = POSITIVE_WORDS.filter((w) => lower.includes(w)).length
  const negativeHits = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length

  if (negativeHits > positiveHits) return 'negative'
  if (positiveHits > negativeHits) return 'positive'
  return 'neutral'
}

export function findMatchedKeyword(text: string, vocabulary: string[]): string | null {
  const lower = text.toLowerCase()
  return vocabulary.find((word) => lower.includes(word)) ?? null
}

const MOOD_KEYWORDS: Record<'great' | 'angry' | 'anxious' | 'low', string[]> = {
  angry: ['angry', 'furious', 'mad', 'irritated', 'resentful', 'frustrated'],
  anxious: ['anxious', 'nervous', 'worried', 'panicked', 'on edge', 'tense', 'scared'],
  low: ['sad', 'down', 'low', 'depressed', 'hopeless', 'empty', 'exhausted', 'ashamed'],
  great: ['happy', 'great', 'good', 'proud', 'excited', 'grateful', 'confident', 'strong'],
}

/** Keyword-based mood detection for free-text journal entries; falls back to overall sentiment. */
export function detectMoodFromText(text: string): 'great' | 'okay' | 'low' | 'angry' | 'anxious' {
  const lower = text.toLowerCase()
  let bestMood: keyof typeof MOOD_KEYWORDS | null = null
  let bestHits = 0

  for (const mood of Object.keys(MOOD_KEYWORDS) as (keyof typeof MOOD_KEYWORDS)[]) {
    const hits = MOOD_KEYWORDS[mood].filter((w) => lower.includes(w)).length
    if (hits > bestHits) {
      bestHits = hits
      bestMood = mood
    }
  }

  if (bestMood) return bestMood

  const sentiment = scanSentiment(text)
  if (sentiment === 'positive') return 'great'
  if (sentiment === 'negative') return 'low'
  return 'okay'
}

export type Mood = 'great' | 'okay' | 'low' | 'angry' | 'anxious'

export const MOOD_EMOJI: Record<Mood, string> = {
  great: '😊',
  okay: '😐',
  low: '😔',
  angry: '😡',
  anxious: '😰',
}

export const MOOD_LABEL: Record<Mood, string> = {
  great: 'Great',
  okay: 'Okay',
  low: 'Low',
  angry: 'Angry',
  anxious: 'Anxious',
}

/** Higher is better; used by RiskCalculator's mood weighting. */
export const MOOD_SCORE: Record<Mood, number> = {
  great: 100,
  okay: 70,
  low: 40,
  angry: 25,
  anxious: 20,
}

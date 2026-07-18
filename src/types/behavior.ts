import type { Mood } from './mood'

export interface EmotionPoint {
  date: string
  mood: Mood
}

export type MoodTrend = 'improving' | 'stable' | 'declining'

export interface BehaviorState {
  streak: number
  longestStreak: number
  triggerFrequency: Record<string, number>
  cravingTimeHistogram: Record<string, number>
  emotionHistory: EmotionPoint[]
  moodTrend: MoodTrend
  journalSentimentAvg: number
  confidence: number
  totalCheckIns: number
  totalJournalEntries: number
}

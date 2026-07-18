import type { Mood } from './mood'

export interface JournalAnalysis {
  mood: Mood
  trigger: string
  lesson: string
  actionPlan: string
}

export interface JournalEntry {
  id: string
  createdAt: string
  text: string
  analysis: JournalAnalysis
}

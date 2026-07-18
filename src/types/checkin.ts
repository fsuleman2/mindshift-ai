import type { Mood } from './mood'

export interface DailyCheckIn {
  id: string
  date: string
  mood: Mood
  feeling: string
  biggestChallenge: string
  sleepQuality: number
  /** Whether the user stayed clean of their habit today; drives streak and risk. */
  stayedClean: boolean
  createdAt: string
}

export type EmergencyTrigger = 'stress' | 'bored' | 'lonely' | 'habit' | 'anxiety' | 'other'

export interface EmergencyEvent {
  id: string
  createdAt: string
  trigger: EmergencyTrigger
  note?: string
  resolved: boolean
}

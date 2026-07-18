import type { HabitId } from './habit'
import type { TimeOfDay } from './time'

export type RecoveryStyle = 'structured' | 'flexible' | 'social' | 'independent'

export interface AssessmentAnswers {
  habit: HabitId
  customHabitLabel?: string
  frequencyPerDay: number
  timeOfDay: TimeOfDay[]
  primaryTrigger: string
  stressLevel: number
  sleepQuality: number
  motivationReason: string
  triedBefore: boolean
  whatWorkedBefore?: string
  biggestFear: string
  supportSystem: 'strong' | 'some' | 'none'
  motivationLevel: number
}

export interface AIProfile {
  habit: HabitId
  customHabitLabel?: string
  primaryTrigger: string
  peakCravingTime: TimeOfDay
  stressLevel: number
  motivation: number
  estimatedDifficulty: 'easy' | 'moderate' | 'hard' | 'very-hard'
  riskScore: number
  strengths: string[]
  weaknesses: string[]
  recoveryStyle: RecoveryStyle
  createdAt: string
}

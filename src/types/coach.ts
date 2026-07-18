export type CoachRole = 'user' | 'coach'

export interface CoachMessage {
  id: string
  role: CoachRole
  content: string
  createdAt: string
}

export interface RecoveryBlueprint {
  biggestTrigger: string
  bestStrategy: string
  dailyRoutine: string[]
  weeklyGoal: string
  estimatedTimeline: string
  personalMotivation: string
  createdAt: string
}

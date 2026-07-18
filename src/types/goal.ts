export type GoalCadence = 'daily' | 'weekly'

export interface Goal {
  id: string
  text: string
  cadence: GoalCadence
  completed: boolean
  createdAt: string
  completedAt?: string
}

export type AchievementId =
  | 'first-checkin'
  | 'first-journal'
  | 'streak-3'
  | 'streak-7'
  | 'streak-14'
  | 'streak-30'
  | 'streak-90'
  | 'first-emergency-survived'
  | 'ten-journals'
  | 'risk-under-control'

export interface Achievement {
  id: AchievementId
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

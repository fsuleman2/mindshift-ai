export type RiskLevel = 'safe' | 'moderate' | 'high' | 'critical'

export interface RiskFactors {
  triggerScore: number
  moodScore: number
  streakScore: number
  sleepScore: number
  timeScore: number
}

export interface RiskResult {
  score: number
  level: RiskLevel
  factors: RiskFactors
}

export interface RiskHistoryEntry {
  id: string
  date: string
  score: number
  level: RiskLevel
}

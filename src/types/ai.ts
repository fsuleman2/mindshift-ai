import type { AIProfile } from './assessment'
import type { EmergencyTrigger } from './checkin'
import type { RiskLevel } from './risk'
import type { TimeOfDay } from './time'

export type AISurface = 'coach' | 'emergency' | 'journal-analysis' | 'blueprint' | 'daily-tip'

export interface AIContext {
  profile: AIProfile | null
  motivationReason: string
  streak: number
  riskLevel: RiskLevel
  riskScore: number
  timeOfDay: TimeOfDay
  recentMoodTrend: 'improving' | 'stable' | 'declining'
}

export interface AIRequest {
  surface: AISurface
  systemPrompt: string
  context: AIContext
  userInput?: string
  emergencyTrigger?: EmergencyTrigger
}

export interface AIResponse {
  text: string
  surface: AISurface
  generatedAt: string
  source: 'template' | 'fallback'
}

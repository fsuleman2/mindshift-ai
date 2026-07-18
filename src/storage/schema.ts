import type {
  AIProfile,
  AppSettings,
  AssessmentAnswers,
  Achievement,
  CoachMessage,
  DailyCheckIn,
  EmergencyEvent,
  Goal,
  JournalEntry,
  RecoveryBlueprint,
  RiskHistoryEntry,
} from '@/types'

export const SCHEMA_VERSION = 1

export const STORAGE_PREFIX = 'mindshift'

export const STORAGE_KEYS = {
  profile: 'profile',
  assessment: 'assessment',
  journal: 'journal',
  dailyCheckins: 'dailyCheckins',
  riskHistory: 'riskHistory',
  goals: 'goals',
  settings: 'settings',
  coachHistory: 'coachHistory',
  recoveryBlueprint: 'recoveryBlueprint',
  emergencyEvents: 'emergencyEvents',
  achievements: 'achievements',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export interface StorageSchema {
  profile: AIProfile | null
  assessment: AssessmentAnswers | null
  journal: JournalEntry[]
  dailyCheckins: DailyCheckIn[]
  riskHistory: RiskHistoryEntry[]
  goals: Goal[]
  settings: AppSettings
  coachHistory: CoachMessage[]
  recoveryBlueprint: RecoveryBlueprint | null
  emergencyEvents: EmergencyEvent[]
  achievements: Achievement[]
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  displayName: '',
  reminderTime: '20:00',
  remindersEnabled: false,
  reducedMotion: false,
}

export const STORAGE_DEFAULTS: StorageSchema = {
  profile: null,
  assessment: null,
  journal: [],
  dailyCheckins: [],
  riskHistory: [],
  goals: [],
  settings: DEFAULT_SETTINGS,
  coachHistory: [],
  recoveryBlueprint: null,
  emergencyEvents: [],
  achievements: [],
}

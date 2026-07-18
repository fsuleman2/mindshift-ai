import { clearAllStorage, readStorage, writeStorage } from '@/storage/storageCore'
import { DEFAULT_SETTINGS } from '@/storage/schema'
import type {
  AIProfile,
  Achievement,
  AppSettings,
  AssessmentAnswers,
  CoachMessage,
  DailyCheckIn,
  EmergencyEvent,
  Goal,
  JournalEntry,
  RecoveryBlueprint,
  RiskHistoryEntry,
} from '@/types'

/**
 * Typed, domain-oriented facade over localStorage. Every page/hook should go
 * through this service rather than touching storageCore directly, so storage
 * shape changes stay isolated to one file.
 */
export const StorageService = {
  getProfile(): AIProfile | null {
    return readStorage('profile')
  },
  setProfile(profile: AIProfile): void {
    writeStorage('profile', profile)
  },
  hasCompletedOnboarding(): boolean {
    return readStorage('profile') !== null
  },

  getAssessment(): AssessmentAnswers | null {
    return readStorage('assessment')
  },
  setAssessment(answers: AssessmentAnswers): void {
    writeStorage('assessment', answers)
  },

  getJournal(): JournalEntry[] {
    return readStorage('journal')
  },
  addJournalEntry(entry: JournalEntry): void {
    const entries = readStorage('journal')
    writeStorage('journal', [entry, ...entries])
  },

  getCheckIns(): DailyCheckIn[] {
    return readStorage('dailyCheckins')
  },
  addCheckIn(checkIn: DailyCheckIn): void {
    const checkIns = readStorage('dailyCheckins')
    writeStorage('dailyCheckins', [checkIn, ...checkIns])
  },
  getTodayCheckIn(): DailyCheckIn | null {
    const today = new Date().toISOString().slice(0, 10)
    return readStorage('dailyCheckins').find((c) => c.date === today) ?? null
  },

  getRiskHistory(): RiskHistoryEntry[] {
    return readStorage('riskHistory')
  },
  addRiskEntry(entry: RiskHistoryEntry): void {
    const history = readStorage('riskHistory')
    writeStorage('riskHistory', [entry, ...history])
  },

  getGoals(): Goal[] {
    return readStorage('goals')
  },
  setGoals(goals: Goal[]): void {
    writeStorage('goals', goals)
  },

  getSettings(): AppSettings {
    return readStorage('settings')
  },
  updateSettings(patch: Partial<AppSettings>): AppSettings {
    const merged = { ...readStorage('settings'), ...patch }
    writeStorage('settings', merged)
    return merged
  },
  resetSettings(): void {
    writeStorage('settings', DEFAULT_SETTINGS)
  },

  getCoachHistory(): CoachMessage[] {
    return readStorage('coachHistory')
  },
  appendCoachMessage(message: CoachMessage): void {
    const history = readStorage('coachHistory')
    writeStorage('coachHistory', [...history, message])
  },
  clearCoachHistory(): void {
    writeStorage('coachHistory', [])
  },

  getBlueprint(): RecoveryBlueprint | null {
    return readStorage('recoveryBlueprint')
  },
  setBlueprint(blueprint: RecoveryBlueprint): void {
    writeStorage('recoveryBlueprint', blueprint)
  },

  getEmergencyEvents(): EmergencyEvent[] {
    return readStorage('emergencyEvents')
  },
  addEmergencyEvent(event: EmergencyEvent): void {
    const events = readStorage('emergencyEvents')
    writeStorage('emergencyEvents', [event, ...events])
  },

  getAchievements(): Achievement[] {
    return readStorage('achievements')
  },
  setAchievements(achievements: Achievement[]): void {
    writeStorage('achievements', achievements)
  },

  exportAll() {
    return {
      profile: readStorage('profile'),
      assessment: readStorage('assessment'),
      journal: readStorage('journal'),
      dailyCheckins: readStorage('dailyCheckins'),
      riskHistory: readStorage('riskHistory'),
      goals: readStorage('goals'),
      settings: readStorage('settings'),
      coachHistory: readStorage('coachHistory'),
      recoveryBlueprint: readStorage('recoveryBlueprint'),
      emergencyEvents: readStorage('emergencyEvents'),
      achievements: readStorage('achievements'),
    }
  },

  resetAll(): void {
    clearAllStorage()
  },
}

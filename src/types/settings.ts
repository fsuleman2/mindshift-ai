export type ThemeMode = 'light' | 'dark' | 'system'

export interface AppSettings {
  theme: ThemeMode
  displayName: string
  reminderTime: string
  remindersEnabled: boolean
  reducedMotion: boolean
}

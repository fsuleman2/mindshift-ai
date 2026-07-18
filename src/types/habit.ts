export type HabitId =
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'gaming'
  | 'smoking'
  | 'alcohol'
  | 'pornography'
  | 'sugar'
  | 'procrastination'
  | 'custom'

export interface HabitDefinition {
  id: HabitId
  label: string
  tagline: string
  icon: string
  triggerVocabulary: string[]
  replacementActivities: string[]
}

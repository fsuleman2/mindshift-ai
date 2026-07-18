import type { EmergencyTrigger } from '@/types'

export interface EmergencyTriggerOption {
  id: EmergencyTrigger
  label: string
  icon: string
}

export const EMERGENCY_TRIGGERS: EmergencyTriggerOption[] = [
  { id: 'stress', label: 'Stress', icon: 'Zap' },
  { id: 'bored', label: 'Bored', icon: 'Coffee' },
  { id: 'lonely', label: 'Lonely', icon: 'Heart' },
  { id: 'habit', label: 'Habit', icon: 'Repeat' },
  { id: 'anxiety', label: 'Anxiety', icon: 'CloudRain' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal' },
]

export const EMERGENCY_RESPONSE_DELAY_MS = 500

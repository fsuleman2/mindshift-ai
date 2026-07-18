import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useBehaviorState } from './useBehaviorState'
import { useRiskScore } from './useRiskScore'
import { getTimeOfDay } from '@/utils/date'
import type { AIContext } from '@/types'

export function useAIContext(): AIContext {
  const profile = useLocalStorage('profile')
  const assessment = useLocalStorage('assessment')
  const behavior = useBehaviorState()
  const risk = useRiskScore()

  return useMemo<AIContext>(
    () => ({
      profile,
      motivationReason: assessment?.motivationReason ?? '',
      streak: behavior.streak,
      riskLevel: risk.level,
      riskScore: risk.score,
      timeOfDay: getTimeOfDay(),
      recentMoodTrend: behavior.moodTrend,
    }),
    [profile, assessment, behavior.streak, behavior.moodTrend, risk.level, risk.score],
  )
}

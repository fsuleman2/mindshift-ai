import { useMemo } from 'react'
import { useBehaviorState } from './useBehaviorState'
import { useRiskScore } from './useRiskScore'
import { clamp } from '@/utils/date'
import {
  RECOVERY_BASE,
  RECOVERY_ENGAGEMENT_WEIGHT,
  RECOVERY_RISK_WEIGHT,
  RECOVERY_STREAK_MAX_POINTS,
  RECOVERY_STREAK_POINTS_PER_DAY,
} from '@/constants/recovery'

/**
 * Headline 0-100 "Recovery Score": low risk, a growing streak, and consistent
 * engagement (check-ins/journals) all push it up.
 */
export function useRecoveryScore(): number {
  const behavior = useBehaviorState()
  const risk = useRiskScore()

  return useMemo(() => {
    const riskContribution = (100 - risk.score) * RECOVERY_RISK_WEIGHT
    const streakContribution = Math.min(
      behavior.streak * RECOVERY_STREAK_POINTS_PER_DAY,
      RECOVERY_STREAK_MAX_POINTS,
    )
    const engagementContribution = behavior.confidence * RECOVERY_ENGAGEMENT_WEIGHT

    return Math.round(
      clamp(RECOVERY_BASE + riskContribution + streakContribution + engagementContribution, 0, 100),
    )
  }, [risk.score, behavior.streak, behavior.confidence])
}

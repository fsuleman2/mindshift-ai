import { useEffect, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useBehaviorState } from './useBehaviorState'
import { calculateRisk } from '@/services/riskCalculator'
import { StorageService } from '@/services/storageService'
import { getTimeOfDay, todayISO } from '@/utils/date'
import { generateId } from '@/utils/id'
import type { RiskHistoryEntry } from '@/types'

/** Live risk score for the current session, plus a once-per-day snapshot to riskHistory. */
export function useRiskScore() {
  const profile = useLocalStorage('profile')
  const checkIns = useLocalStorage('dailyCheckins')
  const behavior = useBehaviorState()

  const latestCheckIn = useMemo(() => {
    if (checkIns.length === 0) return null
    return [...checkIns].sort((a, b) => b.date.localeCompare(a.date))[0]
  }, [checkIns])

  const result = useMemo(
    () =>
      calculateRisk({
        profile,
        latestCheckIn,
        streak: behavior.streak,
        currentTimeOfDay: getTimeOfDay(),
      }),
    [profile, latestCheckIn, behavior.streak],
  )

  useEffect(() => {
    if (!profile) return
    const today = todayISO()
    const alreadyRecorded = StorageService.getRiskHistory().some((entry) => entry.date === today)
    if (alreadyRecorded) return

    const entry: RiskHistoryEntry = {
      id: generateId(),
      date: today,
      score: result.score,
      level: result.level,
    }
    StorageService.addRiskEntry(entry)
  }, [profile, result.score, result.level])

  return result
}

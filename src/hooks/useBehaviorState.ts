import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { buildBehaviorState } from '@/services/behaviorEngine'

export function useBehaviorState() {
  const checkIns = useLocalStorage('dailyCheckins')
  const journal = useLocalStorage('journal')
  const emergencyEvents = useLocalStorage('emergencyEvents')

  return useMemo(
    () => buildBehaviorState(checkIns, journal, emergencyEvents),
    [checkIns, journal, emergencyEvents],
  )
}

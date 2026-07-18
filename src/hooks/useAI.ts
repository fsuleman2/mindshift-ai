import { useCallback } from 'react'
import { useAIContext } from './useAIContext'
import { PromptBuilder } from '@/services/promptBuilder'
import { AIService } from '@/services/aiService'
import type { EmergencyTrigger } from '@/types'

/** Component-facing entry point to the mock AI layer — pages should use this, not AIService directly. */
export function useAI() {
  const context = useAIContext()

  const getCoachOpening = useCallback(
    () => AIService.generate(PromptBuilder.buildCoachOpeningRequest(context)),
    [context],
  )
  const getCoachReply = useCallback(
    (userInput: string) => AIService.generate(PromptBuilder.buildCoachReplyRequest(context, userInput)),
    [context],
  )
  const getEmergencyResponse = useCallback(
    (trigger: EmergencyTrigger, note?: string) =>
      AIService.generate(PromptBuilder.buildEmergencyRequest(context, trigger, note)),
    [context],
  )
  const getDailyTip = useCallback(
    () => AIService.generate(PromptBuilder.buildDailyTipRequest(context)),
    [context],
  )

  return { context, getCoachOpening, getCoachReply, getEmergencyResponse, getDailyTip }
}

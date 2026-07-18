import { SYSTEM_PROMPT } from '@/prompts/systemPrompt'
import type { AIContext, AIRequest, AISurface, EmergencyTrigger } from '@/types'

/**
 * Builds structured AIRequest objects — the same shape a real Gemini call
 * would receive (system prompt + serialized context + user input). This is
 * the seam where a live LLM integration would plug in without touching
 * callers, since every page only ever talks to PromptBuilder + AIService.
 */
function buildRequest(
  surface: AISurface,
  context: AIContext,
  extra: Partial<Pick<AIRequest, 'userInput' | 'emergencyTrigger'>> = {},
): AIRequest {
  return { surface, systemPrompt: SYSTEM_PROMPT, context, ...extra }
}

export const PromptBuilder = {
  buildCoachOpeningRequest(context: AIContext): AIRequest {
    return buildRequest('coach', context)
  },
  buildCoachReplyRequest(context: AIContext, userInput: string): AIRequest {
    return buildRequest('coach', context, { userInput })
  },
  buildEmergencyRequest(context: AIContext, trigger: EmergencyTrigger, note?: string): AIRequest {
    return buildRequest('emergency', context, { emergencyTrigger: trigger, userInput: note })
  },
  buildDailyTipRequest(context: AIContext): AIRequest {
    return buildRequest('daily-tip', context)
  },
  buildJournalAnalysisRequest(context: AIContext, journalText: string): AIRequest {
    return buildRequest('journal-analysis', context, { userInput: journalText })
  },
  buildBlueprintRequest(context: AIContext): AIRequest {
    return buildRequest('blueprint', context)
  },
}

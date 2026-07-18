import { describe, expect, it } from 'vitest'
import { PromptBuilder } from './promptBuilder'

const context = {
  profile: null,
  motivationReason: 'feel better',
  streak: 3,
  riskLevel: 'moderate' as const,
  riskScore: 42,
  timeOfDay: 'evening' as const,
  recentMoodTrend: 'stable' as const,
}

describe('PromptBuilder', () => {
  it('creates request objects for every supported AI surface', () => {
    expect(PromptBuilder.buildCoachOpeningRequest(context)).toMatchObject({ surface: 'coach', context })
    expect(PromptBuilder.buildCoachReplyRequest(context, 'I need help')).toMatchObject({ surface: 'coach', userInput: 'I need help' })
    expect(PromptBuilder.buildEmergencyRequest(context, 'stress', 'At work')).toMatchObject({
      surface: 'emergency', emergencyTrigger: 'stress', userInput: 'At work',
    })
    expect(PromptBuilder.buildDailyTipRequest(context).surface).toBe('daily-tip')
    expect(PromptBuilder.buildJournalAnalysisRequest(context, 'Today was hard')).toMatchObject({
      surface: 'journal-analysis', userInput: 'Today was hard',
    })
    expect(PromptBuilder.buildBlueprintRequest(context).surface).toBe('blueprint')
  })
})

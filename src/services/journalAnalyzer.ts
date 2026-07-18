import type { HabitId, JournalAnalysis } from '@/types'
import { HABITS } from '@/constants/habits'
import { detectMoodFromText, findMatchedKeyword } from '@/constants/sentiment'
import { pickVariant } from '@/utils/textVariant'
import { ACTION_PLAN_TEMPLATES, LESSON_TEMPLATES } from '@/prompts/templates/journal'

export interface JournalAnalyzerContext {
  habitId?: HabitId
  customHabitLabel?: string
  primaryTrigger?: string
}

function resolveTrigger(text: string, ctx: JournalAnalyzerContext): string {
  const vocabulary = HABITS[ctx.habitId ?? 'custom'].triggerVocabulary
  const matched = findMatchedKeyword(text, vocabulary)
  if (matched) return matched
  if (ctx.primaryTrigger) return ctx.primaryTrigger
  return 'an unclear trigger'
}

function resolveHabitLabel(ctx: JournalAnalyzerContext): string {
  if (ctx.habitId === 'custom' && ctx.customHabitLabel) return ctx.customHabitLabel
  return HABITS[ctx.habitId ?? 'custom'].label
}

/**
 * Extracts structured signal (mood, trigger, lesson, action plan) from a raw
 * journal entry using local keyword heuristics — no network call, so this
 * works fully offline and instantly.
 */
export const JournalAnalyzer = {
  analyze(text: string, ctx: JournalAnalyzerContext = {}): JournalAnalysis {
    const mood = detectMoodFromText(text)
    const trigger = resolveTrigger(text, ctx)
    const habitLabel = resolveHabitLabel(ctx)
    const seed = `${text.length}-${trigger}-${mood}`

    const lesson = pickVariant(LESSON_TEMPLATES, `${seed}-lesson`)(trigger, habitLabel)
    const replacementActivity = pickVariant(HABITS[ctx.habitId ?? 'custom'].replacementActivities, `${seed}-activity`)
    const actionPlan = pickVariant(ACTION_PLAN_TEMPLATES, `${seed}-action`)(trigger, replacementActivity)

    return { mood, trigger, lesson, actionPlan }
  },
}

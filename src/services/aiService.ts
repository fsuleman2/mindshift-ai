import type { AIRequest, AIResponse, HabitId } from '@/types'
import { HABITS } from '@/constants/habits'
import { enforceWordLimit, pickVariant } from '@/utils/textVariant'
import { scanSentiment, findMatchedKeyword } from '@/constants/sentiment'
import { todayISO } from '@/utils/date'
import {
  BREATHING_EXERCISES,
  ENCOURAGEMENT_CLOSE,
  GOAL_REMINDER_TEMPLATES,
  REPLACEMENT_TEMPLATES,
  VALIDATION_BY_TRIGGER,
} from '@/prompts/templates/emergency'
import {
  GREETING_BY_TIME,
  OPENING_QUESTION,
  PEAK_TIME_CALLOUT,
  REPLY_NEGATIVE,
  REPLY_NEUTRAL,
  REPLY_POSITIVE,
  REPLY_TRIGGER_MENTION,
  STREAK_CALLOUT,
} from '@/prompts/templates/coach'
import { DAILY_TIPS } from '@/prompts/templates/dailyTip'

const EMERGENCY_WORD_LIMIT = 120
const COACH_WORD_LIMIT = 120

const FALLBACK_EMERGENCY =
  "This urge is real, and it will pass — most cravings peak within 10-15 minutes. Try slow breathing: in for 4 counts, out for 6, five times. Step away from where you are, even just to another room. Whatever brought you here, you're allowed to change your mind about what happens next. You've gotten through hard moments before — this can be another one."

const FALLBACK_COACH =
  "I'm here with you. Tell me a little about what's going on right now, and we'll work through it together."

const FALLBACK_TIP = 'Progress in recovery is built one decision at a time. The next one is the one that matters.'

const TIME_LABEL: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
}

function habitDefinition(habitId: HabitId | undefined) {
  return HABITS[habitId ?? 'custom']
}

function getHabitLabel(habitId: HabitId | undefined, customLabel?: string): string {
  if (!habitId) return 'this habit'
  if (habitId === 'custom' && customLabel) return customLabel
  return habitDefinition(habitId).label
}

function getReplacementActivity(habitId: HabitId | undefined, seed: string): string {
  const activities = habitDefinition(habitId).replacementActivities
  return pickVariant(activities, seed)
}

function generateEmergencyResponse(request: AIRequest): string {
  const { context, emergencyTrigger } = request
  if (!emergencyTrigger) return FALLBACK_EMERGENCY

  const habitId = context.profile?.habit
  const habitLabel = getHabitLabel(habitId, context.profile?.customHabitLabel)
  const seedBase = `${todayISO()}-${emergencyTrigger}-${habitId ?? 'none'}-${context.streak}`

  const validation = pickVariant(VALIDATION_BY_TRIGGER[emergencyTrigger], `${seedBase}-v`)(habitLabel)
  const breathing = pickVariant(BREATHING_EXERCISES, `${seedBase}-b`)
  const replacementActivity = getReplacementActivity(habitId, `${seedBase}-r`)
  const replacement = pickVariant(REPLACEMENT_TEMPLATES, `${seedBase}-rt`)(replacementActivity)
  const motivationReason = context.motivationReason.trim() || 'the person you\'re becoming'
  const goalReminder = pickVariant(GOAL_REMINDER_TEMPLATES, `${seedBase}-g`)(context.streak, motivationReason)
  const encouragement = pickVariant(ENCOURAGEMENT_CLOSE, `${seedBase}-e`)

  return [validation, breathing, replacement, goalReminder, encouragement].join(' ')
}

function generateCoachOpening(request: AIRequest): string {
  const { context } = request
  const habitId = context.profile?.habit
  const timeOfDay = context.timeOfDay
  const seedBase = `${todayISO()}-coach-open-${habitId ?? 'none'}`

  const greeting = pickVariant(GREETING_BY_TIME[timeOfDay], `${seedBase}-g`)
  const parts = [greeting]

  if (context.profile?.peakCravingTime === timeOfDay) {
    parts.push(pickVariant(PEAK_TIME_CALLOUT, `${seedBase}-p`)(TIME_LABEL[timeOfDay] ?? timeOfDay))
  } else if (context.streak > 0) {
    parts.push(pickVariant(STREAK_CALLOUT, `${seedBase}-s`)(context.streak))
  }

  parts.push(pickVariant(OPENING_QUESTION, `${seedBase}-q`))
  return parts.join(' ')
}

function generateCoachReply(request: AIRequest): string {
  const { context, userInput } = request
  if (!userInput?.trim()) return FALLBACK_COACH

  const habitId = context.profile?.habit
  const habitLabel = getHabitLabel(habitId, context.profile?.customHabitLabel)
  const trigger = context.profile?.primaryTrigger ?? 'that trigger'
  const vocabulary = habitDefinition(habitId).triggerVocabulary
  const seedBase = `${userInput.length}-${todayISO()}-${habitId ?? 'none'}`

  const matchedKeyword = findMatchedKeyword(userInput, vocabulary)
  const sentiment = scanSentiment(userInput)

  if (matchedKeyword) {
    const replacementActivity = getReplacementActivity(habitId, `${seedBase}-r`)
    return pickVariant(REPLY_TRIGGER_MENTION, `${seedBase}-t`)(habitLabel, replacementActivity)
  }
  if (sentiment === 'negative') {
    return pickVariant(REPLY_NEGATIVE, `${seedBase}-n`)(habitLabel, trigger)
  }
  if (sentiment === 'positive') {
    return pickVariant(REPLY_POSITIVE, `${seedBase}-p`)(context.streak)
  }
  return pickVariant(REPLY_NEUTRAL, `${seedBase}-u`)
}

function generateDailyTip(request: AIRequest): string {
  const { context } = request
  const habitLabel = getHabitLabel(context.profile?.habit, context.profile?.customHabitLabel)
  const seed = `${todayISO()}-tip-${context.profile?.habit ?? 'none'}`
  return pickVariant(DAILY_TIPS, seed)(habitLabel, context.streak)
}

function generate(request: AIRequest): AIResponse {
  const generatedAt = new Date().toISOString()

  let text: string
  let source: AIResponse['source'] = 'template'

  switch (request.surface) {
    case 'emergency': {
      text = enforceWordLimit(generateEmergencyResponse(request), EMERGENCY_WORD_LIMIT)
      if (!request.emergencyTrigger) source = 'fallback'
      break
    }
    case 'coach': {
      text = request.userInput ? generateCoachReply(request) : generateCoachOpening(request)
      text = enforceWordLimit(text, COACH_WORD_LIMIT)
      if (!request.userInput?.trim() && !request.context.profile) source = 'fallback'
      break
    }
    case 'daily-tip': {
      text = request.context.profile ? generateDailyTip(request) : FALLBACK_TIP
      if (!request.context.profile) source = 'fallback'
      break
    }
    default: {
      // 'journal-analysis' and 'blueprint' surfaces are composed field-by-field
      // by JournalAnalyzer / RecoveryPlanner, which call the exported template
      // pickers directly rather than this generic text path.
      text = FALLBACK_COACH
      source = 'fallback'
    }
  }

  return { text, surface: request.surface, generatedAt, source }
}

export const AIService = {
  generate,
}

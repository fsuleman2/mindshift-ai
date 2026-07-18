import type { AIProfile, AssessmentAnswers, RecoveryBlueprint, RecoveryStyle } from '@/types'
import { HABITS } from '@/constants/habits'
import { clamp } from '@/utils/date'
import { pickVariant } from '@/utils/textVariant'
import {
  BASELINE_RISK_FREQUENCY_WEIGHT,
  BASELINE_RISK_MOTIVATION_RELIEF,
  BASELINE_RISK_SLEEP_WEIGHT,
  BASELINE_RISK_STRESS_WEIGHT,
  DIFFICULTY_THRESHOLDS,
  FREQUENCY_DIFFICULTY_MULTIPLIER,
  HIGH_FREQUENCY_THRESHOLD,
  HIGH_STRESS_THRESHOLD,
  INDEPENDENT_MOTIVATION_THRESHOLD,
  LOW_SLEEP_THRESHOLD,
  MAX_FREQUENCY_WEIGHT,
  MOTIVATION_DIFFICULTY_RELIEF,
  STRESS_DIFFICULTY_MULTIPLIER,
  STRONG_MOTIVATION_THRESHOLD,
  SUPPORT_NONE_DIFFICULTY_PENALTY,
  SUPPORT_SOME_DIFFICULTY_PENALTY,
  TRIED_BEFORE_DIFFICULTY_PENALTY,
} from '@/constants/assessment'
import {
  MOTIVATION_TEMPLATES,
  STRATEGY_BY_RECOVERY_STYLE,
  TIMELINE_BY_DIFFICULTY,
  WEEKLY_GOAL_TEMPLATES,
} from '@/prompts/templates/blueprint'

function habitLabelFor(answers: AssessmentAnswers): string {
  if (answers.habit === 'custom' && answers.customHabitLabel) return answers.customHabitLabel
  return HABITS[answers.habit].label
}

function deriveDifficulty(answers: AssessmentAnswers): AIProfile['estimatedDifficulty'] {
  const frequencyContribution = Math.min(answers.frequencyPerDay, MAX_FREQUENCY_WEIGHT) * FREQUENCY_DIFFICULTY_MULTIPLIER
  const score = clamp(
    frequencyContribution +
      answers.stressLevel * STRESS_DIFFICULTY_MULTIPLIER +
      (answers.triedBefore ? TRIED_BEFORE_DIFFICULTY_PENALTY : 0) +
      (answers.supportSystem === 'none'
        ? SUPPORT_NONE_DIFFICULTY_PENALTY
        : answers.supportSystem === 'some'
          ? SUPPORT_SOME_DIFFICULTY_PENALTY
          : 0) -
      answers.motivationLevel * MOTIVATION_DIFFICULTY_RELIEF,
    0,
    100,
  )

  if (score < DIFFICULTY_THRESHOLDS.easy) return 'easy'
  if (score < DIFFICULTY_THRESHOLDS.moderate) return 'moderate'
  if (score < DIFFICULTY_THRESHOLDS.hard) return 'hard'
  return 'very-hard'
}

function deriveBaselineRisk(answers: AssessmentAnswers): number {
  const frequencyContribution = Math.min(answers.frequencyPerDay, MAX_FREQUENCY_WEIGHT) * BASELINE_RISK_FREQUENCY_WEIGHT
  return Math.round(
    clamp(
      answers.stressLevel * BASELINE_RISK_STRESS_WEIGHT +
        (10 - answers.sleepQuality) * BASELINE_RISK_SLEEP_WEIGHT +
        frequencyContribution -
        answers.motivationLevel * BASELINE_RISK_MOTIVATION_RELIEF,
      0,
      100,
    ),
  )
}

function deriveRecoveryStyle(answers: AssessmentAnswers): RecoveryStyle {
  if (answers.supportSystem === 'strong') return 'social'
  if (answers.triedBefore && answers.whatWorkedBefore) return 'structured'
  if (answers.motivationLevel >= INDEPENDENT_MOTIVATION_THRESHOLD) return 'independent'
  return 'flexible'
}

function deriveStrengths(answers: AssessmentAnswers): string[] {
  const strengths: string[] = []
  if (answers.supportSystem === 'strong') strengths.push('You have a strong support system to lean on.')
  if (answers.motivationLevel >= STRONG_MOTIVATION_THRESHOLD) strengths.push('Your motivation level is high, which predicts stronger follow-through.')
  if (answers.triedBefore && answers.whatWorkedBefore) {
    strengths.push(`You already know a strategy that has worked before: ${answers.whatWorkedBefore}.`)
  }
  if (strengths.length === 0) strengths.push('You took the first step by starting this assessment honestly.')
  return strengths
}

function deriveWeaknesses(answers: AssessmentAnswers): string[] {
  const weaknesses: string[] = []
  if (answers.sleepQuality < LOW_SLEEP_THRESHOLD) weaknesses.push('Poor sleep quality is likely intensifying your cravings.')
  if (answers.stressLevel >= HIGH_STRESS_THRESHOLD) weaknesses.push('A high baseline stress level increases relapse risk.')
  if (answers.supportSystem === 'none') weaknesses.push('You currently don\'t have a support system in place.')
  if (answers.frequencyPerDay >= HIGH_FREQUENCY_THRESHOLD) weaknesses.push('This habit loop is frequent and deeply ingrained, so early days will be the hardest.')
  if (weaknesses.length === 0) weaknesses.push('No major risk factors stand out yet — keep tracking to surface real patterns.')
  return weaknesses
}

/**
 * The "AI Analysis" step: deterministically maps raw assessment answers into
 * a structured AIProfile. No network call — this is pure computation over
 * the answers the user just gave.
 */
function buildProfile(answers: AssessmentAnswers): AIProfile {
  return {
    habit: answers.habit,
    customHabitLabel: answers.customHabitLabel,
    primaryTrigger: answers.primaryTrigger,
    peakCravingTime: answers.timeOfDay[0] ?? 'evening',
    stressLevel: answers.stressLevel,
    motivation: answers.motivationLevel,
    estimatedDifficulty: deriveDifficulty(answers),
    riskScore: deriveBaselineRisk(answers),
    strengths: deriveStrengths(answers),
    weaknesses: deriveWeaknesses(answers),
    recoveryStyle: deriveRecoveryStyle(answers),
    createdAt: new Date().toISOString(),
  }
}

function buildDailyRoutine(profile: AIProfile, answers: AssessmentAnswers, habitLabel: string): string[] {
  const replacementActivity = pickVariant(HABITS[profile.habit].replacementActivities, `${profile.createdAt}-routine`)
  const peakLabel = profile.peakCravingTime.charAt(0).toUpperCase() + profile.peakCravingTime.slice(1)

  return [
    'Morning: spend 2 minutes setting your intention for the day and reviewing your goal.',
    `${peakLabel}: your highest-risk window for ${habitLabel.toLowerCase()} — have "${replacementActivity.toLowerCase()}" ready before the urge hits.`,
    'Evening: complete your daily check-in and note anything that felt like a trigger today.',
    answers.supportSystem !== 'none'
      ? 'Weekly: check in with someone in your support system about how the week went.'
      : 'Weekly: journal about one moment you handled well, even if it was small.',
  ]
}

/** Generates the Recovery Blueprint shown after assessment, using the profile just computed. */
function buildBlueprint(profile: AIProfile, answers: AssessmentAnswers): RecoveryBlueprint {
  const habitLabel = habitLabelFor(answers)
  const seed = profile.createdAt

  const bestStrategy = pickVariant(STRATEGY_BY_RECOVERY_STYLE[profile.recoveryStyle], `${seed}-strategy`)(
    habitLabel,
    profile.primaryTrigger,
  )
  const weeklyGoal = pickVariant(WEEKLY_GOAL_TEMPLATES, `${seed}-goal`)(habitLabel, profile.estimatedDifficulty)
  const personalMotivation = pickVariant(MOTIVATION_TEMPLATES, `${seed}-motivation`)(answers.motivationReason)

  return {
    biggestTrigger: profile.primaryTrigger,
    bestStrategy,
    dailyRoutine: buildDailyRoutine(profile, answers, habitLabel),
    weeklyGoal,
    estimatedTimeline: TIMELINE_BY_DIFFICULTY[profile.estimatedDifficulty],
    personalMotivation,
    createdAt: new Date().toISOString(),
  }
}

export const RecoveryPlanner = {
  buildProfile,
  buildBlueprint,
}

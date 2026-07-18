import type { AIProfile, DailyCheckIn, RiskFactors, RiskLevel, RiskResult } from '@/types'
import { MOOD_SCORE } from '@/types'
import { clamp, type TimeOfDay } from '@/utils/date'
import {
  RISK_THRESHOLDS,
  RISK_WEIGHTS,
  SLEEP_QUALITY_MAX,
  STREAK_RISK_DECAY_PER_DAY,
  STREAK_RISK_FLOOR,
  STRESS_LEVEL_MAX,
  TIME_ADJACENT_BUCKET_RISK,
  TIME_EXACT_MATCH_RISK,
  TIME_UNRELATED_BUCKET_RISK,
  TRIGGER_KEYWORD_MATCH_BONUS,
} from '@/constants/risk'
import { TIME_BUCKETS } from '@/constants/behavior'

export interface RiskCalculatorInput {
  profile: AIProfile | null
  latestCheckIn: DailyCheckIn | null
  streak: number
  currentTimeOfDay: TimeOfDay
}

function scoreTrigger(profile: AIProfile | null, latestCheckIn: DailyCheckIn | null): number {
  const base = ((profile?.stressLevel ?? STRESS_LEVEL_MAX / 2) / STRESS_LEVEL_MAX) * 100
  const mentionsTrigger =
    !!profile?.primaryTrigger &&
    !!latestCheckIn?.biggestChallenge &&
    latestCheckIn.biggestChallenge.toLowerCase().includes(profile.primaryTrigger.toLowerCase())

  return clamp(base + (mentionsTrigger ? TRIGGER_KEYWORD_MATCH_BONUS : 0), 0, 100)
}

function scoreMood(latestCheckIn: DailyCheckIn | null): number {
  const moodValue = latestCheckIn ? MOOD_SCORE[latestCheckIn.mood] : MOOD_SCORE.okay
  return clamp(100 - moodValue, 0, 100)
}

function scoreStreak(streak: number): number {
  return clamp(100 - streak * STREAK_RISK_DECAY_PER_DAY, STREAK_RISK_FLOOR, 100)
}

function scoreSleep(latestCheckIn: DailyCheckIn | null): number {
  const sleepQuality = latestCheckIn?.sleepQuality ?? SLEEP_QUALITY_MAX / 2
  return clamp(100 - (sleepQuality / SLEEP_QUALITY_MAX) * 100, 0, 100)
}

function bucketDistance(a: TimeOfDay, b: TimeOfDay): number {
  const ai = TIME_BUCKETS.indexOf(a)
  const bi = TIME_BUCKETS.indexOf(b)
  const diff = Math.abs(ai - bi)
  return Math.min(diff, TIME_BUCKETS.length - diff)
}

function scoreTime(profile: AIProfile | null, currentTimeOfDay: TimeOfDay): number {
  const peak = profile?.peakCravingTime as TimeOfDay | undefined
  if (!peak || !TIME_BUCKETS.includes(peak)) return TIME_UNRELATED_BUCKET_RISK

  const distance = bucketDistance(peak, currentTimeOfDay)
  if (distance === 0) return TIME_EXACT_MATCH_RISK
  if (distance === 1) return TIME_ADJACENT_BUCKET_RISK
  return TIME_UNRELATED_BUCKET_RISK
}

function levelFor(score: number): RiskLevel {
  if (score < RISK_THRESHOLDS.safe) return 'safe'
  if (score < RISK_THRESHOLDS.moderate) return 'moderate'
  if (score < RISK_THRESHOLDS.high) return 'high'
  return 'critical'
}

export function calculateRisk(input: RiskCalculatorInput): RiskResult {
  const factors: RiskFactors = {
    triggerScore: scoreTrigger(input.profile, input.latestCheckIn),
    moodScore: scoreMood(input.latestCheckIn),
    streakScore: scoreStreak(input.streak),
    sleepScore: scoreSleep(input.latestCheckIn),
    timeScore: scoreTime(input.profile, input.currentTimeOfDay),
  }

  const score = Math.round(
    factors.triggerScore * RISK_WEIGHTS.trigger +
      factors.moodScore * RISK_WEIGHTS.mood +
      factors.streakScore * RISK_WEIGHTS.streak +
      factors.sleepScore * RISK_WEIGHTS.sleep +
      factors.timeScore * RISK_WEIGHTS.time,
  )

  return { score, level: levelFor(score), factors }
}

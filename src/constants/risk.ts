/** Weighted risk model tuning — see RiskCalculator. Weights must sum to 1. */

export const RISK_WEIGHTS = {
  trigger: 0.4,
  mood: 0.2,
  streak: 0.15,
  sleep: 0.15,
  time: 0.1,
} as const

export const RISK_THRESHOLDS = {
  safe: 30,
  moderate: 55,
  high: 80,
} as const

export const TRIGGER_KEYWORD_MATCH_BONUS = 30
export const STREAK_RISK_DECAY_PER_DAY = 6
export const STREAK_RISK_FLOOR = 8
export const SLEEP_QUALITY_MAX = 10
export const STRESS_LEVEL_MAX = 10

export const TIME_ADJACENT_BUCKET_RISK = 50
export const TIME_UNRELATED_BUCKET_RISK = 20
export const TIME_EXACT_MATCH_RISK = 100

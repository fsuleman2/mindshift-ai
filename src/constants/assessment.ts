/** Tuning constants for RecoveryPlanner's assessment -> profile mapping. No magic numbers in the logic itself. */

export const DIFFICULTY_THRESHOLDS = {
  easy: 25,
  moderate: 50,
  hard: 75,
} as const

export const MAX_FREQUENCY_WEIGHT = 20
export const FREQUENCY_DIFFICULTY_MULTIPLIER = 2
export const STRESS_DIFFICULTY_MULTIPLIER = 3
export const TRIED_BEFORE_DIFFICULTY_PENALTY = 10
export const SUPPORT_NONE_DIFFICULTY_PENALTY = 15
export const SUPPORT_SOME_DIFFICULTY_PENALTY = 7
export const MOTIVATION_DIFFICULTY_RELIEF = 2

export const BASELINE_RISK_STRESS_WEIGHT = 6
export const BASELINE_RISK_SLEEP_WEIGHT = 4
export const BASELINE_RISK_FREQUENCY_WEIGHT = 2
export const BASELINE_RISK_MOTIVATION_RELIEF = 3

export const STRONG_MOTIVATION_THRESHOLD = 7
export const HIGH_STRESS_THRESHOLD = 7
export const LOW_SLEEP_THRESHOLD = 5
export const HIGH_FREQUENCY_THRESHOLD = 8
export const INDEPENDENT_MOTIVATION_THRESHOLD = 8

/** Tuning constants for BehaviorEngine — kept centralized so no magic numbers appear in the logic itself. */

export const CONFIDENCE_PER_DATA_POINT = 4
export const MAX_CONFIDENCE = 100

export const TREND_WINDOW = 3
export const TREND_IMPROVING_THRESHOLD = 8
export const TREND_DECLINING_THRESHOLD = -8

export const TIME_BUCKETS = ['morning', 'afternoon', 'evening', 'night'] as const

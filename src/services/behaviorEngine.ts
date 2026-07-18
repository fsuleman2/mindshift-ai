import type { BehaviorState, DailyCheckIn, EmergencyEvent, EmotionPoint, JournalEntry, MoodTrend } from '@/types'
import { MOOD_SCORE } from '@/types'
import { daysAgoISO, daysBetween, getTimeOfDay, todayISO } from '@/utils/date'
import {
  CONFIDENCE_PER_DATA_POINT,
  MAX_CONFIDENCE,
  TIME_BUCKETS,
  TREND_DECLINING_THRESHOLD,
  TREND_IMPROVING_THRESHOLD,
  TREND_WINDOW,
} from '@/constants/behavior'

/**
 * Pure, deterministic computations over stored user history. No I/O — callers
 * (hooks/services) are responsible for fetching data via StorageService.
 */

export function computeStreak(checkIns: DailyCheckIn[]): { current: number; longest: number } {
  if (checkIns.length === 0) return { current: 0, longest: 0 }

  const byDate = new Map(checkIns.map((c) => [c.date, c]))
  const sortedDates = [...byDate.keys()].sort()

  let longest = 0
  let run = 0
  let prevDate: string | null = null
  for (const date of sortedDates) {
    const entry = byDate.get(date)!
    const contiguous = prevDate === null || daysBetween(date, prevDate) === 1
    run = entry.stayedClean ? (contiguous ? run + 1 : 1) : 0
    longest = Math.max(longest, run)
    prevDate = date
  }

  let current = 0
  let cursor = byDate.has(todayISO()) ? todayISO() : sortedDates[sortedDates.length - 1]
  while (byDate.has(cursor)) {
    const entry = byDate.get(cursor)!
    if (!entry.stayedClean) break
    current += 1
    cursor = daysAgoISO(1, new Date(cursor))
  }

  return { current, longest }
}

export function computeTriggerFrequency(
  journal: JournalEntry[],
  emergencyEvents: EmergencyEvent[],
): Record<string, number> {
  const frequency: Record<string, number> = {}

  for (const entry of journal) {
    const trigger = entry.analysis.trigger.toLowerCase().trim()
    if (!trigger) continue
    frequency[trigger] = (frequency[trigger] ?? 0) + 1
  }
  for (const event of emergencyEvents) {
    frequency[event.trigger] = (frequency[event.trigger] ?? 0) + 1
  }

  return frequency
}

export function computeCravingTimeHistogram(emergencyEvents: EmergencyEvent[]): Record<string, number> {
  const histogram: Record<string, number> = Object.fromEntries(TIME_BUCKETS.map((b) => [b, 0]))
  for (const event of emergencyEvents) {
    const bucket = getTimeOfDay(new Date(event.createdAt))
    histogram[bucket] = (histogram[bucket] ?? 0) + 1
  }
  return histogram
}

export function computeEmotionHistory(checkIns: DailyCheckIn[]): EmotionPoint[] {
  return [...checkIns]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => ({ date: c.date, mood: c.mood }))
}

export function computeMoodTrend(emotionHistory: EmotionPoint[]): MoodTrend {
  if (emotionHistory.length < 2) return 'stable'

  const recent = emotionHistory.slice(-TREND_WINDOW)
  const prior = emotionHistory.slice(-TREND_WINDOW * 2, -TREND_WINDOW)
  if (prior.length === 0) return 'stable'

  const avg = (points: EmotionPoint[]) =>
    points.reduce((sum, p) => sum + MOOD_SCORE[p.mood], 0) / points.length

  const delta = avg(recent) - avg(prior)
  if (delta >= TREND_IMPROVING_THRESHOLD) return 'improving'
  if (delta <= TREND_DECLINING_THRESHOLD) return 'declining'
  return 'stable'
}

export function computeJournalSentimentAvg(journal: JournalEntry[]): number {
  if (journal.length === 0) return MOOD_SCORE.okay
  const total = journal.reduce((sum, entry) => sum + MOOD_SCORE[entry.analysis.mood], 0)
  return Math.round(total / journal.length)
}

export function computeConfidence(
  checkIns: DailyCheckIn[],
  journal: JournalEntry[],
  emergencyEvents: EmergencyEvent[],
): number {
  const dataPoints = checkIns.length + journal.length + emergencyEvents.length
  return Math.min(MAX_CONFIDENCE, dataPoints * CONFIDENCE_PER_DATA_POINT)
}

export function buildBehaviorState(
  checkIns: DailyCheckIn[],
  journal: JournalEntry[],
  emergencyEvents: EmergencyEvent[],
): BehaviorState {
  const { current, longest } = computeStreak(checkIns)
  const emotionHistory = computeEmotionHistory(checkIns)

  return {
    streak: current,
    longestStreak: longest,
    triggerFrequency: computeTriggerFrequency(journal, emergencyEvents),
    cravingTimeHistogram: computeCravingTimeHistogram(emergencyEvents),
    emotionHistory,
    moodTrend: computeMoodTrend(emotionHistory),
    journalSentimentAvg: computeJournalSentimentAvg(journal),
    confidence: computeConfidence(checkIns, journal, emergencyEvents),
    totalCheckIns: checkIns.length,
    totalJournalEntries: journal.length,
  }
}

import { describe, expect, it, vi } from 'vitest'
import {
  buildBehaviorState,
  computeCravingTimeHistogram,
  computeMoodTrend,
  computeStreak,
  computeTriggerFrequency,
} from './behaviorEngine'

const checkIn = (date: string, stayedClean: boolean, mood: 'great' | 'okay' | 'low' | 'angry' | 'anxious' = 'okay') => ({
  id: date, date, stayedClean, mood, feeling: '', biggestChallenge: '', sleepQuality: 7, createdAt: `${date}T12:00:00.000Z`,
})

describe('behavior engine', () => {
  it('calculates current and longest streaks across slips and date gaps', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-18T12:00:00.000Z'))
    expect(computeStreak([
      checkIn('2026-07-10', true), checkIn('2026-07-11', true), checkIn('2026-07-12', false),
      checkIn('2026-07-16', true), checkIn('2026-07-17', true), checkIn('2026-07-18', true),
    ])).toEqual({ current: 3, longest: 3 })
    vi.useRealTimers()
  })

  it('aggregates trigger and craving-time signals', () => {
    expect(computeTriggerFrequency(
      [{ id: 'j', createdAt: '', text: '', analysis: { mood: 'okay', trigger: ' Stress ', lesson: '', actionPlan: '' } }],
      [{ id: 'e', createdAt: '2026-01-01T18:00:00', trigger: 'stress', resolved: false }],
    )).toEqual({ stress: 2 })
    expect(computeCravingTimeHistogram([{ id: 'e', createdAt: '2026-01-01T18:00:00', trigger: 'stress', resolved: false }])).toMatchObject({ evening: 1, morning: 0 })
  })

  it('detects improving, declining, and stable mood trends', () => {
    expect(computeMoodTrend([
      { date: '1', mood: 'anxious' }, { date: '2', mood: 'low' }, { date: '3', mood: 'okay' },
      { date: '4', mood: 'great' }, { date: '5', mood: 'great' }, { date: '6', mood: 'great' },
    ])).toBe('improving')
    expect(computeMoodTrend([
      { date: '1', mood: 'great' }, { date: '2', mood: 'great' }, { date: '3', mood: 'okay' },
      { date: '4', mood: 'low' }, { date: '5', mood: 'anxious' }, { date: '6', mood: 'anxious' },
    ])).toBe('declining')
    expect(computeMoodTrend([{ date: '1', mood: 'okay' }])).toBe('stable')
  })

  it('builds an aggregated behavior state', () => {
    expect(buildBehaviorState([checkIn('2026-01-01', true, 'great')], [], [])).toMatchObject({
      longestStreak: 1, journalSentimentAvg: 70, confidence: 4, totalCheckIns: 1,
    })
  })
})

import { describe, expect, it } from 'vitest'
import { calculateRisk } from './riskCalculator'

describe('calculateRisk', () => {
  it('returns the low-risk defaults when no profile or check-in is available', () => {
    const result = calculateRisk({
      profile: null,
      latestCheckIn: null,
      streak: 20,
      currentTimeOfDay: 'morning',
    })

    expect(result).toEqual({
      score: 37,
      level: 'moderate',
      factors: {
        triggerScore: 50,
        moodScore: 30,
        streakScore: 8,
        sleepScore: 50,
        timeScore: 20,
      },
    })
  })

  it('raises risk for an exact peak time and a named trigger', () => {
    const result = calculateRisk({
      profile: {
        habit: 'smoking', primaryTrigger: 'stress', peakCravingTime: 'evening', stressLevel: 10,
        motivation: 4, estimatedDifficulty: 'hard', riskScore: 80, strengths: [], weaknesses: [],
        recoveryStyle: 'structured', createdAt: '2026-01-01T00:00:00.000Z',
      },
      latestCheckIn: {
        id: 'check-in', date: '2026-01-01', mood: 'anxious', feeling: '',
        biggestChallenge: 'Work stress was overwhelming', sleepQuality: 1, stayedClean: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      streak: 0,
      currentTimeOfDay: 'evening',
    })

    expect(result.factors).toEqual({
      triggerScore: 100, moodScore: 80, streakScore: 100, sleepScore: 90, timeScore: 100,
    })
    expect(result).toMatchObject({ score: 95, level: 'critical' })
  })

  it('uses adjacent and unrelated time-bucket risk appropriately', () => {
    const profile = {
      habit: 'phone' as const, primaryTrigger: 'bored', peakCravingTime: 'night' as const, stressLevel: 1,
      motivation: 8, estimatedDifficulty: 'easy' as const, riskScore: 10, strengths: [], weaknesses: [],
      recoveryStyle: 'independent' as const, createdAt: '2026-01-01T00:00:00.000Z',
    }

    expect(calculateRisk({ profile, latestCheckIn: null, streak: 1, currentTimeOfDay: 'morning' }).factors.timeScore).toBe(50)
    expect(calculateRisk({ profile, latestCheckIn: null, streak: 1, currentTimeOfDay: 'afternoon' }).factors.timeScore).toBe(20)
  })
})

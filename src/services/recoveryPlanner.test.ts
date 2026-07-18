import { describe, expect, it, vi } from 'vitest'
import { RecoveryPlanner } from './recoveryPlanner'

const answers = {
  habit: 'smoking' as const, frequencyPerDay: 12, timeOfDay: ['evening' as const], primaryTrigger: 'stress',
  stressLevel: 9, sleepQuality: 3, motivationReason: 'Be healthier for my family', triedBefore: true,
  whatWorkedBefore: 'Going for a walk', biggestFear: 'failing', supportSystem: 'none' as const, motivationLevel: 8,
}

describe('RecoveryPlanner', () => {
  it('derives a profile with risks, strengths, and a recovery style', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const profile = RecoveryPlanner.buildProfile(answers)
    expect(profile).toMatchObject({
      habit: 'smoking', peakCravingTime: 'evening', estimatedDifficulty: 'hard', riskScore: 82,
      recoveryStyle: 'structured', createdAt: '2026-01-01T00:00:00.000Z',
    })
    expect(profile.strengths).toContain('Your motivation level is high, which predicts stronger follow-through.')
    expect(profile.weaknesses).toHaveLength(4)
    vi.useRealTimers()
  })

  it('builds a personalized blueprint with a daily routine', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const profile = RecoveryPlanner.buildProfile(answers)
    const blueprint = RecoveryPlanner.buildBlueprint(profile, answers)
    expect(blueprint).toMatchObject({ biggestTrigger: 'stress', createdAt: profile.createdAt })
    expect(blueprint.dailyRoutine).toHaveLength(4)
    expect(blueprint.dailyRoutine[1]).toContain('Evening')
    vi.useRealTimers()
  })
})

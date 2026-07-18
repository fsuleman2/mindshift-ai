import { describe, expect, it } from 'vitest'
import { JournalAnalyzer } from './journalAnalyzer'

describe('JournalAnalyzer', () => {
  it('extracts a matching habit trigger and mood from journal text', () => {
    const analysis = JournalAnalyzer.analyze('I feel anxious and stressed after work.', { habitId: 'smoking' })
    expect(analysis.mood).toBe('anxious')
    expect(analysis.trigger).toBe('stress')
    expect(analysis.lesson).not.toBe('')
    expect(analysis.actionPlan).not.toBe('')
  })

  it('falls back to the primary trigger and custom habit label', () => {
    const analysis = JournalAnalyzer.analyze('Today was ordinary.', {
      habitId: 'custom', customHabitLabel: 'Late-night shopping', primaryTrigger: 'loneliness',
    })
    expect(analysis).toMatchObject({ mood: 'okay', trigger: 'loneliness' })
    expect(analysis.lesson.toLowerCase()).toContain('late-night shopping')
  })
})

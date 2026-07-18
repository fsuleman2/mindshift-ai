import { describe, expect, it, vi } from 'vitest'
import { clamp, daysBetween, formatRelativeDate, getTimeOfDay } from './date'
import { generateId } from './id'
import { cn } from './cn'
import { enforceWordLimit, pickVariant } from './textVariant'

describe('utility functions', () => {
  it('picks deterministic variants and safely limits prose', () => {
    expect(pickVariant(['a', 'b', 'c'], 'same-seed')).toBe(pickVariant(['a', 'b', 'c'], 'same-seed'))
    expect(enforceWordLimit('One two three four five.', 3)).toBe('One two three.')
    expect(enforceWordLimit('One. Two three four five.', 4)).toBe('One. Two three four.')
  })

  it('handles date and numeric boundaries', () => {
    expect(daysBetween('2026-01-02', '2026-01-01')).toBe(1)
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(getTimeOfDay(new Date(2026, 0, 1, 5))).toBe('morning')
    expect(getTimeOfDay(new Date(2026, 0, 1, 22))).toBe('night')
  })

  it('formats relative dates and provides safe UI utility helpers', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-18T12:00:00.000Z'))
    expect(formatRelativeDate('2026-07-18')).toBe('Today')
    expect(formatRelativeDate('2026-07-17')).toBe('Yesterday')
    expect(formatRelativeDate('2026-07-10')).toBe('8 days ago')
    vi.useRealTimers()
    expect(generateId()).toMatch(/.+/)
    expect(cn('px-2 text-red-500', 'px-4')).toBe('text-red-500 px-4')
  })
})

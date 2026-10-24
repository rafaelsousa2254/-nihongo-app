import { describe, it, expect } from 'vitest'
import { cn, formatNumber, getLevelFromXp, getXpForLevel, getGreeting, formatDate, calculateStreak } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'extra')
    expect(result).toContain('base')
    expect(result).toContain('extra')
    expect(result).not.toContain('hidden')
  })
})

describe('formatNumber', () => {
  it('formats numbers with Brazilian locale', () => {
    expect(formatNumber(1000)).toBe('1.000')
    expect(formatNumber(1000000)).toBe('1.000.000')
    expect(formatNumber(42)).toBe('42')
  })
})

describe('getLevelFromXp', () => {
  it('returns level 1 for 0 xp', () => {
    expect(getLevelFromXp(0)).toBe(1)
  })

  it('returns level 2 for 100 xp', () => {
    expect(getLevelFromXp(100)).toBe(2)
  })

  it('returns level 3 for 200 xp', () => {
    expect(getLevelFromXp(200)).toBe(3)
  })

  it('returns correct level for fractional xp', () => {
    expect(getLevelFromXp(150)).toBe(2)
    expect(getLevelFromXp(299)).toBe(3)
  })
})

describe('getXpForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(getXpForLevel(1)).toBe(0)
  })

  it('returns 100 for level 2', () => {
    expect(getXpForLevel(2)).toBe(100)
  })

  it('returns 200 for level 3', () => {
    expect(getXpForLevel(3)).toBe(200)
  })
})

describe('getGreeting', () => {
  it('returns a string', () => {
    const greeting = getGreeting()
    expect(typeof greeting).toBe('string')
  })

  it('returns one of the three greetings', () => {
    const greeting = getGreeting()
    expect(['Bom dia', 'Boa tarde', 'Boa noite']).toContain(greeting)
  })
})

describe('formatDate', () => {
  it('formats date string', () => {
    const result = formatDate('2024-01-15T00:00:00')
    expect(result).toMatch(/\d{2}\/01\/2024/)
  })

  it('formats Date object', () => {
    const result = formatDate(new Date(2024, 11, 25))
    expect(result).toBe('25/12/2024')
  })
})

describe('calculateStreak', () => {
  it('returns 0 when no last study date', () => {
    expect(calculateStreak(undefined, 0)).toBe(0)
  })

  it('returns current streak when studied today', () => {
    const today = new Date().toISOString()
    expect(calculateStreak(today, 5)).toBe(5)
  })

  it('returns 0 when more than 1 day passed', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(calculateStreak(twoDaysAgo, 5)).toBe(0)
  })
})

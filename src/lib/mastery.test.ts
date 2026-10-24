import { describe, it, expect } from 'vitest'
import {
  calculateMasteryScore,
  getMasteryLevel,
  calculateMastery,
  MASTERY_COLORS,
  MASTERY_LABELS,
  MASTERY_ICONS,
} from '@/lib/mastery'

describe('calculateMasteryScore', () => {
  it('returns 0 when no attempts', () => {
    expect(calculateMasteryScore(0, 0, 0, 2.5, null)).toBe(0)
  })

  it('returns higher score for more correct answers', () => {
    const lowCorrect = calculateMasteryScore(2, 8, 0, 2.5, null)
    const highCorrect = calculateMasteryScore(8, 2, 0, 2.5, null)
    expect(highCorrect).toBeGreaterThan(lowCorrect)
  })

  it('increases score with streak bonus', () => {
    const noStreak = calculateMasteryScore(5, 5, 0, 2.5, null)
    const withStreak = calculateMasteryScore(5, 5, 5, 2.5, null)
    expect(withStreak).toBeGreaterThan(noStreak)
  })

  it('caps streak bonus at 20', () => {
    const streak10 = calculateMasteryScore(5, 5, 10, 2.5, null)
    const streak20 = calculateMasteryScore(5, 5, 20, 2.5, null)
    expect(streak20 - streak10).toBe(0)
  })

  it('applies ease factor bonus', () => {
    const lowEase = calculateMasteryScore(5, 5, 0, 1.3, null)
    const highEase = calculateMasteryScore(5, 5, 0, 2.5, null)
    expect(highEase).toBeGreaterThan(lowEase)
  })

  it('applies time decay penalty', () => {
    const recent = calculateMasteryScore(5, 5, 0, 2.5, new Date().toISOString())
    const old = calculateMasteryScore(5, 5, 0, 2.5, new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString())
    expect(recent).toBeGreaterThanOrEqual(old)
  })

  it('caps score between 0 and 100', () => {
    const score = calculateMasteryScore(100, 0, 20, 2.5, new Date().toISOString())
    expect(score).toBeLessThanOrEqual(100)
    expect(score).toBeGreaterThanOrEqual(0)
  })
})

describe('getMasteryLevel', () => {
  it('returns new for zero attempts', () => {
    expect(getMasteryLevel(0, 0, 0)).toBe('new')
  })

  it('returns new for low score', () => {
    expect(getMasteryLevel(10, 1, 1)).toBe('new')
  })

  it('returns learning for score 20-49', () => {
    expect(getMasteryLevel(30, 5, 2)).toBe('learning')
  })

  it('returns familiar for score 50-74 with enough correct', () => {
    expect(getMasteryLevel(60, 15, 5)).toBe('familiar')
  })

  it('returns mastered for score >= 75 with >= 10 correct', () => {
    expect(getMasteryLevel(80, 15, 3)).toBe('mastered')
  })

  it('requires minimum 10 correct for mastered', () => {
    expect(getMasteryLevel(90, 8, 2)).toBe('familiar')
  })

  it('returns expert for score >= 90 with >= 20 correct', () => {
    expect(getMasteryLevel(95, 25, 2)).toBe('expert')
  })

  it('requires minimum 20 correct for expert', () => {
    expect(getMasteryLevel(95, 15, 2)).toBe('mastered')
  })
})

describe('calculateMastery', () => {
  it('returns complete mastery data', () => {
    const result = calculateMastery('kanji', '山', 10, 2, 5, 2.5, 10, 8, new Date().toISOString(), null)
    expect(result.contentType).toBe('kanji')
    expect(result.contentId).toBe('山')
    expect(result.correctCount).toBe(10)
    expect(result.incorrectCount).toBe(2)
    expect(result.streak).toBe(5)
    expect(result.level).toBeDefined()
    expect(result.score).toBeGreaterThanOrEqual(0)
  })
})

describe('MASTERY_COLORS', () => {
  it('has colors for all levels', () => {
    expect(MASTERY_COLORS.new).toBeDefined()
    expect(MASTERY_COLORS.learning).toBeDefined()
    expect(MASTERY_COLORS.familiar).toBeDefined()
    expect(MASTERY_COLORS.mastered).toBeDefined()
    expect(MASTERY_COLORS.expert).toBeDefined()
  })
})

describe('MASTERY_LABELS', () => {
  it('has labels for all levels', () => {
    expect(MASTERY_LABELS.new).toBe('Novo')
    expect(MASTERY_LABELS.learning).toBe('Aprendendo')
    expect(MASTERY_LABELS.familiar).toBe('Familiar')
    expect(MASTERY_LABELS.mastered).toBe('Dominado')
    expect(MASTERY_LABELS.expert).toBe('Mestre')
  })
})

describe('MASTERY_ICONS', () => {
  it('has icons for all levels', () => {
    expect(MASTERY_ICONS.new).toBe('🔴')
    expect(MASTERY_ICONS.expert).toBe('🔵')
  })
})

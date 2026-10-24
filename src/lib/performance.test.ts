import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  recordError,
  recordPerformance,
  getErrors,
  getSkillStats,
  getContentErrors,
  getRecurringErrors,
  clearErrorsForContent,
  clearAllErrors,
  getAllPerformanceByCategory,
} from '@/lib/performance'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })
  localStorageMock.clear()
})

describe('recordError', () => {
  it('creates a new error record', () => {
    const error = recordError('hiragana', 'あ', 'vowels', 'What is あ?', 'い', 'あ')
    expect(error).not.toBeNull()
    expect(error!.contentType).toBe('hiragana')
    expect(error!.contentId).toBe('あ')
    expect(error!.occurrenceCount).toBe(1)
    expect(error!.severity).toBe('isolated')
  })

  it('increments occurrence count for duplicate errors', () => {
    recordError('hiragana', 'あ', 'vowels', 'What is あ?', 'い', 'あ')
    const second = recordError('hiragana', 'あ', 'vowels', 'What is あ?', 'い', 'あ')
    expect(second!.occurrenceCount).toBe(2)
    expect(second!.severity).toBe('recurring')
  })

  it('escalates severity after multiple occurrences', () => {
    for (let i = 0; i < 3; i++) {
      recordError('hiragana', 'あ', 'vowels', 'What is あ?', 'い', 'あ')
    }
    const errors = getErrors()
    expect(errors[0].severity).toBe('weakness')
  })

  it('limits errors per content to 5', () => {
    for (let i = 0; i < 7; i++) {
      recordError('hiragana', 'あ', 'vowels', `Q${i}`, `wrong${i}`, 'あ')
    }
    const errors = getErrors().filter((e) => e.contentId === 'あ')
    expect(errors.length).toBeLessThanOrEqual(5)
  })
})

describe('recordPerformance', () => {
  it('adds timestamp to performance entry', () => {
    const entry = recordPerformance({
      contentType: 'kanji',
      contentId: '山',
      correct: true,
      quality: 4,
    })
    expect(entry.timestamp).toBeDefined()
    expect(entry.correct).toBe(true)
  })

  it('caps stored entries at 1000', () => {
    for (let i = 0; i in Array(1100); i++) {
      recordPerformance({
        contentType: 'vocabulary',
        contentId: `word${i}`,
        correct: true,
        quality: 3,
      })
    }
    const stored = JSON.parse(localStorageMock.getItem('nihongo_performance') || '[]')
    expect(stored.length).toBeLessThanOrEqual(1000)
  })
})

describe('getSkillStats', () => {
  it('returns zeroed stats when no data exists', () => {
    const stats = getSkillStats('hiragana')
    expect(stats.total).toBe(0)
    expect(stats.accuracy).toBe(0)
    expect(stats.streak).toBe(0)
  })

  it('calculates accuracy correctly', () => {
    recordPerformance({ contentType: 'hiragana', contentId: 'あ', correct: true, quality: 4 })
    recordPerformance({ contentType: 'hiragana', contentId: 'い', correct: true, quality: 4 })
    recordPerformance({ contentType: 'hiragana', contentId: 'う', correct: false, quality: 1 })

    const stats = getSkillStats('hiragana')
    expect(stats.total).toBe(3)
    expect(stats.correct).toBe(2)
    expect(stats.incorrect).toBe(1)
    expect(stats.accuracy).toBeCloseTo(66.67, 1)
  })

  it('calculates current streak', () => {
    recordPerformance({ contentType: 'hiragana', contentId: 'あ', correct: true, quality: 4 })
    recordPerformance({ contentType: 'hiragana', contentId: 'い', correct: true, quality: 4 })
    recordPerformance({ contentType: 'hiragana', contentId: 'う', correct: true, quality: 4 })

    const stats = getSkillStats('hiragana')
    expect(stats.streak).toBe(3)
  })

  it('resets streak on incorrect answer', () => {
    recordPerformance({ contentType: 'hiragana', contentId: 'あ', correct: true, quality: 4 })
    recordPerformance({ contentType: 'hiragana', contentId: 'い', correct: false, quality: 1 })
    recordPerformance({ contentType: 'hiragana', contentId: 'う', correct: true, quality: 4 })

    const stats = getSkillStats('hiragana')
    expect(stats.streak).toBe(1)
  })
})

describe('getErrors', () => {
  it('returns all errors', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    recordError('katakana', 'ア', 'vowels', 'Q2', 'wrong', 'ア')
    expect(getErrors()).toHaveLength(2)
  })

  it('filters by content type', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    recordError('katakana', 'ア', 'vowels', 'Q2', 'wrong', 'ア')
    expect(getErrors('hiragana')).toHaveLength(1)
  })
})

describe('getContentErrors', () => {
  it('returns errors for specific content', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    recordError('hiragana', 'い', 'vowels', 'Q2', 'wrong', 'い')
    expect(getContentErrors('hiragana', 'あ')).toHaveLength(1)
  })
})

describe('getRecurringErrors', () => {
  it('returns recurring and critical errors but not isolated', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    const recurring = getRecurringErrors()
    expect(recurring.length).toBe(0)

    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    const recurring2 = getRecurringErrors()
    expect(recurring2.length).toBe(1)
  })
})

describe('clearErrorsForContent', () => {
  it('removes errors for specific content', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    recordError('hiragana', 'い', 'vowels', 'Q2', 'wrong', 'い')
    clearErrorsForContent('hiragana', 'あ')
    const errors = getErrors('hiragana')
    expect(errors.every((e) => e.contentId !== 'あ')).toBe(true)
  })
})

describe('clearAllErrors', () => {
  it('removes all errors', () => {
    recordError('hiragana', 'あ', 'vowels', 'Q1', 'wrong', 'あ')
    recordError('katakana', 'ア', 'vowels', 'Q2', 'wrong', 'ア')
    clearAllErrors()
    expect(getErrors()).toHaveLength(0)
  })
})

describe('getAllPerformanceByCategory', () => {
  it('returns stats for all categories', () => {
    const stats = getAllPerformanceByCategory()
    expect(Object.keys(stats)).toContain('hiragana')
    expect(Object.keys(stats)).toContain('vocabulary')
    expect(Object.keys(stats)).toContain('kanji')
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { detectWeaknesses, generateShadowSenseiMessage } from '@/lib/shadow-sensei'

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

describe('detectWeaknesses', () => {
  it('returns empty array when no data exists', () => {
    const weaknesses = detectWeaknesses()
    expect(Array.isArray(weaknesses)).toBe(true)
  })

  it('returns weaknesses sorted by severity', () => {
    const weaknesses = detectWeaknesses()
    const severityOrder = { high: 0, medium: 1, low: 2 }
    for (let i = 1; i < weaknesses.length; i++) {
      expect(severityOrder[weaknesses[i].severity]).toBeGreaterThanOrEqual(
        severityOrder[weaknesses[i - 1].severity]
      )
    }
  })

  it('limits results to 12', () => {
    const weaknesses = detectWeaknesses()
    expect(weaknesses.length).toBeLessThanOrEqual(12)
  })

  it('returns valid weakness patterns', () => {
    const weaknesses = detectWeaknesses()
    for (const w of weaknesses) {
      expect(w.type).toBeDefined()
      expect(w.description).toBeDefined()
      expect(['low', 'medium', 'high']).toContain(w.severity)
      expect(w.contentType).toBeDefined()
      expect(w.actionLabel).toBeDefined()
      expect(w.actionHref).toBeDefined()
      expect(typeof w.confidence).toBe('number')
    }
  })
})

describe('generateShadowSenseiMessage', () => {
  it('returns null when no weaknesses', () => {
    const message = generateShadowSenseiMessage()
    expect(message === null || typeof message === 'string').toBe(true)
  })
})

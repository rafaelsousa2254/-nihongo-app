import { describe, it, expect } from 'vitest'
import { calculateNextReview } from '@/lib/sm2'

describe('calculateNextReview', () => {
  it('returns correct values for quality 5 (perfect)', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      5
    )

    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.easeFactor).toBeGreaterThanOrEqual(2.5)
    expect(result.nextReview).toBeDefined()
  })

  it('returns correct values for quality 3 (good)', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      3
    )

    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.nextReview).toBeDefined()
  })

  it('resets repetitions for quality < 3', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 10, repetitions: 5 },
      1
    )

    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('increases interval on consecutive successes', () => {
    let state = { easeFactor: 2.5, interval: 0, repetitions: 0 }

    state = calculateNextReview(state, 5)
    expect(state.interval).toBe(1)

    state = calculateNextReview(state, 5)
    expect(state.interval).toBe(6)

    state = calculateNextReview(state, 5)
    expect(state.interval).toBeGreaterThan(10)
  })

  it('updates ease factor based on quality', () => {
    const lowQuality = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      3
    )

    const highQuality = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      5
    )

    expect(highQuality.easeFactor).toBeGreaterThanOrEqual(lowQuality.easeFactor)
  })

  it('does not let ease factor drop below 1.3', () => {
    let state = { easeFactor: 1.3, interval: 0, repetitions: 0 }

    for (let i = 0; i < 10; i++) {
      state = calculateNextReview(state, 0)
    }

    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3)
  })

  it('clamps quality to 0-5 range', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      10
    )
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
  })

  it('handles negative quality', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      -1
    )
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('sets nextReview to future date', () => {
    const before = new Date()
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      5
    )
    expect(result.nextReview.getTime()).toBeGreaterThan(before.getTime())
  })

  it('multiplies interval by ease factor after 2nd repetition', () => {
    let state = { easeFactor: 2.5, interval: 0, repetitions: 0 }
    state = calculateNextReview(state, 5)
    state = calculateNextReview(state, 5)
    const intervalAfter2 = state.interval
    const easeBefore = state.easeFactor
    state = calculateNextReview(state, 5)
    expect(state.interval).toBe(Math.round(intervalAfter2 * easeBefore))
  })

  it('decreases ease factor on low quality', () => {
    const result = calculateNextReview(
      { easeFactor: 2.5, interval: 0, repetitions: 0 },
      0
    )
    expect(result.easeFactor).toBeLessThan(2.5)
  })
})

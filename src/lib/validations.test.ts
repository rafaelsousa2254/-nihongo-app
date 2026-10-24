import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, progressSchema } from '@/lib/validations'

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({ name: 'testuser', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = loginSchema.safeParse({ name: 'ab', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ name: 'testuser', password: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid characters in name', () => {
    const result = loginSchema.safeParse({ name: 'test user!', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('accepts underscores in name', () => {
    const result = loginSchema.safeParse({ name: 'test_user', password: 'password123' })
    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse({ name: 'newuser', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects same validations as login', () => {
    expect(registerSchema.safeParse({ name: 'ab', password: 'password123' }).success).toBe(false)
    expect(registerSchema.safeParse({ name: 'testuser', password: '12345' }).success).toBe(false)
  })
})

describe('progressSchema', () => {
  it('accepts valid progress', () => {
    const result = progressSchema.safeParse({
      contentType: 'hiragana',
      contentId: 'a',
      quality: 4,
    })
    expect(result.success).toBe(true)
  })

  it('rejects quality > 5', () => {
    const result = progressSchema.safeParse({
      contentType: 'hiragana',
      contentId: 'a',
      quality: 6,
    })
    expect(result.success).toBe(false)
  })

  it('rejects quality < 0', () => {
    const result = progressSchema.safeParse({
      contentType: 'hiragana',
      contentId: 'a',
      quality: -1,
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty contentType', () => {
    const result = progressSchema.safeParse({
      contentType: '',
      contentId: 'a',
      quality: 4,
    })
    expect(result.success).toBe(false)
  })
})

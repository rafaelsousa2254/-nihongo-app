import { describe, it, expect } from 'vitest'
import { japaneseToRomaji } from '@/lib/romaji'

describe('japaneseToRomaji', () => {
  it('converts basic hiragana', () => {
    expect(japaneseToRomaji('あ')).toBe('a')
    expect(japaneseToRomaji('い')).toBe('i')
    expect(japaneseToRomaji('う')).toBe('u')
    expect(japaneseToRomaji('え')).toBe('e')
    expect(japaneseToRomaji('お')).toBe('o')
  })

  it('converts hiragana combinations', () => {
    expect(japaneseToRomaji('か')).toBe('ka')
    expect(japaneseToRomaji('き')).toBe('ki')
    expect(japaneseToRomaji('く')).toBe('ku')
    expect(japaneseToRomaji('け')).toBe('ke')
    expect(japaneseToRomaji('こ')).toBe('ko')
  })

  it('converts dakuten', () => {
    expect(japaneseToRomaji('が')).toBe('ga')
    expect(japaneseToRomaji('ざ')).toBe('za')
    expect(japaneseToRomaji('だ')).toBe('da')
    expect(japaneseToRomaji('ば')).toBe('ba')
    expect(japaneseToRomaji('ぱ')).toBe('pa')
  })

  it('converts combo characters', () => {
    expect(japaneseToRomaji('きゃ')).toBe('kya')
    expect(japaneseToRomaji('しゃ')).toBe('sha')
    expect(japaneseToRomaji('ちゃ')).toBe('cha')
    expect(japaneseToRomaji('にゃ')).toBe('nya')
  })

  it('converts katakana', () => {
    expect(japaneseToRomaji('ア')).toBe('a')
    expect(japaneseToRomaji('カ')).toBe('ka')
    expect(japaneseToRomaji('サ')).toBe('sa')
    expect(japaneseToRomaji('タ')).toBe('ta')
  })

  it('converts common words', () => {
    expect(japaneseToRomaji('こんにちは')).toContain('konnichi')
    expect(japaneseToRomaji('ありがとう')).toBe('arigatou')
    expect(japaneseToRomaji('すみません')).toBe('sumimasen')
  })

  it('handles empty string', () => {
    expect(japaneseToRomaji('')).toBe('')
  })

  it('handles mixed content', () => {
    expect(japaneseToRomaji('あaい')).toBe('aai')
  })
})

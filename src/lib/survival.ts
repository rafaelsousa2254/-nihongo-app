import { kanji } from '@/data/kanji'
import { vocabulary } from '@/data/vocabulary'
import { grammar } from '@/data/grammar'
import { hiragana } from '@/data/hiragana'
import { katakana } from '@/data/katakana'

export interface SurvivalQuestion {
  id: string
  level: number
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'text_input'
  category: string
  timeLimit: number
}

export interface SurvivalState {
  score: number
  combo: number
  maxCombo: number
  level: number
  questionsAnswered: number
  correctAnswers: number
  timeRemaining: number
  isPlaying: boolean
  isGameOver: boolean
  record: number
  xpEarned: number
  coinsEarned: number
  errors: { question: string; givenAnswer: string; correctAnswer: string }[]
}

const SURVIVAL_LEVELS = [
  { name: 'Kana Básico', categories: ['hiragana', 'katakana'], timeLimit: 15, questionsPerLevel: 5 },
  { name: 'Vocabulário', categories: ['vocabulary'], timeLimit: 12, questionsPerLevel: 5 },
  { name: 'Kanji', categories: ['kanji'], timeLimit: 10, questionsPerLevel: 5 },
  { name: 'Gramática', categories: ['grammar'], timeLimit: 10, questionsPerLevel: 5 },
  { name: 'Misto', categories: ['kanji', 'vocabulary', 'grammar'], timeLimit: 8, questionsPerLevel: 5 },
]

function getStoredRecord(): number {
  if (typeof window === 'undefined') return 0
  try {
    return parseInt(localStorage.getItem('nihongo_survival_record') || '0')
  } catch {
    return 0
  }
}

function saveRecord(record: number) {
  if (typeof window === 'undefined') return
  const current = getStoredRecord()
  if (record > current) {
    localStorage.setItem('nihongo_survival_record', record.toString())
  }
}

export function createSurvivalState(): SurvivalState {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    level: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeRemaining: SURVIVAL_LEVELS[0].timeLimit,
    isPlaying: true,
    isGameOver: false,
    record: getStoredRecord(),
    xpEarned: 0,
    coinsEarned: 0,
    errors: [],
  }
}

export function generateSurvivalQuestion(level: number): SurvivalQuestion | null {
  const levelConfig = SURVIVAL_LEVELS[Math.min(level, SURVIVAL_LEVELS.length - 1)]
  const seed = Date.now()
  let s = seed
  const rng = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }

  const categories = levelConfig.categories
  const category = categories[Math.floor(rng() * categories.length)]

  switch (category) {
    case 'hiragana': {
      const char = hiragana[Math.floor(rng() * hiragana.length)]
      const options = selectRandomOptions(hiragana.map((h) => h.romanization), char.romanization, rng)
      return {
        id: `surv_${Date.now()}_${rng()}`,
        level,
        question: char.character,
        options,
        correctAnswer: char.romanization,
        type: 'multiple_choice',
        category: 'hiragana',
        timeLimit: levelConfig.timeLimit,
      }
    }
    case 'katakana': {
      const char = katakana[Math.floor(rng() * katakana.length)]
      const options = selectRandomOptions(katakana.map((k) => k.romanization), char.romanization, rng)
      return {
        id: `surv_${Date.now()}_${rng()}`,
        level,
        question: char.character,
        options,
        correctAnswer: char.romanization,
        type: 'multiple_choice',
        category: 'katakana',
        timeLimit: levelConfig.timeLimit,
      }
    }
    case 'kanji': {
      const filtered = kanji.filter((k) => {
        if (level <= 1) return k.jlptLevel === 'N5'
        if (level <= 2) return k.jlptLevel === 'N5' || k.jlptLevel === 'N4'
        return true
      })
      const char = filtered[Math.floor(rng() * filtered.length)]
      const options = selectRandomOptions(filtered.map((k) => k.meanings[0]), char.meanings[0], rng)
      return {
        id: `surv_${Date.now()}_${rng()}`,
        level,
        question: char.character,
        options,
        correctAnswer: char.meanings[0],
        type: 'multiple_choice',
        category: 'kanji',
        timeLimit: levelConfig.timeLimit,
      }
    }
    case 'vocabulary': {
      const filtered = vocabulary.filter((v) => {
        if (level <= 1) return v.jlptLevel === 'N5'
        if (level <= 2) return v.jlptLevel === 'N5' || v.jlptLevel === 'N4'
        return true
      })
      const word = filtered[Math.floor(rng() * filtered.length)]
      const options = selectRandomOptions(filtered.map((v) => v.meaning), word.meaning, rng)
      return {
        id: `surv_${Date.now()}_${rng()}`,
        level,
        question: word.word,
        options,
        correctAnswer: word.meaning,
        type: 'multiple_choice',
        category: 'vocabulary',
        timeLimit: levelConfig.timeLimit,
      }
    }
    case 'grammar': {
      const filtered = grammar.filter((g) => {
        if (level <= 1) return g.level === 'N5'
        if (level <= 2) return g.level === 'N5' || g.level === 'N4'
        return true
      })
      const pattern = filtered[Math.floor(rng() * filtered.length)]
      const options = selectRandomOptions(filtered.map((g) => g.meaning), pattern.meaning, rng)
      return {
        id: `surv_${Date.now()}_${rng()}`,
        level,
        question: pattern.pattern,
        options,
        correctAnswer: pattern.meaning,
        type: 'multiple_choice',
        category: 'grammar',
        timeLimit: levelConfig.timeLimit,
      }
    }
    default:
      return null
  }
}

function selectRandomOptions(allOptions: string[], correct: string, rng: () => number): string[] {
  const filtered = allOptions.filter((o) => o !== correct)
  const shuffled = filtered.sort(() => rng() - 0.5)
  const selected = shuffled.slice(0, 3)
  return [...selected, correct].sort(() => rng() - 0.5)
}

export function processSurvivalAnswer(
  state: SurvivalState,
  answer: string,
  question: SurvivalQuestion
): SurvivalState {
  const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
  const newState = { ...state }

  newState.questionsAnswered += 1

  if (isCorrect) {
    const comboBonus = Math.floor(state.combo / 3)
    const basePoints = 10 + state.level * 5
    newState.score += basePoints + comboBonus * 5
    newState.correctAnswers += 1
    newState.combo += 1
    newState.maxCombo = Math.max(newState.maxCombo, newState.combo)
    newState.xpEarned += 5 + state.level * 2 + comboBonus
    newState.coinsEarned += 1 + Math.floor(state.combo / 5)

    if (newState.combo > 0 && newState.combo % 5 === 0) {
      newState.timeRemaining = Math.min(newState.timeRemaining + 3, SURVIVAL_LEVELS[Math.min(state.level, SURVIVAL_LEVELS.length - 1)].timeLimit + 5)
    }
  } else {
    newState.combo = 0
    newState.timeRemaining = Math.max(0, newState.timeRemaining - 3)
    newState.errors.push({
      question: question.question,
      givenAnswer: answer,
      correctAnswer: question.correctAnswer,
    })
  }

  const currentLevelConfig = SURVIVAL_LEVELS[Math.min(state.level, SURVIVAL_LEVELS.length - 1)]
  if (newState.questionsAnswered % currentLevelConfig.questionsPerLevel === 0 && newState.level < SURVIVAL_LEVELS.length - 1) {
    newState.level += 1
    const nextConfig = SURVIVAL_LEVELS[newState.level]
    newState.timeRemaining = Math.min(newState.timeRemaining + 5, nextConfig.timeLimit + 5)
  }

  if (newState.timeRemaining <= 0) {
    newState.isPlaying = false
    newState.isGameOver = true
    saveRecord(newState.score)
    newState.record = getStoredRecord()
  }

  return newState
}

export function getSurvivalLevels() {
  return SURVIVAL_LEVELS
}

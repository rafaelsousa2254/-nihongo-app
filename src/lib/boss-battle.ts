import { kanji } from '@/data/kanji'
import { vocabulary } from '@/data/vocabulary'
import { grammar } from '@/data/grammar'

export interface BattleQuestion {
  id: string
  phase: number
  phaseName: string
  question: string
  options?: string[]
  correctAnswer: string
  type: 'multiple_choice' | 'text_input'
  category: string
}

export interface BattleState {
  currentPhase: number
  currentQuestion: number
  questionsAnswered: number
  hp: number
  maxHp: number
  combo: number
  maxCombo: number
  score: number
  xpEarned: number
  coinsEarned: number
  errors: BattleError[]
  completed: boolean
}

export interface BattleError {
  question: string
  givenAnswer: string
  correctAnswer: string
  category: string
  phase: number
}

export interface BattlePhase {
  name: string
  icon: string
  category: string
  questionCount: number
}

export const BATTLE_PHASES: BattlePhase[] = [
  { name: 'Reconhecimento', icon: '🔍', category: 'kanji', questionCount: 3 },
  { name: 'Vocabulário', icon: '📚', category: 'vocabulary', questionCount: 3 },
  { name: 'Kanji Avançado', icon: '漢', category: 'kanji', questionCount: 2 },
  { name: 'Audição', icon: '🎧', category: 'listening', questionCount: 2 },
  { name: 'Gramática', icon: '📝', category: 'grammar', questionCount: 2 },
]

function getDifficultyMultiplier(level: number): number {
  if (level <= 3) return 0.5
  if (level <= 6) return 0.75
  if (level <= 9) return 1
  return 1.25
}

function selectRandomItems<T>(arr: T[], count: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, count)
}

function generateKanjiQuestion(level: number, rng: () => number): BattleQuestion {
  const difficulty = getDifficultyMultiplier(level)
  const filtered = kanji.filter((k) => {
    if (difficulty < 0.6) return k.jlptLevel === 'N5'
    if (difficulty < 0.85) return k.jlptLevel === 'N5' || k.jlptLevel === 'N4'
    return true
  })

  const selected = filtered[Math.floor(rng() * filtered.length)]
  const options = selectRandomItems(
    filtered.filter((k) => k.id !== selected.id).map((k) => k.meanings[0]),
    3,
    rng
  ).concat(selected.meanings[0]).sort(() => rng() - 0.5)

  return {
    id: `boss_kanji_${Date.now()}_${rng()}`,
    phase: 0,
    phaseName: 'Reconhecimento',
    question: `Qual o significado de ${selected.character}?`,
    options,
    correctAnswer: selected.meanings[0],
    type: 'multiple_choice',
    category: 'kanji',
  }
}

function generateVocabularyQuestion(level: number, rng: () => number): BattleQuestion {
  const difficulty = getDifficultyMultiplier(level)
  const filtered = vocabulary.filter((v) => {
    if (difficulty < 0.6) return v.jlptLevel === 'N5'
    if (difficulty < 0.85) return v.jlptLevel === 'N5' || v.jlptLevel === 'N4'
    return true
  })

  const selected = filtered[Math.floor(rng() * filtered.length)]
  const options = selectRandomItems(
    filtered.filter((v) => v.id !== selected.id).map((v) => v.meaning),
    3,
    rng
  ).concat(selected.meaning).sort(() => rng() - 0.5)

  return {
    id: `boss_vocab_${Date.now()}_${rng()}`,
    phase: 1,
    phaseName: 'Vocabulário',
    question: `O que significa "${selected.word}"?`,
    options,
    correctAnswer: selected.meaning,
    type: 'multiple_choice',
    category: 'vocabulary',
  }
}

function generateListeningQuestion(level: number, rng: () => number): BattleQuestion {
  const difficulty = getDifficultyMultiplier(level)
  const filtered = vocabulary.filter((v) => {
    if (difficulty < 0.6) return v.jlptLevel === 'N5'
    if (difficulty < 0.85) return v.jlptLevel === 'N5' || v.jlptLevel === 'N4'
    return true
  })

  const selected = filtered[Math.floor(rng() * filtered.length)]
  const options = selectRandomItems(
    filtered.filter((v) => v.id !== selected.id).map((v) => v.meaning),
    3,
    rng
  ).concat(selected.meaning).sort(() => rng() - 0.5)

  return {
    id: `boss_listen_${Date.now()}_${rng()}`,
    phase: 3,
    phaseName: 'Audição',
    question: `Ouça: ${selected.word} (${selected.reading})`,
    options,
    correctAnswer: selected.meaning,
    type: 'multiple_choice',
    category: 'listening',
  }
}

function generateGrammarQuestion(level: number, rng: () => number): BattleQuestion {
  const difficulty = getDifficultyMultiplier(level)
  const filtered = grammar.filter((g) => {
    if (difficulty < 0.6) return g.level === 'N5'
    if (difficulty < 0.85) return g.level === 'N5' || g.level === 'N4'
    return true
  })

  const selected = filtered[Math.floor(rng() * filtered.length)]
  const options = selectRandomItems(
    filtered.filter((g) => g.id !== selected.id).map((g) => g.meaning),
    3,
    rng
  ).concat(selected.meaning).sort(() => rng() - 0.5)

  return {
    id: `boss_grammar_${Date.now()}_${rng()}`,
    phase: 4,
    phaseName: 'Gramática',
    question: `Qual o significado de "${selected.pattern}"?`,
    options,
    correctAnswer: selected.meaning,
    type: 'multiple_choice',
    category: 'grammar',
  }
}

export function generateBattleQuestions(userLevel: number): BattleQuestion[] {
  const seed = Date.now()
  let s = seed
  const rng = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }

  const questions: BattleQuestion[] = []

  for (let i = 0; i < BATTLE_PHASES[0].questionCount; i++) {
    questions.push(generateKanjiQuestion(userLevel, rng))
  }
  for (let i = 0; i < BATTLE_PHASES[1].questionCount; i++) {
    questions.push(generateVocabularyQuestion(userLevel, rng))
  }
  for (let i = 0; i < BATTLE_PHASES[2].questionCount; i++) {
    questions.push(generateKanjiQuestion(userLevel + 2, rng))
  }
  for (let i = 0; i < BATTLE_PHASES[3].questionCount; i++) {
    questions.push(generateListeningQuestion(userLevel, rng))
  }
  for (let i = 0; i < BATTLE_PHASES[4].questionCount; i++) {
    questions.push(generateGrammarQuestion(userLevel, rng))
  }

  return questions
}

export function createInitialState(questions: BattleQuestion[]): BattleState {
  return {
    currentPhase: 0,
    currentQuestion: 0,
    questionsAnswered: 0,
    hp: 100,
    maxHp: 100,
    combo: 0,
    maxCombo: 0,
    score: 0,
    xpEarned: 0,
    coinsEarned: 0,
    errors: [],
    completed: false,
  }
}

export function processAnswer(
  state: BattleState,
  answer: string,
  questions: BattleQuestion[]
): BattleState {
  const question = questions[state.currentQuestion]
  const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()

  const newState = { ...state }
  newState.questionsAnswered += 1

  if (isCorrect) {
    const comboBonus = Math.floor(state.combo / 3) * 5
    const xp = 10 + comboBonus
    const coins = 1 + Math.floor(state.combo / 5)

    newState.combo += 1
    newState.maxCombo = Math.max(newState.maxCombo, newState.combo)
    newState.score += 100 + comboBonus * 10
    newState.xpEarned += xp
    newState.coinsEarned += coins
  } else {
    const damage = 10 + Math.floor(state.combo / 2) * 2
    newState.hp = Math.max(0, newState.hp - damage)
    newState.combo = 0
    newState.errors.push({
      question: question.question,
      givenAnswer: answer,
      correctAnswer: question.correctAnswer,
      category: question.category,
      phase: question.phase,
    })
  }

  newState.currentQuestion += 1

  if (newState.currentQuestion >= questions.length || newState.hp <= 0) {
    newState.completed = true
  }

  return newState
}

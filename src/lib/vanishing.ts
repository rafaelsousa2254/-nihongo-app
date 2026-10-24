import { getSkillStats } from './performance'
import { getConnectionStrength } from './nihongo-brain'
import { getRecallRate } from './recall'

export type VanishingStage = 1 | 2 | 3 | 4 | 5 | 6

export interface VanishingConfig {
  stage: VanishingStage
  showRomaji: boolean
  showTranslation: boolean
  showFurigana: boolean
  showJapanese: boolean
  showBlanks: boolean
  audioOnly: boolean
  stageName: string
  description: string
}

export interface VanishingState {
  contentId: string
  contentType: string
  stage: VanishingStage
  correctAtCurrentStage: number
  incorrectAtCurrentStage: number
  lastStageChange: string
  history: Array<{ stage: VanishingStage; timestamp: string; correct: boolean }>
}

const STORAGE_KEY = 'nihongo_vanishing'

const STAGE_CONFIGS: Record<VanishingStage, VanishingConfig> = {
  1: {
    stage: 1,
    showRomaji: true,
    showTranslation: true,
    showFurigana: true,
    showJapanese: true,
    showBlanks: false,
    audioOnly: false,
    stageName: 'Apoio Completo',
    description: 'Japonês + furigana + romaji + tradução',
  },
  2: {
    stage: 2,
    showRomaji: false,
    showTranslation: true,
    showFurigana: true,
    showJapanese: true,
    showBlanks: false,
    audioOnly: false,
    stageName: 'Sem Romaji',
    description: 'Japonês + furigana + tradução',
  },
  3: {
    stage: 3,
    showRomaji: false,
    showTranslation: false,
    showFurigana: true,
    showJapanese: true,
    showBlanks: false,
    audioOnly: false,
    stageName: 'Sem Tradução',
    description: 'Somente japonês + furigana',
  },
  4: {
    stage: 4,
    showRomaji: false,
    showTranslation: false,
    showFurigana: false,
    showJapanese: true,
    showBlanks: false,
    audioOnly: false,
    stageName: 'Japonês Puro',
    description: 'Somente japonês, sem ajuda',
  },
  5: {
    stage: 5,
    showRomaji: false,
    showTranslation: false,
    showFurigana: false,
    showJapanese: true,
    showBlanks: true,
    audioOnly: false,
    stageName: 'Com Lacunas',
    description: 'Partes da frase desaparecem',
  },
  6: {
    stage: 6,
    showRomaji: false,
    showTranslation: false,
    showFurigana: false,
    showJapanese: false,
    showBlanks: false,
    audioOnly: true,
    stageName: 'Só Áudio',
    description: 'Somente áudio — reconstrua a frase',
  },
}

function getStoredStates(): VanishingState[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredStates(states: VanishingState[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states.slice(-200)))
}

export function getVanishingState(contentId: string, contentType: string): VanishingState {
  const states = getStoredStates()
  const existing = states.find((s) => s.contentId === contentId && s.contentType === contentType)

  if (existing) return existing

  const stage = calculateInitialStage(contentType)
  const newState: VanishingState = {
    contentId,
    contentType,
    stage,
    correctAtCurrentStage: 0,
    incorrectAtCurrentStage: 0,
    lastStageChange: new Date().toISOString(),
    history: [],
  }

  states.push(newState)
  saveStoredStates(states)
  return newState
}

function calculateInitialStage(contentType: string): VanishingStage {
  const stats = getSkillStats(contentType)
  if (stats.total === 0) return 1
  if (stats.accuracy < 40) return 1
  if (stats.accuracy < 60) return 2
  if (stats.accuracy < 75) return 3
  if (stats.accuracy < 85) return 4
  return 5
}

export function getVanishingConfig(stage: VanishingStage): VanishingConfig {
  return STAGE_CONFIGS[stage]
}

export function recordVanishingAttempt(
  contentId: string,
  contentType: string,
  correct: boolean
): VanishingState {
  const states = getStoredStates()
  const idx = states.findIndex((s) => s.contentId === contentId && s.contentType === contentType)

  let state: VanishingState
  if (idx === -1) {
    state = getVanishingState(contentId, contentType)
    states.push(state)
  } else {
    state = states[idx]
  }

  state.history.push({ stage: state.stage, timestamp: new Date().toISOString(), correct })

  if (correct) {
    state.correctAtCurrentStage += 1
  } else {
    state.incorrectAtCurrentStage += 1
  }

  const shouldAdvance = state.correctAtCurrentStage >= 3 && state.stage < 6
  const shouldRegress = state.incorrectAtCurrentStage >= 2 && state.stage > 1

  if (shouldAdvance) {
    state.stage = (state.stage + 1) as VanishingStage
    state.correctAtCurrentStage = 0
    state.incorrectAtCurrentStage = 0
    state.lastStageChange = new Date().toISOString()
  } else if (shouldRegress) {
    state.stage = (state.stage - 1) as VanishingStage
    state.correctAtCurrentStage = 0
    state.incorrectAtCurrentStage = 0
    state.lastStageChange = new Date().toISOString()
  }

  saveStoredStates(states)
  return state
}

export function generateBlanks(text: string, difficulty: number): string {
  const chars = [...text]
  const blankCount = Math.min(Math.floor(chars.length * (difficulty / 100)), chars.length - 1)
  const indices = new Set<number>()

  while (indices.size < blankCount) {
    const idx = Math.floor(Math.random() * chars.length)
    if (chars[idx] !== ' ' && chars[idx] !== '、' && chars[idx] !== '。') {
      indices.add(idx)
    }
  }

  return chars.map((char, i) => indices.has(i) ? '＿' : char).join('')
}

export function applyVanishingStage(
  japanese: string,
  furigana: string | null,
  translation: string | null,
  config: VanishingConfig
): {
  japanese: string | null
  furigana: string | null
  translation: string | null
  romaji: string | null
  displayText: string
} {
  return {
    japanese: config.showJapanese ? japanese : null,
    furigana: config.showFurigana && furigana ? furigana : null,
    translation: config.showTranslation && translation ? translation : null,
    romaji: null,
    displayText: config.showBlanks ? generateBlanks(japanese, 40) : japanese,
  }
}

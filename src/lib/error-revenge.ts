import { getErrors, type ErrorRecord } from './performance'

export type RivalStage = 'discovered' | 'in_combat' | 'defeated' | 'watching' | 'dominated'

export interface Rival {
  id: string
  label: string
  errorSource: string
  errorTarget: string
  errorType: string
  stage: RivalStage
  totalErrors: number
  combatWins: number
  combatLosses: number
  currentStreak: number
  discoveredAt: string
  lastCombatAt: string | null
  defeatedAt: string | null
  dominatedAt: string | null
}

export interface RivalChallenge {
  rivalId: string
  challengeType: 'identification' | 'reading' | 'word' | 'audio' | 'context' | 'production'
  question: string
  correctAnswer: string
  options?: string[]
}

const STORAGE_KEY = 'nihongo_rivals'

function getStoredRivals(): Rival[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredRivals(rivals: Rival[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rivals))
}

function generateRivalId(errorSource: string, errorTarget: string): string {
  return `rival_${errorSource}_${errorTarget}`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 80)
}

export function detectRivals(): Rival[] {
  const errors = getErrors()
  const errorsByPair = new Map<string, ErrorRecord[]>()

  for (const error of errors) {
    const key = `${error.givenAnswer}_${error.correctAnswer}`
    if (!errorsByPair.has(key)) errorsByPair.set(key, [])
    errorsByPair.get(key)!.push(error)
  }

  const rivals = getStoredRivals()
  const existingIds = new Set(rivals.map((r) => r.id))

  for (const [key, pairErrors] of errorsByPair) {
    if (pairErrors.length < 2) continue

    const [errorSource, errorTarget] = key.split('_')
    const id = generateRivalId(errorSource, errorTarget)

    if (!existingIds.has(id)) {
      const newRival: Rival = {
        id,
        label: `${errorSource} VS ${errorTarget}`,
        errorSource,
        errorTarget,
        errorType: pairErrors[0].contentType,
        stage: 'discovered',
        totalErrors: pairErrors.length,
        combatWins: 0,
        combatLosses: 0,
        currentStreak: 0,
        discoveredAt: pairErrors[0].timestamp,
        lastCombatAt: null,
        defeatedAt: null,
        dominatedAt: null,
      }
      rivals.push(newRival)
      existingIds.add(id)
    } else {
      const rival = rivals.find((r) => r.id === id)
      if (rival) {
        rival.totalErrors = pairErrors.length
      }
    }
  }

  saveStoredRivals(rivals)
  return rivals
}

export function getRivals(): Rival[] {
  return detectRivals()
}

export function getActiveRivals(): Rival[] {
  return detectRivals().filter((r) => r.stage !== 'dominated')
}

export function recordRivalCombat(
  rivalId: string,
  won: boolean
): Rival {
  const rivals = getStoredRivals()
  const rival = rivals.find((r) => r.id === rivalId)
  if (!rival) throw new Error('Rival not found')

  rival.lastCombatAt = new Date().toISOString()

  if (won) {
    rival.combatWins += 1
    rival.currentStreak += 1

    if (rival.currentStreak >= 3 && rival.stage === 'in_combat') {
      rival.stage = 'defeated'
      rival.defeatedAt = new Date().toISOString()
    }
  } else {
    rival.combatLosses += 1
    rival.currentStreak = 0

    if (rival.stage === 'defeated' || rival.stage === 'watching') {
      rival.stage = 'in_combat'
      rival.defeatedAt = null
    }
  }

  if (rival.stage === 'defeated' && rival.combatWins >= 5) {
    const daysSinceDefeat = rival.defeatedAt
      ? (Date.now() - new Date(rival.defeatedAt).getTime()) / (1000 * 60 * 60 * 24)
      : 0

    if (daysSinceDefeat >= 7) {
      rival.stage = 'watching'
    }
  }

  if (rival.stage === 'watching' && rival.currentStreak >= 3) {
    rival.stage = 'dominated'
    rival.dominatedAt = new Date().toISOString()
  }

  saveStoredRivals(rivals)
  return rival
}

export function generateRivalChallenges(rival: Rival): RivalChallenge[] {
  const challenges: RivalChallenge[] = []

  challenges.push({
    rivalId: rival.id,
    challengeType: 'identification',
    question: `Qual é a diferença entre "${rival.errorSource}" e "${rival.errorTarget}"?`,
    correctAnswer: rival.errorTarget,
    options: [rival.errorSource, rival.errorTarget],
  })

  challenges.push({
    rivalId: rival.id,
    challengeType: 'reading',
    question: `Qual é a leitura correta de "${rival.errorTarget}"?`,
    correctAnswer: rival.errorTarget,
  })

  challenges.push({
    rivalId: rival.id,
    challengeType: 'word',
    question: `Em qual palavra aparece "${rival.errorTarget}"?`,
    correctAnswer: rival.errorTarget,
  })

  challenges.push({
    rivalId: rival.id,
    challengeType: 'context',
    question: `Escolha a frase que contém "${rival.errorTarget}" corretamente.`,
    correctAnswer: rival.errorTarget,
  })

  challenges.push({
    rivalId: rival.id,
    challengeType: 'production',
    question: `Escreva "${rival.errorTarget}" sem ver.`,
    correctAnswer: rival.errorTarget,
  })

  return challenges
}

export function getRivalStageLabel(stage: RivalStage): string {
  const labels: Record<RivalStage, string> = {
    discovered: '🔍 Descoberto',
    in_combat: '⚔️ Em Combate',
    defeated: '🏆 Derrotado',
    watching: '👁️ Em Observação',
    dominated: '👑 Dominado',
  }
  return labels[stage]
}

export function getRivalStats(): {
  total: number
  active: number
  defeated: number
  dominated: number
} {
  const rivals = detectRivals()
  return {
    total: rivals.length,
    active: rivals.filter((r) => r.stage === 'in_combat' || r.stage === 'discovered').length,
    defeated: rivals.filter((r) => r.stage === 'defeated' || r.stage === 'watching').length,
    dominated: rivals.filter((r) => r.stage === 'dominated').length,
  }
}

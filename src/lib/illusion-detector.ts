import { getSkillStats, type PerformanceEntry } from './performance'
import { getConfidenceDistribution } from './confidence'

const STORAGE_KEY = 'nihongo_performance'

function getAllPerformance(): PerformanceEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export interface IllusionScore {
  contentId: string
  contentType: string
  recognitionScore: number
  productionScore: number
  illusionGap: number
  isIllusion: boolean
  diagnosis: string
}

const RECOGNITION_EXERCISES = ['multiple_choice', 'matching', 'listening']
const PRODUCTION_EXERCISES = ['text_input', 'speaking', 'free_production', 'transformation', 'reconstruction']

export function calculateIllusionScore(contentId: string, contentType: string): IllusionScore {
  const entries = getAllPerformance().filter((e) => e.contentId === contentId)

  const recognitionEntries = entries.filter(
    (e) => e.exerciseType && RECOGNITION_EXERCISES.includes(e.exerciseType)
  )
  const productionEntries = entries.filter(
    (e) => e.exerciseType && PRODUCTION_EXERCISES.includes(e.exerciseType)
  )

  const recognitionScore = recognitionEntries.length > 0
    ? (recognitionEntries.filter((e) => e.correct).length / recognitionEntries.length) * 100
    : -1

  const productionScore = productionEntries.length > 0
    ? (productionEntries.filter((e) => e.correct).length / productionEntries.length) * 100
    : -1

  const illusionGap = recognitionScore >= 0 && productionScore >= 0
    ? recognitionScore - productionScore
    : 0

  const isIllusion = illusionGap > 25 && recognitionScore >= 70 && productionScore < 60

  const diagnosis = generateDiagnosis(recognitionScore, productionScore, illusionGap, isIllusion)

  return {
    contentId,
    contentType,
    recognitionScore: Math.round(recognitionScore),
    productionScore: Math.round(productionScore),
    illusionGap: Math.round(illusionGap),
    isIllusion,
    diagnosis,
  }
}

function generateDiagnosis(recognition: number, production: number, gap: number, isIllusion: boolean): string {
  if (recognition < 0 && production < 0) return 'Dados insuficientes para análise.'
  if (recognition < 0) return 'Apenas exercícios de produção registrados.'
  if (production < 0) return 'Apenas exercícios de reconhecimento registrados — necessário praticar produção.'

  if (isIllusion) {
    return `Você reconhece bem este conteúdo (${Math.round(recognition)}%), mas tem dificuldade em produzi-lo sem alternativas (${Math.round(production)}%). Reduza múltipla escolha e pratique produção ativa.`
  }

  if (gap > 15 && recognition >= 60) {
    return `Há uma diferença entre reconhecimento (${Math.round(recognition)}%) e produção (${Math.round(production)}%). Pratique mais a produção.`
  }

  if (production >= 70 && recognition >= 70) {
    return 'Excelente! Você tanto reconhece quanto produz este conteúdo com confiança.'
  }

  if (production >= 50 && recognition >= 50) {
    return 'Desempenho equilibrado. Continue praticando ambos os modos.'
  }

  return 'Continue praticando para fortalecer este conteúdo.'
}

export function detectAllIllusions(): IllusionScore[] {
  const entries = getAllPerformance()
  const contentMap = new Map<string, { contentType: string }>()

  for (const entry of entries) {
    if (!contentMap.has(entry.contentId)) {
      contentMap.set(entry.contentId, { contentType: entry.contentType })
    }
  }

  const illusions: IllusionScore[] = []
  for (const [contentId, { contentType }] of contentMap) {
    const score = calculateIllusionScore(contentId, contentType)
    if (score.recognitionScore >= 0 && score.productionScore >= 0) {
      illusions.push(score)
    }
  }

  return illusions
}

export function getIllusionSummary(): {
  totalAnalyzed: number
  illusionCount: number
  healthyCount: number
  needsWorkCount: number
  topIllusions: IllusionScore[]
} {
  const all = detectAllIllusions()
  const illusions = all.filter((s) => s.isIllusion)
  const healthy = all.filter((s) => !s.isIllusion && s.illusionGap < 15)
  const needsWork = all.filter((s) => !s.isIllusion && s.illusionGap >= 15)

  return {
    totalAnalyzed: all.length,
    illusionCount: illusions.length,
    healthyCount: healthy.length,
    needsWorkCount: needsWork.length,
    topIllusions: illusions.sort((a, b) => b.illusionGap - a.illusionGap).slice(0, 5),
  }
}

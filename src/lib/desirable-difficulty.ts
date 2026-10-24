import { getSkillStats, type ExerciseType } from './performance'
import { getConfidenceDistribution } from './confidence'

export interface DifficultyAssessment {
  contentType: string
  currentDifficulty: number
  targetDifficulty: number
  adjustment: 'increase' | 'decrease' | 'maintain'
  reason: string
  recommendedExerciseType: ExerciseType
  confidenceMultiplier: number
}

const DIFFICULTY_FACTORS = {
  accuracy: { weight: 0.35, targetMin: 60, targetMax: 80 },
  responseTime: { weight: 0.2, targetMin: 2000, targetMax: 8000 },
  hintUsage: { weight: 0.15, targetMin: 0, targetMax: 2 },
  confidence: { weight: 0.15, targetMin: 2, targetMax: 3 },
  streak: { weight: 0.15, targetMin: 2, targetMax: 5 },
}

export function assessDifficulty(contentType: string): DifficultyAssessment {
  const stats = getSkillStats(contentType)
  const confidence = getConfidenceDistribution()

  const accuracyScore = normalizeAccuracy(stats.accuracy)
  const responseTimeScore = normalizeResponseTime(stats.avgResponseTime)
  const streakScore = normalizeStreak(stats.streak)

  const confTotal = confidence.chuted.correct + confidence.chuted.incorrect +
    confidence.low.correct + confidence.low.incorrect +
    confidence.medium.correct + confidence.medium.incorrect +
    confidence.high.correct + confidence.high.incorrect

  const confSuccessRate = confTotal > 0
    ? (confidence.medium.correct + confidence.high.correct) / confTotal
    : 0.5

  const confidenceScore = confSuccessRate

  const currentDifficulty = Math.round(
    accuracyScore * DIFFICULTY_FACTORS.accuracy.weight * 100 +
    responseTimeScore * DIFFICULTY_FACTORS.responseTime.weight * 100 +
    streakScore * DIFFICULTY_FACTORS.streak.weight * 100 +
    confidenceScore * DIFFICULTY_FACTORS.confidence.weight * 100 +
    50
  )

  const targetDifficulty = 65

  let adjustment: DifficultyAssessment['adjustment'] = 'maintain'
  let reason = ''

  if (stats.total < 3) {
    adjustment = 'maintain'
    reason = 'Dados insuficientes — mantendo dificuldade padrão.'
  } else if (currentDifficulty > targetDifficulty + 15) {
    adjustment = 'increase'
    reason = `Desempenho forte (${Math.round(currentDifficulty)}%) — aumentando desafio.`
  } else if (currentDifficulty < targetDifficulty - 15) {
    adjustment = 'decrease'
    reason = `Desempenho abaixo (${Math.round(currentDifficulty)}%) — reduzindo dificuldade.`
  } else {
    adjustment = 'maintain'
    reason = `Dificuldade adequada (${Math.round(currentDifficulty)}%) — mantendo ritmo.`
  }

  if (stats.recentAccuracy > 85 && stats.streak >= 5) {
    adjustment = 'increase'
    reason = `Sequência de ${stats.streak} acertos com ${Math.round(stats.recentAccuracy)}% precisão. Hora de aumentar!`
  }

  if (stats.recentAccuracy < 40 && stats.total > 3) {
    adjustment = 'decrease'
    reason = `Precisão recente em ${Math.round(stats.recentAccuracy)}%. Reduzindo dificuldade.`
  }

  const recommendedType = getRecommendedType(adjustment, stats.accuracy)

  return {
    contentType,
    currentDifficulty: Math.min(100, Math.max(0, currentDifficulty)),
    targetDifficulty,
    adjustment,
    reason,
    recommendedExerciseType: recommendedType,
    confidenceMultiplier: confidenceScore,
  }
}

function normalizeAccuracy(accuracy: number): number {
  return Math.min(1, accuracy / 100)
}

function normalizeResponseTime(timeMs: number): number {
  if (timeMs <= 0) return 0.5
  if (timeMs < 2000) return 1
  if (timeMs > 10000) return 0
  return 1 - (timeMs - 2000) / 8000
}

function normalizeStreak(streak: number): number {
  return Math.min(1, streak / 10)
}

function getRecommendedType(adjustment: DifficultyAssessment['adjustment'], accuracy: number): ExerciseType {
  if (adjustment === 'increase') {
    if (accuracy > 80) return 'free_production'
    if (accuracy > 70) return 'transformation'
    return 'text_input'
  }

  if (adjustment === 'decrease') {
    if (accuracy < 30) return 'multiple_choice'
    if (accuracy < 50) return 'matching'
    return 'fill_blank'
  }

  if (accuracy >= 70) return 'text_input'
  if (accuracy >= 50) return 'fill_blank'
  return 'multiple_choice'
}

export function getOptimalSessionLength(contentType: string): {
  recommendedMinutes: number
  reason: string
} {
  const stats = getSkillStats(contentType)

  if (stats.total < 5) return { recommendedMinutes: 10, reason: 'Iniciando — sessão curta para construir base.' }
  if (stats.accuracy < 40) return { recommendedMinutes: 8, reason: 'Precisão baixa — sessão focada para não frustrar.' }
  if (stats.accuracy > 85 && stats.streak >= 5) return { recommendedMinutes: 15, reason: 'Momentum forte — aproveite para avançar.' }
  return { recommendedMinutes: 12, reason: 'Sessão padrão para manter progresso.' }
}

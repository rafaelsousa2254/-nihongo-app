import { getSkillStats, type ExerciseType } from './performance'
import { getConnectionStrength } from './nihongo-brain'
import { getRecallRate } from './recall'
import { getConfidenceDistribution } from './confidence'

export type ExerciseLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface ExerciseEvolution {
  contentId: string
  contentType: string
  currentLevel: ExerciseLevel
  levelName: string
  levelDescription: string
  canProgress: boolean
  shouldRegress: boolean
  nextLevelRequirement: string
}

const LEVEL_CONFIG: Record<ExerciseLevel, { name: string; description: string; type: ExerciseType }> = {
  1: { name: 'Reconhecimento', description: 'Escolha o significado entre alternativas', type: 'multiple_choice' },
  2: { name: 'Leitura', description: 'Escolha a leitura correta', type: 'multiple_choice' },
  3: { name: 'Complete', description: 'Preencha lacunas na frase', type: 'fill_blank' },
  4: { name: ' Digite', description: 'Digite a resposta correta', type: 'text_input' },
  5: { name: 'Ouça', description: 'Reconheça o conteúdo por áudio', type: 'listening' },
  6: { name: 'Fale', description: 'Produza o conteúdo em voz alta', type: 'speaking' },
  7: { name: 'Produza', description: 'Use em frase original', type: 'free_production' },
  8: { name: 'Combine', description: 'Combine com outros conteúdos', type: 'transformation' },
}

export function getExerciseEvolution(contentId: string, contentType: string): ExerciseEvolution {
  const stats = getSkillStats(contentType)
  const recallRate = getRecallRate(contentId)
  const confidence = getConfidenceDistribution(contentId)

  const currentLevel = calculateCurrentLevel(stats.accuracy, stats.total, recallRate, confidence)

  const config = LEVEL_CONFIG[currentLevel]
  const nextConfig = currentLevel < 8 ? LEVEL_CONFIG[(currentLevel + 1) as ExerciseLevel] : null

  const canProgress = checkCanProgress(currentLevel, stats, recallRate)
  const shouldRegress = checkShouldRegress(currentLevel, stats)

  return {
    contentId,
    contentType,
    currentLevel,
    levelName: config.name,
    levelDescription: config.description,
    canProgress,
    shouldRegress,
    nextLevelRequirement: nextConfig
      ? `Mantenha precisão > 70% no nível ${currentLevel} por 5+ tentativas`
      : 'Nível máximo atingido!',
  }
}

function calculateCurrentLevel(
  accuracy: number,
  totalAttempts: number,
  recallRate: number,
  confidence: { chuted: { correct: number; incorrect: number }; low: { correct: number; incorrect: number }; medium: { correct: number; incorrect: number }; high: { correct: number; incorrect: number } }
): ExerciseLevel {
  if (totalAttempts < 3) return 1

  if (accuracy >= 85 && totalAttempts >= 15 && recallRate >= 70) return 8
  if (accuracy >= 80 && totalAttempts >= 12 && recallRate >= 60) return 7
  if (accuracy >= 75 && totalAttempts >= 10) return 6
  if (accuracy >= 70 && totalAttempts >= 8) return 5
  if (accuracy >= 65 && totalAttempts >= 6) return 4
  if (accuracy >= 60 && totalAttempts >= 5) return 3
  if (accuracy >= 50 && totalAttempts >= 3) return 2
  return 1
}

function checkCanProgress(level: ExerciseLevel, stats: { accuracy: number; total: number; streak: number }, recallRate: number): boolean {
  if (level >= 8) return false

  const requiredAccuracy = 65 + level * 3
  const requiredAttempts = 3 + level

  if (stats.accuracy < requiredAccuracy) return false
  if (stats.total < requiredAttempts) return false

  if (level >= 5 && recallRate >= 0 && recallRate < 40) return false

  return true
}

function checkShouldRegress(level: ExerciseLevel, stats: { accuracy: number; recentAccuracy: number; total: number }): boolean {
  if (level <= 1) return false

  if (stats.recentAccuracy < 40 && stats.recentAccuracy > 0) return true
  if (stats.accuracy < 30 && stats.total >= 5) return true

  return false
}

export function getRecommendedExerciseType(contentId: string, contentType: string): ExerciseType {
  const evolution = getExerciseEvolution(contentId, contentType)
  return LEVEL_CONFIG[evolution.currentLevel].type
}

export function shouldUseMultipleChoice(contentId: string, contentType: string): boolean {
  const evolution = getExerciseEvolution(contentId, contentType)
  return evolution.currentLevel <= 2
}

export function shouldUseFreeProduction(contentId: string, contentType: string): boolean {
  const evolution = getExerciseEvolution(contentId, contentType)
  return evolution.currentLevel >= 6
}

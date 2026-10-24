export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered' | 'expert'

export interface MasteryData {
  contentType: string
  contentId: string
  level: MasteryLevel
  score: number
  correctCount: number
  incorrectCount: number
  streak: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
  easeFactor: number
  interval: number
  repetitions: number
}

const MASTERY_THRESHOLDS = {
  new: 0,
  learning: 20,
  familiar: 50,
  mastered: 75,
  expert: 90,
}

const DECAY_RATE_PER_DAY = 2
const MAX_STREAK_BONUS = 20
const MIN_FOR_MASTERED = 10
const MIN_FOR_EXPERT = 20

export function calculateMasteryScore(
  correctCount: number,
  incorrectCount: number,
  streak: number,
  easeFactor: number,
  lastReviewedAt: string | null
): number {
  const total = correctCount + incorrectCount
  if (total === 0) return 0

  const accuracy = (correctCount / total) * 100
  const streakBonus = Math.min(streak * 2, MAX_STREAK_BONUS)
  const easeBonus = (easeFactor - 1.3) / (2.5 - 1.3) * 15
  let decayPenalty = 0

  if (lastReviewedAt) {
    const daysSinceReview = (Date.now() - new Date(lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24)
    decayPenalty = Math.min(daysSinceReview * DECAY_RATE_PER_DAY, 40)
  }

  const score = accuracy * 0.6 + streakBonus + easeBonus - decayPenalty
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getMasteryLevel(score: number, correctCount: number, incorrectCount: number): MasteryLevel {
  const total = correctCount + incorrectCount
  if (total === 0 || score < MASTERY_THRESHOLDS.learning) return 'new'
  if (score < MASTERY_THRESHOLDS.familiar) return 'learning'
  if (score < MASTERY_THRESHOLDS.mastered || correctCount < MIN_FOR_MASTERED) return 'familiar'
  if (score < MASTERY_THRESHOLDS.expert || correctCount < MIN_FOR_EXPERT) return 'mastered'
  return 'expert'
}

export function calculateMastery(
  contentType: string,
  contentId: string,
  correctCount: number,
  incorrectCount: number,
  streak: number,
  easeFactor: number,
  interval: number,
  repetitions: number,
  lastReviewedAt: string | null,
  nextReviewAt: string | null
): MasteryData {
  const score = calculateMasteryScore(correctCount, incorrectCount, streak, easeFactor, lastReviewedAt)
  const level = getMasteryLevel(score, correctCount, incorrectCount)

  return {
    contentType,
    contentId,
    level,
    score,
    correctCount,
    incorrectCount,
    streak,
    lastReviewedAt,
    nextReviewAt,
    easeFactor,
    interval,
    repetitions,
  }
}

export const MASTERY_COLORS: Record<MasteryLevel, string> = {
  new: '#ef4444',
  learning: '#f97316',
  familiar: '#eab308',
  mastered: '#22c55e',
  expert: '#3b82f6',
}

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: 'Novo',
  learning: 'Aprendendo',
  familiar: 'Familiar',
  mastered: 'Dominado',
  expert: 'Mestre',
}

export const MASTERY_ICONS: Record<MasteryLevel, string> = {
  new: '🔴',
  learning: '🟠',
  familiar: '🟡',
  mastered: '🟢',
  expert: '🔵',
}

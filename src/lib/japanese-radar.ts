import { getSkillStats, getErrors } from './performance'
import { detectWeaknesses } from './shadow-sensei'

export interface RadarSkill {
  id: string
  name: string
  score: number
  level: string
  strengths: string[]
  weaknesses: string[]
  recommendation: string
  actionHref: string
  icon: string
}

const CATEGORY_CONFIG = {
  hiragana: { name: 'Leitura', icon: '📖', actionHref: '/hiragana' },
  katakana: { name: 'Escrita Kana', icon: '✍️', actionHref: '/katakana' },
  kanji: { name: 'Kanji', icon: '漢', actionHref: '/kanji' },
  vocabulary: { name: 'Vocabulário', icon: '📚', actionHref: '/vocabulary' },
  grammar: { name: 'Gramática', icon: '📝', actionHref: '/grammar' },
  listening: { name: 'Audição', icon: '🎧', actionHref: '/practice/listening' },
}

function calculateSkillScore(category: string): number {
  const stats = getSkillStats(category)
  if (stats.total === 0) return 0

  const accuracyScore = stats.accuracy * 0.5
  const recentScore = stats.recentAccuracy * 0.3
  const streakScore = Math.min(stats.streak * 3, 15)
  const volumeScore = Math.min(stats.total * 2, 20)

  return Math.min(100, Math.round(accuracyScore + recentScore + streakScore + volumeScore))
}

function getLevelLabel(score: number): string {
  if (score >= 90) return 'Mestre'
  if (score >= 70) return 'Avançado'
  if (score >= 50) return 'Intermediário'
  if (score >= 25) return 'Básico'
  if (score > 0) return 'Iniciante'
  return 'Não iniciado'
}

function getStrengths(category: string): string[] {
  const stats = getSkillStats(category)
  const strengths: string[] = []

  if (stats.accuracy >= 80) strengths.push('Alta precisão geral')
  if (stats.recentAccuracy >= 75) strengths.push('Bom desempenho recente')
  if (stats.streak >= 5) strengths.push(`Sequência de ${stats.streak} acertos`)
  if (stats.maxStreak >= 10) strengths.push(`Recorde de ${stats.maxStreak} acertos`)
  if (stats.avgResponseTime > 0 && stats.avgResponseTime < 3000) strengths.push('Resposta rápida')

  return strengths
}

function getWeaknesses(category: string): string[] {
  const weaknesses: string[] = []
  const stats = getSkillStats(category)

  if (stats.accuracy < 50 && stats.total > 0) weaknesses.push('Precisão abaixo de 50%')
  if (stats.recentAccuracy < 40 && stats.total > 0) weaknesses.push('Desempenho recente caindo')
  if (stats.streak === 0 && stats.total > 3) weaknesses.push('Sem sequência de acertos')
  if (stats.avgResponseTime > 5000) weaknesses.push('Resposta lenta')

  const errors = getErrors(category)
  if (errors.length >= 3) weaknesses.push(`${errors.length} erros registrados`)

  const weaknesses2 = detectWeaknesses().filter((w) => w.contentType === category)
  weaknesses2.forEach((w) => weaknesses.push(w.description))

  return [...new Set(weaknesses)].slice(0, 3)
}

function getRecommendation(category: string, score: number): string {
  if (score === 0) return `Comece a estudar ${getCategoryName(category)}!`
  if (score < 30) continueRecomm(category, score)
  if (score < 60) return `Continue praticando ${getCategoryName(category)}. Foco na precisão.`
  if (score < 80) return `Bom progresso! Tente desafios mais difíceis em ${getCategoryName(category)}.`
  return `Excelente! Mantenha o nível praticando regularmente.`
}

function continueRecomm(category: string, score: number): string {
  const errors = getErrors(category)
  if (errors.length > 0) return `Revise os erros registrados em ${getCategoryName(category)}.`
  return `Pratique o básico de ${getCategoryName(category)} para melhorar.`
}

function getCategoryName(category: string): string {
  return CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.name || category
}

export function calculateRadarSkills(): RadarSkill[] {
  return Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
    const score = calculateSkillScore(category)
    return {
      id: category,
      name: config.name,
      score,
      level: getLevelLabel(score),
      strengths: getStrengths(category),
      weaknesses: getWeaknesses(category),
      recommendation: getRecommendation(category, score),
      actionHref: config.actionHref,
      icon: config.icon,
    }
  })
}

export function getRadarAverage(): number {
  const skills = calculateRadarSkills()
  const totalScore = skills.reduce((sum, s) => sum + s.score, 0)
  return Math.round(totalScore / skills.length)
}

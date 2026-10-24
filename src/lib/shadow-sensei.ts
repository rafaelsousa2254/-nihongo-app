import { getErrors, getSkillStats, type ErrorRecord } from './performance'
import { detectConnectionWeaknesses } from './connection-mastery'
import { detectAllIllusions } from './illusion-detector'
import { getConfidenceDistribution, detectHighConfidenceErrors } from './confidence'

export type WeaknessType =
  | 'kana_confusion'
  | 'kanji_error'
  | 'vocabulary_forgotten'
  | 'grammar_difficulty'
  | 'category_low_accuracy'
  | 'consecutive_errors'
  | 'regression'
  | 'connection_weak'
  | 'illusion_of_mastery'
  | 'high_confidence_error'

export interface WeaknessPattern {
  type: WeaknessType
  description: string
  severity: 'low' | 'medium' | 'high'
  contentType: string
  contentId?: string
  actionLabel: string
  actionHref: string
  confidence: number
}

const CONFUSION_PAIRS: Record<string, string[]> = {
  'し': ['す', 'ち'],
  'す': ['し'],
  'シ': ['ツ', 'ソ'],
  'ツ': ['シ', 'ソ'],
  'ソ': ['ツ', 'シ'],
  'ぬ': ['め', 'す'],
  'め': ['ぬ'],
  'は': ['ほ'],
  'ほ': ['は'],
  'ク': ['タ'],
  'タ': ['ク'],
  '口': ['日'],
  '日': ['口'],
  '人': ['入'],
  '入': ['人'],
  '大': ['犬', '天'],
  '力': ['刀'],
  '土': ['士'],
  '末': ['未'],
  '未': ['末'],
}

const CATEGORY_MAP: Record<string, string> = {
  hiragana: 'hiragana',
  katakana: 'katakana',
  kanji: 'kanji',
  vocabulary: 'vocabulary',
  grammar: 'grammar',
  listening: 'listening',
  pronunciation: 'pronunciation',
}

export function detectWeaknesses(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const allErrors = getErrors()

  patterns.push(...detectKanaConfusions(allErrors))
  patterns.push(...detectConsecutiveErrors())
  patterns.push(...detectCategoryWeakness())
  patterns.push(...detectRegression())
  patterns.push(...detectConnectionWeaknesses2())
  patterns.push(...detectIllusionPatterns())
  patterns.push(...detectHighConfidenceErrors2())

  return patterns.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  }).slice(0, 12)
}

function detectKanaConfusions(errors: ErrorRecord[]): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []

  for (const [char, confusions] of Object.entries(CONFUSION_PAIRS)) {
    const charErrors = errors.filter(
      (e) => (e.givenAnswer === char || e.correctAnswer === char) &&
        confusions.includes(e.givenAnswer) || confusions.includes(e.correctAnswer)
    )

    if (charErrors.length >= 2) {
      const confusionChars = charErrors.map((e) =>
        e.givenAnswer === char ? e.correctAnswer : e.givenAnswer
      )
      const uniqueConfusions = [...new Set(confusionChars)].slice(0, 2)

      patterns.push({
        type: 'kana_confusion',
        description: `Você confundiu ${char} com ${uniqueConfusions.join(' e ')} várias vezes recentemente.`,
        severity: charErrors.length >= 4 ? 'high' : 'medium',
        contentType: charErrors[0].contentType,
        actionLabel: 'Praticar este kana',
        actionHref: charErrors[0].contentType === 'hiragana' ? '/hiragana' : '/katakana',
        confidence: Math.min(charErrors.length / 5, 1),
      })
    }
  }

  return patterns
}

function detectConsecutiveErrors(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const categories = ['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar']

  for (const cat of categories) {
    const stats = getSkillStats(cat)
    if (stats.streak === 0 && stats.total >= 3) {
      const recentStats = getSkillStats(cat)
      if (recentStats.recentAccuracy < 40) {
        patterns.push({
          type: 'consecutive_errors',
          description: `Seu desempenho em ${getCategoryName(cat)} está baixo nas últimas atividades.`,
          severity: 'high',
          contentType: cat,
          actionLabel: `Revisar ${getCategoryName(cat)}`,
          actionHref: `/${cat}`,
          confidence: 0.8,
        })
      }
    }
  }

  return patterns
}

function detectCategoryWeakness(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const categories = ['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar']

  for (const cat of categories) {
    const stats = getSkillStats(cat)
    if (stats.total >= 5 && stats.accuracy < 50) {
      patterns.push({
        type: 'category_low_accuracy',
        description: `Sua precisão em ${getCategoryName(cat)} está em ${Math.round(stats.accuracy)}%.`,
        severity: stats.accuracy < 30 ? 'high' : 'medium',
        contentType: cat,
        actionLabel: `Melhorar em ${getCategoryName(cat)}`,
        actionHref: `/${cat}`,
        confidence: Math.min(stats.total / 10, 1),
      })
    }
  }

  return patterns
}

function detectRegression(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const errors = getErrors()

  const recentErrors = errors.filter(
    (e) => Date.now() - new Date(e.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
  )

  const olderErrors = errors.filter(
    (e) => {
      const age = Date.now() - new Date(e.timestamp).getTime()
      return age >= 7 * 24 * 60 * 60 * 1000 && age < 30 * 24 * 60 * 60 * 1000
    }
  )

  const recentContentIds = new Set(recentErrors.map((e) => `${e.contentType}_${e.contentId}`))
  const olderContentIds = new Set(olderErrors.map((e) => `${e.contentType}_${e.contentId}`))

  for (const contentId of recentContentIds) {
    if (olderContentIds.has(contentId)) {
      const parts = contentId.split('_')
      const contentType = parts[0]
      patterns.push({
        type: 'regression',
        description: `Você havia aprendido algo em ${getCategoryName(contentType)}, mas está errando novamente.`,
        severity: 'medium',
        contentType,
        actionLabel: `Revisar ${getCategoryName(contentType)}`,
        actionHref: `/${contentType}`,
        confidence: 0.7,
      })
    }
  }

  return patterns.slice(0, 3)
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    vocabulary: 'Vocabulário',
    grammar: 'Gramática',
    listening: 'Escuta',
    pronunciation: 'Pronúncia',
    conversation: 'Conversação',
  }
  return names[category] || category
}

export function generateShadowSenseiMessage(): string | null {
  const weaknesses = detectWeaknesses()
  if (weaknesses.length === 0) return null

  const top = weaknesses[0]
  return top.description
}

function detectConnectionWeaknesses2(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const connectionWeaknesses = detectConnectionWeaknesses()

  for (const cw of connectionWeaknesses.slice(0, 3)) {
    patterns.push({
      type: 'connection_weak',
      description: cw.description,
      severity: cw.severity,
      contentType: cw.connectionType.includes('verb') ? 'grammar' : 'vocabulary',
      actionLabel: 'Praticar conexão',
      actionHref: '/flashcards',
      confidence: 0.8,
    })
  }

  return patterns
}

function detectIllusionPatterns(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const illusions = detectAllIllusions()

  for (const illusion of illusions.filter((i) => i.isIllusion).slice(0, 2)) {
    patterns.push({
      type: 'illusion_of_mastery',
      description: `Você reconhece "${illusion.contentId}" (${illusion.recognitionScore}%), mas não consegue produzir sem ajuda (${illusion.productionScore}%).`,
      severity: illusion.illusionGap > 40 ? 'high' : 'medium',
      contentType: illusion.contentType,
      contentId: illusion.contentId,
      actionLabel: 'Praticar produção ativa',
      actionHref: '/flashcards',
      confidence: 0.85,
    })
  }

  return patterns
}

function detectHighConfidenceErrors2(): WeaknessPattern[] {
  const patterns: WeaknessPattern[] = []
  const highConfErrors = detectHighConfidenceErrors()

  for (const err of highConfErrors.slice(0, 2)) {
    patterns.push({
      type: 'high_confidence_error',
      description: `Você errou "${err.contentId}" mesmo estando confiante (${err.errorCount}x). Isso pode indicar um conceito aprendido incorretamente.`,
      severity: err.severity === 'critical' ? 'high' : 'medium',
      contentType: err.contentType,
      contentId: err.contentId,
      actionLabel: 'Revisar conceito',
      actionHref: '/error-notebook',
      confidence: 0.9,
    })
  }

  return patterns
}

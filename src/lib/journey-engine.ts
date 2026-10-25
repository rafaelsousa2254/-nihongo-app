import { getSkillStats, getErrors, getRecurringErrors } from './performance'
import { detectWeaknesses } from './shadow-sensei'
import { calculateRadarSkills } from './japanese-radar'
import { findWeakConnections } from './nihongo-brain'
import { detectAllIllusions } from './illusion-detector'
import { generateSmartExercises } from './smart-exercises'
import { detectRivals, getActiveRivals } from './error-revenge'

export interface Mission {
  id: string
  type: 'warmup' | 'kanji' | 'listening' | 'vocabulary' | 'grammar' | 'conversation' | 'boss' | 'error_revenge' | 'smart_exercise' | 'vanishing' | 'grammar_fusion' | 'audio_puzzle' | 'meaning_detective' | 'memory_reconstruction'
  title: string
  description: string
  duration: string
  icon: string
  href: string
  priority: number
  reason: string
}

const ACTIVITY_CONFIG: Record<string, { icon: string; href: string; duration: string }> = {
  hiragana: { icon: '🈶', href: '/hiragana', duration: '3 min' },
  katakana: { icon: '🈶', href: '/katakana', duration: '3 min' },
  kanji: { icon: '漢', href: '/kanji', duration: '5 min' },
  vocabulary: { icon: '📚', href: '/vocabulary', duration: '4 min' },
  grammar: { icon: '📝', href: '/grammar', duration: '4 min' },
  listening: { icon: '🎧', href: '/practice/listening', duration: '4 min' },
  pronunciation: { icon: '🗣️', href: '/practice/pronunciation', duration: '4 min' },
  conversation: { icon: '💬', href: '/conversation', duration: '5 min' },
  flashcards: { icon: '🎴', href: '/flashcards', duration: '5 min' },
  quiz: { icon: '📝', href: '/practice/quiz', duration: '5 min' },
  error_revenge: { icon: '⚔️', href: '/error-revenge', duration: '4 min' },
  smart_exercise: { icon: '🧠', href: '/smart-exercises', duration: '4 min' },
  vanishing: { icon: '👁️', href: '/vanishing', duration: '5 min' },
  grammar_fusion: { icon: '🧬', href: '/grammar-fusion', duration: '5 min' },
  audio_puzzle: { icon: '🔊', href: '/audio-puzzle', duration: '4 min' },
  meaning_detective: { icon: '🔍', href: '/meaning-detective', duration: '4 min' },
  memory_reconstruction: { icon: '🧩', href: '/memory-reconstruction', duration: '4 min' },
}

const ACTIVITY_NAMES: Record<string, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  kanji: 'Kanji',
  vocabulary: 'Vocabulário',
  grammar: 'Gramática',
  listening: 'Audição',
  pronunciation: 'Pronúncia',
  conversation: 'Conversação',
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  error_revenge: 'Error Revenge',
  smart_exercise: 'Smart Exercise',
  vanishing: 'Vanishing Japanese',
  grammar_fusion: 'Grammar Fusion',
  audio_puzzle: 'Audio Puzzle',
  meaning_detective: 'Meaning Detective',
  memory_reconstruction: 'Memory Reconstruction',
}

function calculatePriority(category: string): { priority: number; reason: string } {
  const stats = getSkillStats(category)
  let priority = 0
  const reasons: string[] = []

  if (stats.total === 0) {
    priority += 30
    reasons.push('nunca estudado')
  } else {
    if (stats.accuracy < 50) {
      priority += 25
      reasons.push(`precisão baixa (${Math.round(stats.accuracy)}%)`)
    } else if (stats.accuracy < 70) {
      priority += 15
      reasons.push(`precisão moderada (${Math.round(stats.accuracy)}%)`)
    }

    if (stats.recentAccuracy < 40 && stats.total > 0) {
      priority += 20
      reasons.push('desempenho recente caindo')
    }

    if (stats.streak === 0 && stats.total > 0) {
      priority += 10
      reasons.push('sem sequência de acertos')
    }
  }

  const errors = getErrors(category)
  const recurringErrors = errors.filter((e) => e.severity === 'recurring' || e.severity === 'critical_weakness')
  if (recurringErrors.length >= 3) {
    priority += 20
    reasons.push(`${recurringErrors.length} erros recorrentes`)
  }

  return {
    priority,
    reason: reasons.length > 0 ? reasons.join(', ') : 'manutenção',
  }
}

export function generateDailyMissions(): Mission[] {
  const missions: Mission[] = []

  const warmupPriority = calculatePriority('hiragana')
  missions.push({
    id: 'warmup',
    type: 'warmup',
    title: 'Aquecimento',
    description: 'Revisão rápida de hiragana/katakana',
    duration: '3 min',
    icon: '⚡',
    href: '/hiragana',
    priority: 50 + warmupPriority.priority,
    reason: warmupPriority.reason,
  })

  const rivals = getActiveRivals()
  if (rivals.length > 0) {
    const topRival = rivals.sort((a, b) => b.totalErrors - a.totalErrors)[0]
    missions.push({
      id: 'error_revenge',
      type: 'error_revenge',
      title: 'Error Revenge',
      description: `Enfrente seu rival: ${topRival.label}`,
      duration: '4 min',
      icon: '⚔️',
      href: '/error-revenge',
      priority: 45,
      reason: `${topRival.totalErrors} erros registrados`,
    })
  }

  const illusions = detectAllIllusions().filter((i) => i.isIllusion)
  if (illusions.length > 0) {
    missions.push({
      id: 'smart_exercise',
      type: 'smart_exercise',
      title: 'Smart Exercise',
      description: 'Exercícios gerados para suas fraquezas',
      duration: '4 min',
      icon: '🧠',
      href: '/smart-exercises',
      priority: 42,
      reason: 'Conexões fracas detectadas',
    })
  }

  const weaknesses = detectWeaknesses()
  const connectionWeaknesses = weaknesses.filter((w) => w.type === 'connection_weak')
  if (connectionWeaknesses.length > 0) {
    missions.push({
      id: 'grammar_fusion',
      type: 'grammar_fusion',
      title: 'Grammar Fusion',
      description: 'Transforme frases para fortalecer conexões',
      duration: '5 min',
      icon: '🧬',
      href: '/grammar-fusion',
      priority: 40,
      reason: 'Combinações gramaticais fracas',
    })
  }

  const categoryPriorities: Array<{ category: string; priority: number; reason: string }> = []

  const mainCategories = ['kanji', 'vocabulary', 'grammar', 'listening']
  for (const cat of mainCategories) {
    const { priority, reason } = calculatePriority(cat)
    categoryPriorities.push({ category: cat, priority, reason })
  }

  const radar = calculateRadarSkills()
  for (const skill of radar) {
    if (skill.score < 30 && !categoryPriorities.find((p) => p.category === skill.id)) {
      categoryPriorities.push({
        category: skill.id,
        priority: 20,
        reason: skill.weaknesses[0] || 'baixa pontuação',
      })
    }
  }

  categoryPriorities.sort((a, b) => b.priority - a.priority)

  const topCategories = categoryPriorities.slice(0, 3)
  const existingHrefs = new Set(['/', '/error-revenge', '/smart-exercises', '/grammar-fusion'])

  for (const { category, reason } of topCategories) {
    const config = ACTIVITY_CONFIG[category]
    if (!config || existingHrefs.has(config.href)) continue

    existingHrefs.add(config.href)
    const catPriority = calculatePriority(category)

    missions.push({
      id: category,
      type: category as Mission['type'],
      title: ACTIVITY_NAMES[category] || category,
      description: reason,
      duration: config.duration,
      icon: config.icon,
      href: config.href,
      priority: catPriority.priority + 30,
      reason,
    })
  }

  if (missions.length < 6) {
    const newActivities = ['vanishing', 'audio_puzzle', 'meaning_detective', 'memory_reconstruction']
      .filter((c) => !missions.find((m) => m.id === c))

    for (const act of newActivities.slice(0, 6 - missions.length)) {
      const config = ACTIVITY_CONFIG[act]
      if (!config) continue
      missions.push({
        id: act,
        type: act as Mission['type'],
        title: ACTIVITY_NAMES[act] || act,
        description: 'Prática avançada adaptativa',
        duration: config.duration,
        icon: config.icon,
        href: config.href,
        priority: 15,
        reason: 'atividade avançada',
      })
    }
  }

  if (missions.length < 6) {
    const remaining = ['flashcards', 'pronunciation', 'conversation', 'quiz']
      .filter((c) => !missions.find((m) => m.id === c))

    for (const cat of remaining.slice(0, 6 - missions.length)) {
      const config = ACTIVITY_CONFIG[cat]
      if (!config) continue
      missions.push({
        id: cat,
        type: cat as Mission['type'],
        title: ACTIVITY_NAMES[cat] || cat,
        description: 'Prática para manter o conhecimento',
        duration: config.duration,
        icon: config.icon,
        href: config.href,
        priority: 10,
        reason: 'manutenção',
      })
    }
  }

  const bossSkill = radar.find((s) => s.score >= 40)
  if (bossSkill) {
    missions.push({
      id: 'boss',
      type: 'boss',
      title: 'Boss Battle',
      description: `Desafio final: ${bossSkill.name}`,
      duration: '8 min',
      icon: '👑',
      href: '/boss-battle',
      priority: 5,
      reason: 'desafio final',
    })
  }

  return missions.sort((a, b) => b.priority - a.priority)
}

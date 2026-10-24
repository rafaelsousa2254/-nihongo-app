import { getErrors, getSkillStats } from './performance'

export interface ContextualTip {
  id: string
  title: string
  description: string
  actionLabel: string
  actionHref: string
  icon: string
  priority: number
}

export function generateContextualTips(): ContextualTip[] {
  const tips: ContextualTip[] = []
  const categories = ['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar'] as const

  for (const cat of categories) {
    const stats = getSkillStats(cat)
    if (stats.total === 0) {
      tips.push({
        id: `start-${cat}`,
        title: `Comece com ${getCatName(cat)}`,
        description: `Você ainda não praticou ${getCatName(cat)}. Que tal começar agora?`,
        actionLabel: `Praticar ${getCatName(cat)}`,
        actionHref: `/${cat}`,
        icon: getCatIcon(cat),
        priority: 10,
      })
    } else if (stats.accuracy < 50 && stats.total >= 5) {
      tips.push({
        id: `improve-${cat}`,
        title: `${getCatName(cat)} precisa de atenção`,
        description: `Sua precisão em ${getCatName(cat)} está em ${Math.round(stats.accuracy)}%. Revise o conteúdo.`,
        actionLabel: `Melhorar em ${getCatName(cat)}`,
        actionHref: `/${cat}`,
        icon: '⚠️',
        priority: 9,
      })
    } else if (stats.recentAccuracy < stats.accuracy - 15) {
      tips.push({
        id: `regression-${cat}`,
        title: `Regressão em ${getCatName(cat)}`,
        description: `Seu desempenho recente em ${getCatName(cat)} caiu. Revisar pode ajudar.`,
        actionLabel: `Revisar ${getCatName(cat)}`,
        actionHref: `/${cat}`,
        icon: '📉',
        priority: 8,
      })
    }
  }

  const errors = getErrors()
  const recurringErrors = errors.filter(
    (e) => e.severity === 'recurring' || e.severity === 'critical_weakness'
  )
  if (recurringErrors.length > 0) {
    tips.push({
      id: 'error-review',
      title: 'Revise seus erros recorrentes',
      description: `Você tem ${recurringErrors.length} erros que se repetem. O caderno de erros pode ajudar.`,
      actionLabel: 'Ver Caderno de Erros',
      actionHref: '/error-notebook',
      icon: '📝',
      priority: 7,
    })
  }

  const kanjiStats = getSkillStats('kanji')
  const vocabStats = getSkillStats('vocabulary')
  if (kanjiStats.total > 20 && vocabStats.total < 10) {
    tips.push({
      id: 'try-vocab',
      title: 'Hora de vocabulário!',
      description: 'Você já sabe muitos kanji. Que tal aprender novas palavras?',
      actionLabel: 'Ir para Vocabulário',
      actionHref: '/vocabulary',
      icon: '📚',
      priority: 5,
    })
  }

  tips.push({
    id: 'flashcards',
    title: 'Revisão espaçada',
    description: 'Flashcards ajudam a fixar o conteúdo a longo prazo.',
    actionLabel: 'Abrir Flashcards',
    actionHref: '/flashcards',
    icon: '🃏',
    priority: 4,
  })

  tips.push({
    id: 'jlpt',
    title: 'Prepare-se pro JLPT',
    description: 'Pratique questões no estilo da prova oficial.',
    actionLabel: 'JLPT Prep',
    actionHref: '/jlpt',
    icon: '🎓',
    priority: 3,
  })

  tips.push({
    id: 'conversation',
    title: 'Pratique conversação',
    description: 'Converse com a IA para praticar japonês falado.',
    actionLabel: 'Conversar',
    actionHref: '/conversation',
    icon: '💬',
    priority: 2,
  })

  return tips.sort((a, b) => b.priority - a.priority).slice(0, 6)
}

function getCatName(cat: string): string {
  const names: Record<string, string> = {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    vocabulary: 'Vocabulário',
    grammar: 'Gramática',
  }
  return names[cat] || cat
}

function getCatIcon(cat: string): string {
  const icons: Record<string, string> = {
    hiragana: 'あ',
    katakana: 'ア',
    kanji: '漢',
    vocabulary: '📚',
    grammar: '📖',
  }
  return icons[cat] || '📚'
}

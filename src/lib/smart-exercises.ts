import { findWeakConnections, getConnectionsForContent, type ConnectionType } from './nihongo-brain'
import { getSkillStats } from './performance'

export interface SmartExercise {
  id: string
  type: 'fill_blank' | 'transformation' | 'connection_test' | 'production' | 'recall'
  instruction: string
  template: string
  answer: string
  alternatives: string[]
  connectionType: ConnectionType
  sourceId: string
  targetId: string
  difficulty: number
  reason: string
}

export function generateSmartExercises(limit: number = 5): SmartExercise[] {
  const weakConnections = findWeakConnections()
  const exercises: SmartExercise[] = []

  for (const conn of weakConnections.slice(0, limit)) {
    const exercise = createExerciseFromConnection(conn)
    if (exercise) exercises.push(exercise)
  }

  if (exercises.length < limit) {
    const additional = generateFromSkillGaps(limit - exercises.length)
    exercises.push(...additional)
  }

  return exercises.slice(0, limit)
}

function createExerciseFromConnection(conn: {
  sourceId: string
  targetId: string
  connectionType: ConnectionType
  strength: number
  correctCount: number
  incorrectCount: number
}): SmartExercise | null {
  const total = conn.correctCount + conn.incorrectCount
  const accuracy = total > 0 ? (conn.correctCount / total) * 100 : 0

  switch (conn.connectionType) {
    case 'verb_conjugation':
      return {
        id: `smart_${conn.sourceId}_${conn.targetId}`,
        type: 'transformation',
        instruction: `Converte "${conn.sourceId}" para ${conn.targetId}`,
        template: `${conn.sourceId} → ???`,
        answer: conn.targetId,
        alternatives: [],
        connectionType: conn.connectionType,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        difficulty: 100 - conn.strength,
        reason: `Conjugação fraca — precisão ${Math.round(accuracy)}%`,
      }

    case 'verb_particle':
      return {
        id: `smart_${conn.sourceId}_${conn.targetId}`,
        type: 'fill_blank',
        instruction: `Complete com a partícula correta`,
        template: `${conn.sourceId} ＿ ${conn.targetId}`,
        answer: conn.targetId,
        alternatives: [],
        connectionType: conn.connectionType,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        difficulty: 100 - conn.strength,
        reason: `Partícula fraca — precisão ${Math.round(accuracy)}%`,
      }

    case 'word_kanji':
      return {
        id: `smart_${conn.sourceId}_${conn.targetId}`,
        type: 'recall',
        instruction: `Qual kanji aparece em "${conn.sourceId}"?`,
        template: `${conn.sourceId} → [KANJI]`,
        answer: conn.targetId,
        alternatives: [],
        connectionType: conn.connectionType,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        difficulty: 100 - conn.strength,
        reason: `Kanji-palavra fraco — precisão ${Math.round(accuracy)}%`,
      }

    case 'grammar_grammar':
      return {
        id: `smart_${conn.sourceId}_${conn.targetId}`,
        type: 'production',
        instruction: `Combine as estruturas "${conn.sourceId}" e "${conn.targetId}" em uma frase`,
        template: `${conn.sourceId} + ${conn.targetId}`,
        answer: '',
        alternatives: [],
        connectionType: conn.connectionType,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        difficulty: 100 - conn.strength,
        reason: `Combinação gramatical fraca`,
      }

    default:
      return {
        id: `smart_${conn.sourceId}_${conn.targetId}`,
        type: 'fill_blank',
        instruction: `Teste a conexão entre "${conn.sourceId}" e "${conn.targetId}"`,
        template: `${conn.sourceId} → ${conn.targetId}`,
        answer: conn.targetId,
        alternatives: [],
        connectionType: conn.connectionType,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        difficulty: 100 - conn.strength,
        reason: `Conexão fraca — precisão ${Math.round(accuracy)}%`,
      }
  }
}

function generateFromSkillGaps(count: number): SmartExercise[] {
  const exercises: SmartExercise[] = []
  const categories = ['kanji', 'vocabulary', 'grammar']

  for (const cat of categories) {
    if (exercises.length >= count) break

    const stats = getSkillStats(cat)
    if (stats.total > 0 && stats.accuracy < 60) {
      exercises.push({
        id: `gap_${cat}_${Date.now()}`,
        type: 'fill_blank',
        instruction: `Revise conteúdo fraco em ${cat}`,
        template: `Prática de ${cat}`,
        answer: '',
        alternatives: [],
        connectionType: 'vocab_context',
        sourceId: cat,
        targetId: cat,
        difficulty: 100 - stats.accuracy,
        reason: `Precisão baixa em ${cat} (${Math.round(stats.accuracy)}%)`,
      })
    }
  }

  return exercises
}

export function prioritizeExercises(exercises: SmartExercise[]): SmartExercise[] {
  return exercises.sort((a, b) => {
    if (a.difficulty > 70 && b.difficulty <= 70) return -1
    if (a.difficulty <= 70 && b.difficulty > 70) return 1
    return b.difficulty - a.difficulty
  })
}

import {
  getOrCreateConnection,
  recordConnectionAttempt,
  getConnectionStrength,
  findWeakConnections,
  type ConnectionType,
  type ConnectionStrength,
} from './nihongo-brain'

export interface ConnectionMastery {
  sourceId: string
  sourceLabel: string
  targetId: string
  targetLabel: string
  connectionType: ConnectionType
  strength: number
  level: ConnectionStrength['level']
  correctCount: number
  incorrectCount: number
  accuracy: number
  needsReview: boolean
  lastTestedAt: string | null
}

export interface ContentConnectionReport {
  contentId: string
  contentLabel: string
  connections: ConnectionMastery[]
  averageStrength: number
  weakestConnection: ConnectionMastery | null
  strongestConnection: ConnectionMastery | null
  totalConnections: number
}

export function trackConnection(
  sourceId: string,
  sourceType: string,
  targetId: string,
  targetType: string,
  connectionType: ConnectionType,
  correct: boolean
): ConnectionMastery {
  const conn = getOrCreateConnection(sourceId, sourceType, targetId, targetType, connectionType)
  const updated = recordConnectionAttempt(conn.id, correct)
  if (!updated) return toMastery(conn, sourceId, targetId, connectionType, correct)

  const strength = getConnectionStrength(updated.id)
  return {
    sourceId: updated.sourceId,
    sourceLabel: updated.sourceId,
    targetId: updated.targetId,
    targetLabel: updated.targetId,
    connectionType: updated.connectionType,
    strength: strength.strength,
    level: strength.level,
    correctCount: updated.correctCount,
    incorrectCount: updated.incorrectCount,
    accuracy: (updated.correctCount + updated.incorrectCount) > 0
      ? (updated.correctCount / (updated.correctCount + updated.incorrectCount)) * 100
      : 0,
    needsReview: strength.needsReview,
    lastTestedAt: updated.lastTestedAt,
  }
}

function toMastery(
  conn: { sourceId: string; targetId: string; connectionType: ConnectionType; correctCount: number; incorrectCount: number; lastTestedAt: string | null; strength: number },
  sourceId: string,
  targetId: string,
  connectionType: ConnectionType,
  correct: boolean
): ConnectionMastery {
  const total = conn.correctCount + conn.incorrectCount
  return {
    sourceId: conn.sourceId,
    sourceLabel: sourceId,
    targetId: conn.targetId,
    targetLabel: targetId,
    connectionType,
    strength: conn.strength,
    level: conn.strength >= 85 ? 'mastered' : conn.strength >= 65 ? 'strong' : conn.strength >= 45 ? 'solid' : conn.strength >= 25 ? 'developing' : 'weak',
    correctCount: conn.correctCount,
    incorrectCount: conn.incorrectCount,
    accuracy: total > 0 ? (conn.correctCount / total) * 100 : 0,
    needsReview: conn.strength < 30,
    lastTestedAt: conn.lastTestedAt,
  }
}

export function getContentConnectionReport(
  contentId: string,
  contentLabel: string,
  connections: Array<{ sourceId: string; sourceType: string; targetId: string; targetType: string; connectionType: ConnectionType }>
): ContentConnectionReport {
  const masteries: ConnectionMastery[] = []

  for (const connDef of connections) {
    const conn = getOrCreateConnection(
      connDef.sourceId, connDef.sourceType,
      connDef.targetId, connDef.targetType,
      connDef.connectionType
    )
    const strength = getConnectionStrength(conn.id)
    masteries.push({
      sourceId: conn.sourceId,
      sourceLabel: conn.sourceId,
      targetId: conn.targetId,
      targetLabel: conn.targetId,
      connectionType: conn.connectionType,
      strength: strength.strength,
      level: strength.level,
      correctCount: conn.correctCount,
      incorrectCount: conn.incorrectCount,
      accuracy: (conn.correctCount + conn.incorrectCount) > 0
        ? (conn.correctCount / (conn.correctCount + conn.incorrectCount)) * 100
        : 0,
      needsReview: strength.needsReview,
      lastTestedAt: conn.lastTestedAt,
    })
  }

  const avgStrength = masteries.length > 0
    ? Math.round(masteries.reduce((s, m) => s + m.strength, 0) / masteries.length)
    : 0

  return {
    contentId,
    contentLabel,
    connections: masteries,
    averageStrength: avgStrength,
    weakestConnection: masteries.sort((a, b) => a.strength - b.strength)[0] || null,
    strongestConnection: masteries.sort((a, b) => b.strength - a.strength)[0] || null,
    totalConnections: masteries.length,
  }
}

export function detectConnectionWeaknesses(): Array<{
  description: string
  severity: 'low' | 'medium' | 'high'
  connectionType: ConnectionType
  sourceId: string
  targetId: string
  accuracy: number
}> {
  const weaknesses = findWeakConnections()
  return weaknesses.map((conn) => {
    const total = conn.correctCount + conn.incorrectCount
    const accuracy = total > 0 ? (conn.correctCount / total) * 100 : 0
    return {
      description: getConnectionDescription(conn.sourceId, conn.targetId, conn.connectionType, accuracy),
      severity: (accuracy < 30 ? 'high' : accuracy < 50 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
      connectionType: conn.connectionType,
      sourceId: conn.sourceId,
      targetId: conn.targetId,
      accuracy,
    }
  }).slice(0, 10)
}

function getConnectionDescription(source: string, target: string, type: ConnectionType, accuracy: number): string {
  const typeDescriptions: Record<ConnectionType, string> = {
    word_kanji: `conexão entre "${source}" e o kanji "${target}"`,
    verb_conjugation: `conjugação de "${source}" (${target})`,
    verb_particle: `uso da partícula "${target}" com "${source}"`,
    vocab_context: `"${source}" no contexto de "${target}"`,
    grammar_grammar: `combinação de "${source}" com "${target}"`,
    kanji_word: `kanji "${source}" na palavra "${target}"`,
    audio_meaning: `identificação auditiva de "${source}"`,
    reading_meaning: `leitura de "${source}" como "${target}"`,
    formal_informal: `alternância formal/informal de "${source}"`,
    word_compound: `composto "${source}" + "${target}"`,
  }

  return `Precisão ${Math.round(accuracy)}% em ${typeDescriptions[type] || `${source} → ${target}`}`
}

export function getSmartExerciseSuggestions(): Array<{
  type: ConnectionType
  sourceId: string
  targetId: string
  reason: string
  priority: number
}> {
  const weakConnections = findWeakConnections()
  return weakConnections.slice(0, 5).map((conn) => ({
    type: conn.connectionType,
    sourceId: conn.sourceId,
    targetId: conn.targetId,
    reason: `Conexão fraca (${conn.strength}%) — precisa de prática`,
    priority: 100 - conn.strength,
  }))
}

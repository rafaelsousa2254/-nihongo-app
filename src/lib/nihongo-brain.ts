export type ConnectionType =
  | 'word_kanji'
  | 'verb_conjugation'
  | 'verb_particle'
  | 'vocab_context'
  | 'grammar_grammar'
  | 'kanji_word'
  | 'audio_meaning'
  | 'reading_meaning'
  | 'formal_informal'
  | 'word_compound'

export interface KnowledgeConnection {
  id: string
  sourceId: string
  sourceType: string
  targetId: string
  targetType: string
  connectionType: ConnectionType
  strength: number
  correctCount: number
  incorrectCount: number
  lastTestedAt: string | null
  createdAt: string
}

export interface ConnectionStrength {
  connectionId: string
  strength: number
  level: 'weak' | 'developing' | 'solid' | 'strong' | 'mastered'
  needsReview: boolean
}

const STORAGE_KEY = 'nihongo_brain'
const MAX_CONNECTIONS = 500
const STRENGTH_DECAY_PER_DAY = 1.5
const MIN_STRENGTH = 0
const MAX_STRENGTH = 100

function getStoredConnections(): KnowledgeConnection[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredConnections(connections: KnowledgeConnection[]) {
  if (typeof window === 'undefined') return
  const trimmed = connections.slice(-MAX_CONNECTIONS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

function generateConnectionId(sourceId: string, targetId: string, type: ConnectionType): string {
  return `${sourceId}__${targetId}__${type}`.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 120)
}

export function getOrCreateConnection(
  sourceId: string,
  sourceType: string,
  targetId: string,
  targetType: string,
  connectionType: ConnectionType
): KnowledgeConnection {
  const connections = getStoredConnections()
  const id = generateConnectionId(sourceId, targetId, connectionType)
  const existing = connections.find((c) => c.id === id)

  if (existing) return existing

  const newConnection: KnowledgeConnection = {
    id,
    sourceId,
    sourceType,
    targetId,
    targetType,
    connectionType,
    strength: 10,
    correctCount: 0,
    incorrectCount: 0,
    lastTestedAt: null,
    createdAt: new Date().toISOString(),
  }

  connections.push(newConnection)
  saveStoredConnections(connections)
  return newConnection
}

export function recordConnectionAttempt(
  connectionId: string,
  correct: boolean
): KnowledgeConnection | null {
  const connections = getStoredConnections()
  const conn = connections.find((c) => c.id === connectionId)
  if (!conn) return null

  if (correct) {
    conn.correctCount += 1
    const bonus = conn.strength < 30 ? 8 : conn.strength < 60 ? 5 : 3
    conn.strength = Math.min(MAX_STRENGTH, conn.strength + bonus)
  } else {
    conn.incorrectCount += 1
    conn.strength = Math.max(MIN_STRENGTH, conn.strength - 10)
  }

  conn.lastTestedAt = new Date().toISOString()
  saveStoredConnections(connections)
  return conn
}

export function getConnectionStrength(connectionId: string): ConnectionStrength {
  const connections = getStoredConnections()
  const conn = connections.find((c) => c.id === connectionId)

  if (!conn) {
    return { connectionId, strength: 0, level: 'weak', needsReview: true }
  }

  let effectiveStrength = conn.strength

  if (conn.lastTestedAt) {
    const daysSinceTest = (Date.now() - new Date(conn.lastTestedAt).getTime()) / (1000 * 60 * 60 * 24)
    effectiveStrength = Math.max(0, effectiveStrength - daysSinceTest * STRENGTH_DECAY_PER_DAY)
  }

  const level = getStrengthLevel(effectiveStrength)
  const needsReview = effectiveStrength < 30 || (conn.incorrectCount > conn.correctCount && conn.correctCount + conn.incorrectCount >= 3)

  return { connectionId, strength: Math.round(effectiveStrength), level, needsReview }
}

function getStrengthLevel(strength: number): ConnectionStrength['level'] {
  if (strength >= 85) return 'mastered'
  if (strength >= 65) return 'strong'
  if (strength >= 45) return 'solid'
  if (strength >= 25) return 'developing'
  return 'weak'
}

export function findWeakConnections(contentId?: string): KnowledgeConnection[] {
  const connections = getStoredConnections()
  let filtered = connections

  if (contentId) {
    filtered = connections.filter(
      (c) => c.sourceId === contentId || c.targetId === contentId
    )
  }

  return filtered
    .filter((c) => {
      const total = c.correctCount + c.incorrectCount
      if (total === 0) return true
      const accuracy = c.correctCount / total
      return accuracy < 0.6 || c.strength < 35
    })
    .sort((a, b) => a.strength - b.strength)
}

export function findStrongConnections(contentId?: string): KnowledgeConnection[] {
  const connections = getStoredConnections()
  let filtered = connections

  if (contentId) {
    filtered = connections.filter(
      (c) => c.sourceId === contentId || c.targetId === contentId
    )
  }

  return filtered
    .filter((c) => c.strength >= 65 && c.correctCount >= 3)
    .sort((a, b) => b.strength - a.strength)
}

export function getConnectionsForContent(contentId: string): KnowledgeConnection[] {
  return getStoredConnections().filter(
    (c) => c.sourceId === contentId || c.targetId === contentId
  )
}

export function getGraphData(contentIds: string[]): {
  nodes: Array<{ id: string; type: string; strength: number; level: string }>
  edges: Array<{ source: string; target: string; type: ConnectionType; strength: number }>
} {
  const connections = getStoredConnections()
  const nodeMap = new Map<string, { id: string; type: string; strength: number; level: string }>()
  const edges: Array<{ source: string; target: string; type: ConnectionType; strength: number }> = []

  for (const conn of connections) {
    if (!contentIds.includes(conn.sourceId) && !contentIds.includes(conn.targetId)) continue

    if (!nodeMap.has(conn.sourceId)) {
      nodeMap.set(conn.sourceId, {
        id: conn.sourceId,
        type: conn.sourceType,
        strength: conn.strength,
        level: getStrengthLevel(conn.strength),
      })
    }

    if (!nodeMap.has(conn.targetId)) {
      nodeMap.set(conn.targetId, {
        id: conn.targetId,
        type: conn.targetType,
        strength: conn.strength,
        level: getStrengthLevel(conn.strength),
      })
    }

    edges.push({
      source: conn.sourceId,
      target: conn.targetId,
      type: conn.connectionType,
      strength: conn.strength,
    })
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  }
}

export function getConnectionStats(): {
  total: number
  weak: number
  developing: number
  solid: number
  strong: number
  mastered: number
  needsReview: number
} {
  const connections = getStoredConnections()
  const stats = { total: 0, weak: 0, developing: 0, solid: 0, strong: 0, mastered: 0, needsReview: 0 }

  for (const conn of connections) {
    const { level, needsReview } = getConnectionStrength(conn.id)
    stats.total += 1
    stats[level] += 1
    if (needsReview) stats.needsReview += 1
  }

  return stats
}

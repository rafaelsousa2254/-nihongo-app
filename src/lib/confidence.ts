import { recordPerformance } from './performance'

export type ConfidenceLevel = 'chuted' | 'low' | 'medium' | 'high'

export interface ConfidenceRecord {
  contentId: string
  contentType: string
  exerciseType: string
  correct: boolean
  confidence: ConfidenceLevel
  responseTimeMs: number
  timestamp: string
}

const STORAGE_KEY = 'nihongo_confidence'

function getStoredConfidence(): ConfidenceRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredConfidence(records: ConfidenceRecord[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-500)))
}

export function recordConfidence(
  contentId: string,
  contentType: string,
  exerciseType: string,
  correct: boolean,
  confidence: ConfidenceLevel,
  responseTimeMs: number
): void {
  const record: ConfidenceRecord = {
    contentId,
    contentType,
    exerciseType,
    correct,
    confidence,
    responseTimeMs,
    timestamp: new Date().toISOString(),
  }

  const records = getStoredConfidence()
  records.push(record)
  saveStoredConfidence(records)
}

export function getConfidenceDistribution(contentId?: string): {
  chuted: { correct: number; incorrect: number }
  low: { correct: number; incorrect: number }
  medium: { correct: number; incorrect: number }
  high: { correct: number; incorrect: number }
} {
  const records = getStoredConfidence()
  const filtered = contentId ? records.filter((r) => r.contentId === contentId) : records

  const dist = {
    chuted: { correct: 0, incorrect: 0 },
    low: { correct: 0, incorrect: 0 },
    medium: { correct: 0, incorrect: 0 },
    high: { correct: 0, incorrect: 0 },
  }

  for (const r of filtered) {
    if (r.correct) {
      dist[r.confidence].correct += 1
    } else {
      dist[r.confidence].incorrect += 1
    }
  }

  return dist
}

export function detectHighConfidenceErrors(): Array<{
  contentId: string
  contentType: string
  errorCount: number
  averageResponseTime: number
  severity: 'warning' | 'critical'
}> {
  const records = getStoredConfidence()
  const highConfErrors = records.filter((r) => r.confidence === 'high' && !r.correct)

  const byContent = new Map<string, ConfidenceRecord[]>()
  for (const r of highConfErrors) {
    const key = `${r.contentType}_${r.contentId}`
    if (!byContent.has(key)) byContent.set(key, [])
    byContent.get(key)!.push(r)
  }

  return Array.from(byContent.entries())
    .map(([key, recs]) => {
      const [contentType, contentId] = key.split('_')
      const avgTime = recs.reduce((s, r) => s + r.responseTimeMs, 0) / recs.length
      return {
        contentId,
        contentType,
        errorCount: recs.length,
        averageResponseTime: avgTime,
        severity: recs.length >= 3 ? ('critical' as const) : ('warning' as const),
      }
    })
    .filter((item) => item.errorCount >= 2)
    .sort((a, b) => b.errorCount - a.errorCount)
}

export function getConfidenceAccuracy(): {
  chuted: number
  low: number
  medium: number
  high: number
} {
  const dist = getConfidenceDistribution()
  return {
    chuted: dist.chuted.correct + dist.chuted.incorrect > 0
      ? (dist.chuted.correct / (dist.chuted.correct + dist.chuted.incorrect)) * 100
      : 0,
    low: dist.low.correct + dist.low.incorrect > 0
      ? (dist.low.correct / (dist.low.correct + dist.low.incorrect)) * 100
      : 0,
    medium: dist.medium.correct + dist.medium.incorrect > 0
      ? (dist.medium.correct / (dist.medium.correct + dist.medium.incorrect)) * 100
      : 0,
    high: dist.high.correct + dist.high.incorrect > 0
      ? (dist.high.correct / (dist.high.correct + dist.high.incorrect)) * 100
      : 0,
  }
}

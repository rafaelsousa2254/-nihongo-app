import { recordPerformance, type PerformanceEntry } from './performance'

export interface RecallResult {
  contentId: string
  contentType: string
  recalledWithoutHint: boolean
  recallAccuracy: 'perfect' | 'partial' | 'incorrect' | 'no_recall'
  timestamp: string
}

const STORAGE_KEY = 'nihongo_recall'

function getStoredRecalls(): RecallResult[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredRecalls(recalls: RecallResult[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recalls.slice(-500)))
}

export function recordRecall(
  contentId: string,
  contentType: string,
  recalledWithoutHint: boolean,
  accuracy: RecallResult['recallAccuracy']
): RecallResult {
  const result: RecallResult = {
    contentId,
    contentType,
    recalledWithoutHint,
    recallAccuracy: accuracy,
    timestamp: new Date().toISOString(),
  }

  const recalls = getStoredRecalls()
  recalls.push(result)
  saveStoredRecalls(recalls)
  return result
}

export function getRecallRate(contentId: string, days: number = 30): number {
  const recalls = getStoredRecalls().filter(
    (r) => r.contentId === contentId &&
      Date.now() - new Date(r.timestamp).getTime() < days * 24 * 60 * 60 * 1000
  )

  if (recalls.length === 0) return -1
  const successCount = recalls.filter((r) => r.recalledWithoutHint).length
  return (successCount / recalls.length) * 100
}

export function getRecallStats(): {
  totalAttempts: number
  successRate: number
  perfectRate: number
  contentNeedingReview: string[]
} {
  const recalls = getStoredRecalls()
  const total = recalls.length
  if (total === 0) return { totalAttempts: 0, successRate: 0, perfectRate: 0, contentNeedingReview: [] }

  const successCount = recalls.filter((r) => r.recalledWithoutHint).length
  const perfectCount = recalls.filter((r) => r.recallAccuracy === 'perfect').length

  const contentFailures = new Map<string, number>()
  for (const r of recalls) {
    if (!r.recalledWithoutHint) {
      contentFailures.set(r.contentId, (contentFailures.get(r.contentId) || 0) + 1)
    }
  }

  const contentNeedingReview = Array.from(contentFailures.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)

  return {
    totalAttempts: total,
    successRate: (successCount / total) * 100,
    perfectRate: (perfectCount / total) * 100,
    contentNeedingReview,
  }
}

export function isRecallTracked(contentId: string): boolean {
  const recalls = getStoredRecalls()
  return recalls.some((r) => r.contentId === contentId)
}

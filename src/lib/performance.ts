export interface ErrorRecord {
  id: string
  contentType: string
  contentId: string
  category: string
  question: string
  givenAnswer: string
  correctAnswer: string
  timestamp: string
  occurrenceCount: number
  severity: 'isolated' | 'recurring' | 'weakness' | 'critical_weakness'
  context?: string
}

export type ExerciseType =
  | 'multiple_choice'
  | 'text_input'
  | 'ordering'
  | 'matching'
  | 'speaking'
  | 'listening'
  | 'transformation'
  | 'reconstruction'
  | 'fill_blank'
  | 'free_production'
  | 'recall'
  | 'analysis'

export type InputMode = 'tap' | 'type' | 'speak' | 'drag' | 'select'

export interface PerformanceEntry {
  contentType: string
  contentId: string
  correct: boolean
  quality: number
  responseTimeMs?: number
  timestamp: string
  exerciseType?: ExerciseType
  inputMode?: InputMode
  hintCount?: number
  confidence?: number
  attemptCount?: number
  connectionIds?: string[]
  relatedContentIds?: string[]
  illusionScore?: number
}

export interface SkillStats {
  correct: number
  incorrect: number
  total: number
  accuracy: number
  recentAccuracy: number
  streak: number
  maxStreak: number
  avgResponseTime: number
}

const STORAGE_KEY_ERRORS = 'nihongo_errors'
const STORAGE_KEY_PERFORMANCE = 'nihongo_performance'
const MAX_ERRORS_PER_CONTENT = 5
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function generateErrorId(contentType: string, contentId: string, givenAnswer: string, correctAnswer: string): string {
  return `${contentType}_${contentId}_${givenAnswer}_${correctAnswer}`.replace(/[^a-zA-Z0-9_]/g, '_')
}

function getStoredErrors(): ErrorRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ERRORS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredErrors(errors: ErrorRecord[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_ERRORS, JSON.stringify(errors))
}

function getStoredPerformance(): PerformanceEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PERFORMANCE)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredPerformance(entries: PerformanceEntry[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_PERFORMANCE, JSON.stringify(entries.slice(-1000)))
}

export function recordError(
  contentType: string,
  contentId: string,
  category: string,
  question: string,
  givenAnswer: string,
  correctAnswer: string,
  context?: string
): ErrorRecord | null {
  const errors = getStoredErrors()
  const errorId = generateErrorId(contentType, contentId, givenAnswer, correctAnswer)
  const existing = errors.find((e) => e.id === errorId)

  if (existing) {
    existing.occurrenceCount += 1
    existing.timestamp = new Date().toISOString()
    existing.severity = getSeverity(existing.occurrenceCount, existing.timestamp)
    saveStoredErrors(errors)
    return existing
  }

  const contentErrors = errors.filter((e) => e.contentType === contentType && e.contentId === contentId)
  if (contentErrors.length >= MAX_ERRORS_PER_CONTENT) {
    const oldest = contentErrors.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0]
    const idx = errors.indexOf(oldest)
    if (idx !== -1) errors.splice(idx, 1)
  }

  const newError: ErrorRecord = {
    id: errorId,
    contentType,
    contentId,
    category,
    question,
    givenAnswer,
    correctAnswer,
    timestamp: new Date().toISOString(),
    occurrenceCount: 1,
    severity: 'isolated',
    context,
  }

  errors.push(newError)
  saveStoredErrors(errors)
  return newError
}

export function recordPerformance(entry: Omit<PerformanceEntry, 'timestamp'>): PerformanceEntry {
  const fullEntry: PerformanceEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  }

  const entries = getStoredPerformance()
  entries.push(fullEntry)
  saveStoredPerformance(entries)
  return fullEntry
}

function getSeverity(occurrenceCount: number, lastTimestamp: string): ErrorRecord['severity'] {
  const daysSinceLast = (Date.now() - new Date(lastTimestamp).getTime()) / (1000 * 60 * 60 * 24)

  if (occurrenceCount >= 5 && daysSinceLast < 14) return 'critical_weakness'
  if (occurrenceCount >= 3) return 'weakness'
  if (occurrenceCount >= 2) return 'recurring'
  return 'isolated'
}

export function getErrors(contentType?: string): ErrorRecord[] {
  const errors = getStoredErrors()
  if (contentType) return errors.filter((e) => e.contentType === contentType)
  return errors
}

export function getSkillStats(contentType: string): SkillStats {
  const entries = getStoredPerformance().filter((e) => e.contentType === contentType)
  const total = entries.length
  const correct = entries.filter((e) => e.correct).length
  const incorrect = total - correct

  const recentEntries = entries.filter(
    (e) => Date.now() - new Date(e.timestamp).getTime() < RECENT_WINDOW_MS
  )
  const recentCorrect = recentEntries.filter((e) => e.correct).length
  const recentAccuracy = recentEntries.length > 0 ? (recentCorrect / recentEntries.length) * 100 : 0

  let streak = 0
  let maxStreak = 0
  let currentStreak = 0
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].correct) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  streak = currentStreak

  const responseTimes = entries.filter((e) => e.responseTimeMs).map((e) => e.responseTimeMs!)
  const avgResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0

  return {
    correct,
    incorrect,
    total,
    accuracy: total > 0 ? (correct / total) * 100 : 0,
    recentAccuracy,
    streak,
    maxStreak,
    avgResponseTime,
  }
}

export function getContentErrors(contentType: string, contentId: string): ErrorRecord[] {
  return getStoredErrors().filter(
    (e) => e.contentType === contentType && e.contentId === contentId
  )
}

export function getRecurringErrors(): ErrorRecord[] {
  return getStoredErrors().filter(
    (e) => e.severity === 'recurring' || e.severity === 'critical_weakness'
  )
}

export function clearErrorsForContent(contentType: string, contentId: string) {
  const errors = getStoredErrors()
  const filtered = errors.filter(
    (e) => !(e.contentType === contentType && e.contentId === contentId)
  )
  saveStoredErrors(filtered)
}

export function clearAllErrors() {
  saveStoredErrors([])
}

export function getAllPerformanceByCategory(): Record<string, SkillStats> {
  const categories = ['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar', 'listening', 'pronunciation', 'conversation']
  const stats: Record<string, SkillStats> = {}
  for (const cat of categories) {
    stats[cat] = getSkillStats(cat)
  }
  return stats
}

const STORAGE_KEY = 'nihongo_study_history'
const MAX_HISTORY = 365

export interface DayRecord {
  date: string
  xpEarned: number
  itemsStudied: number
  minutesStudied: number
  correctAnswers: number
  totalAnswers: number
  streak: number
  categories: string[]
}

function getStoredHistory(): DayRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredHistory(records: DayRecord[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_HISTORY)))
}

export function recordStudyDay(data: {
  xpEarned: number
  itemsStudied: number
  minutesStudied: number
  correctAnswers: number
  totalAnswers: number
  streak: number
  categories: string[]
}) {
  const today = new Date().toISOString().split('T')[0]
  const history = getStoredHistory()
  const existing = history.find((r) => r.date === today)

  if (existing) {
    existing.xpEarned += data.xpEarned
    existing.itemsStudied += data.itemsStudied
    existing.minutesStudied += data.minutesStudied
    existing.correctAnswers += data.correctAnswers
    existing.totalAnswers += data.totalAnswers
    existing.streak = data.streak
    existing.categories = [...new Set([...existing.categories, ...data.categories])]
  } else {
    history.push({
      date: today,
      xpEarned: data.xpEarned,
      itemsStudied: data.itemsStudied,
      minutesStudied: data.minutesStudied,
      correctAnswers: data.correctAnswers,
      totalAnswers: data.totalAnswers,
      streak: data.streak,
      categories: data.categories,
    })
  }

  saveStoredHistory(history)
}

export function getStudyHistory(days?: number): DayRecord[] {
  const history = getStoredHistory()
  if (!days) return history
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
  return history.filter((r) => r.date >= cutoff)
}

export function getWeeklyStats(): {
  totalXp: number
  totalMinutes: number
  totalItems: number
  avgAccuracy: number
  daysStudied: number
  currentStreak: number
  bestStreak: number
  dailyData: DayRecord[]
} {
  const week = getStudyHistory(7)
  const totalXp = week.reduce((s, d) => s + d.xpEarned, 0)
  const totalMinutes = week.reduce((s, d) => s + d.minutesStudied, 0)
  const totalItems = week.reduce((s, d) => s + d.itemsStudied, 0)
  const totalCorrect = week.reduce((s, d) => s + d.correctAnswers, 0)
  const totalAnswers = week.reduce((s, d) => s + d.totalAnswers, 0)
  const avgAccuracy = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0
  const daysStudied = week.filter((d) => d.itemsStudied > 0).length
  const currentStreak = week.length > 0 ? week[week.length - 1].streak : 0
  const bestStreak = Math.max(...week.map((d) => d.streak), 0)

  return {
    totalXp,
    totalMinutes,
    totalItems,
    avgAccuracy,
    daysStudied,
    currentStreak,
    bestStreak,
    dailyData: week,
  }
}

export function getMonthlyChart(): { date: string; xp: number; minutes: number; accuracy: number }[] {
  const month = getStudyHistory(30)
  return month.map((d) => ({
    date: d.date.slice(5),
    xp: d.xpEarned,
    minutes: d.minutesStudied,
    accuracy: d.totalAnswers > 0 ? (d.correctAnswers / d.totalAnswers) * 100 : 0,
  }))
}

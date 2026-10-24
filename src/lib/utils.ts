import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('pt-BR').format(n)
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function getXpForLevel(level: number): number {
  return (level - 1) * 100
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function calculateStreak(lastStudyDate?: string, currentStreak?: number): number {
  if (!lastStudyDate) return 0

  const last = new Date(lastStudyDate)
  const now = new Date()

  const diffTime = now.getTime() - last.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return currentStreak || 1
  if (diffDays === 1) return (currentStreak || 0) + 1
  return 0
}

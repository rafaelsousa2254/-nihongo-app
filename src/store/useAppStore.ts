import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserProgress, Flashcard, StudySession, Achievement } from '@/types'
import { ACHIEVEMENTS } from '@/lib/constants'
import { getLevelFromXp } from '@/lib/utils'

interface AuthSlice {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

interface StudySlice {
  currentModule: string
  currentLesson: string
  progress: UserProgress[]
  flashcards: Flashcard[]
  sessions: StudySession[]
  setCurrentModule: (module: string) => void
  setCurrentLesson: (lesson: string) => void
  addProgress: (progress: UserProgress) => void
  addFlashcard: (flashcard: Flashcard) => void
  addSession: (session: StudySession) => void
}

interface GamificationSlice {
  xp: number
  level: number
  coins: number
  streak: number
  lastStudyDate: string | null
  achievements: Achievement[]
  totalStudyMinutes: number
  addXp: (amount: number) => void
  addCoins: (amount: number) => void
  incrementStreak: () => void
  unlockAchievement: (achievementId: string) => void
  checkAchievements: (stats: Record<string, number>) => void
}

interface SettingsSlice {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  currentPath: string
  language: string
  notifications: boolean
  reminder: boolean
  reminderTime: string
  audioEnabled: boolean
  autoPlay: boolean
  difficulty: string
  toggleTheme: () => void
  toggleSidebar: () => void
  setCurrentPath: (path: string) => void
  setLanguage: (lang: string) => void
  setNotifications: (value: boolean) => void
  setReminder: (value: boolean) => void
  setReminderTime: (value: string) => void
  setAudioEnabled: (value: boolean) => void
  setAutoPlay: (value: boolean) => void
  setDifficulty: (value: string) => void
}

type AppStore = AuthSlice & StudySlice & GamificationSlice & SettingsSlice

const createAuthSlice: StateCreator<AppStore, [], [], AuthSlice> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  setUser: (user) => set({ user }),
})

const createStudySlice: StateCreator<AppStore, [], [], StudySlice> = (set) => ({
  currentModule: '',
  currentLesson: '',
  progress: [],
  flashcards: [],
  sessions: [],
  setCurrentModule: (module) => set({ currentModule: module }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  addProgress: (progress) =>
    set((state) => ({ progress: [...state.progress, progress] })),
  addFlashcard: (flashcard) =>
    set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
})

const createGamificationSlice: StateCreator<AppStore, [], [], GamificationSlice> = (set) => ({
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount
      const newLevel = getLevelFromXp(newXp)
      return { xp: newXp, level: newLevel }
    }),
  addCoins: (amount) =>
    set((state) => ({ coins: state.coins + amount })),
  incrementStreak: () =>
    set((state) => {
      const today = new Date().toDateString()
      if (state.lastStudyDate === today) return state
      return { streak: state.streak + 1, lastStudyDate: today }
    }),
  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ),
    })),
  checkAchievements: (stats) =>
    set((state) => ({
      achievements: state.achievements.map((a) => {
        if (a.unlocked) return a
        const stat = stats[a.category]
        if (stat && stat >= a.requirement) {
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
        }
        return a
      }),
    })),
})

const createSettingsSlice: StateCreator<AppStore, [], [], SettingsSlice> = (set) => ({
  theme: 'dark',
  sidebarOpen: true,
  currentPath: '/',
  language: 'pt-BR',
  notifications: true,
  reminder: true,
  reminderTime: '19:00',
  audioEnabled: true,
  autoPlay: true,
  difficulty: 'intermediario',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentPath: (path) => set({ currentPath: path }),
  setLanguage: (lang) => set({ language: lang }),
  setNotifications: (value) => set({ notifications: value }),
  setReminder: (value) => set({ reminder: value }),
  setReminderTime: (value) => set({ reminderTime: value }),
  setAudioEnabled: (value) => set({ audioEnabled: value }),
  setAutoPlay: (value) => set({ autoPlay: value }),
  setDifficulty: (value) => set({ difficulty: value }),
})

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createStudySlice(...a),
      ...createGamificationSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: 'nihongo-journey-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        achievements: state.achievements,
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        reminder: state.reminder,
        reminderTime: state.reminderTime,
        audioEnabled: state.audioEnabled,
        autoPlay: state.autoPlay,
        difficulty: state.difficulty,
        progress: state.progress,
        flashcards: state.flashcards,
      }),
    }
  )
)

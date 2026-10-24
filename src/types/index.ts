export interface User {
  id: string
  name: string
  avatar?: string
  level: number
  xp: number
  coins: number
  streak: number
  lastStudyDate?: string
  totalStudyMinutes: number
}

export interface HiraganaChar {
  id: string
  character: string
  romanization: string
  audio: string
  group: 'basic' | 'dakuten' | 'handakuten' | 'combo'
  strokes: number
}

export interface KatakanaChar {
  id: string
  character: string
  romanization: string
  audio: string
  group: 'basic' | 'dakuten' | 'handakuten' | 'combo'
  strokes: number
}

export interface KanjiChar {
  id: string
  character: string
  meanings: string[]
  onyomi: string[]
  kunyomi: string[]
  strokes: number
  jlptLevel: string
  examples: { word: string; reading: string; meaning: string }[]
  radicals: string[]
}

export interface VocabularyWord {
  id: string
  word: string
  reading: string
  meaning: string
  jlptLevel: string
  partOfSpeech: string
  examples: { japanese: string; portuguese: string }[]
}

export interface GrammarPattern {
  id: string
  pattern: string
  meaning: string
  level: string
  explanation: string
  examples: { japanese: string; portuguese: string; notes: string }[]
}

export interface UserProgress {
  id: string
  contentType: string
  contentId: string
  level: number
  nextReview: string
  easeFactor: number
  interval: number
  repetitions: number
  correctCount: number
  incorrectCount: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement: number
  xpReward: number
  unlocked?: boolean
  unlockedAt?: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  reading?: string
  example?: string
  progress?: UserProgress
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StudySession {
  startTime: Date
  contentType: string
  itemsStudied: number
  correctAnswers: number
}

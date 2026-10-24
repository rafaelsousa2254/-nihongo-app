'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

type FocusMode = 'flashcards' | 'reading' | 'listening' | 'kanji'

export default function FocusModePage() {
  const { user } = useAppStore()
  const [mode, setMode] = useState<FocusMode | null>(null)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [darkOverlay, setDarkOverlay] = useState(true)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((t) => t - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setIsRunning(false)
      if (!isBreak) {
        setSessionsCompleted((s) => s + 1)
        setPomodoroTime(5 * 60)
        setIsBreak(true)
      } else {
        setPomodoroTime(25 * 60)
        setIsBreak(false)
      }
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isRunning, pomodoroTime, isBreak])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => setIsRunning(!isRunning)
  const resetTimer = () => {
    setIsRunning(false)
    setPomodoroTime(isBreak ? 5 * 60 : 25 * 60)
    setIsBreak(false)
  }

  if (!mode) {
    return (
      <div className={`min-h-screen ${darkOverlay ? 'bg-black' : 'bg-[var(--bg-primary)]'} flex flex-col items-center justify-center p-6 transition-colors`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🎯 Modo Foco</h1>
            <p className="text-[var(--text-secondary)]">Tela limpa, sem distrações. Foque no estudo.</p>
          </div>

          <div className="space-y-3">
            {([
              { id: 'flashcards' as FocusMode, icon: '🃏', label: 'Flashcards', desc: 'Revisão espaçada' },
              { id: 'reading' as FocusMode, icon: '📖', label: 'Leitura', desc: 'Leia japonês focado' },
              { id: 'listening' as FocusMode, icon: '🎧', label: 'Escuta', desc: 'Ouça áudio repetidamente' },
              { id: 'kanji' as FocusMode, icon: '漢', label: 'Kanji', desc: 'Pratique kanji um por vez' },
            ]).map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="w-full glass rounded-xl p-5 text-left hover:bg-[var(--bg-tertiary)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{m.label}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{m.desc}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setDarkOverlay(!darkOverlay)}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            {darkOverlay ? '☀️ Modo Claro' : '🌙 Fundo Escuro'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkOverlay ? 'bg-black' : 'bg-[var(--bg-primary)]'} flex flex-col transition-colors`}>
      {/* Top bar - minimal */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => { setMode(null); setIsRunning(false) }}
          className="text-[var(--text-secondary)] hover:text-white text-sm transition-colors"
        >
          ← Sair
        </button>

        {/* Pomodoro */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              isBreak
                ? 'bg-[var(--success)]/20 text-[var(--success)]'
                : isRunning
                ? 'bg-[var(--danger)]/20 text-[var(--danger)]'
                : 'bg-[var(--accent)]/20 text-[var(--accent)]'
            }`}
          >
            {isRunning ? '⏸' : '▶'} {formatTime(pomodoroTime)}
          </button>
          <button onClick={resetTimer} className="text-[var(--text-secondary)] hover:text-white text-xs">
            ↺
          </button>
          <span className="text-xs text-[var(--text-secondary)]">
            {isBreak ? '☕ Pausa' : '📚 Estudando'} • {sessionsCompleted} sessões
          </span>
        </div>
      </div>

      {/* Content area - centered, minimal */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {mode === 'flashcards' && (
            <div className="space-y-6">
              <p className="text-6xl text-white mb-4">🃏</p>
              <p className="text-2xl text-white font-bold">Flashcards</p>
              <p className="text-[var(--text-secondary)]">Use o modo convencional para revisar</p>
              <a href="/flashcards" className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
                Abrir Flashcards →
              </a>
            </div>
          )}
          {mode === 'reading' && (
            <div className="space-y-6">
              <p className="text-6xl text-white mb-4">📖</p>
              <p className="text-2xl text-white font-bold">Leitura Focada</p>
              <p className="text-[var(--text-secondary)]">Pratique leitura sem distrações</p>
              <a href="/activities/immersion" className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
                Abrir Imersão →
              </a>
            </div>
          )}
          {mode === 'listening' && (
            <div className="space-y-6">
              <p className="text-6xl text-white mb-4">🎧</p>
              <p className="text-2xl text-white font-bold">Escuta Focada</p>
              <p className="text-[var(--text-secondary)]">Ouça e repita sem distrações</p>
              <a href="/practice/listening" className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
                Abrir Escuta →
              </a>
            </div>
          )}
          {mode === 'kanji' && (
            <div className="space-y-6">
              <p className="text-6xl text-white mb-4">漢</p>
              <p className="text-2xl text-white font-bold">Kanji Focado</p>
              <p className="text-[var(--text-secondary)]">Pratique kanji um por vez</p>
              <a href="/kanji-dna" className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
                Abrir Kanji DNA →
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom - minimal progress */}
      <div className="p-4 flex justify-center">
        <div className="flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < sessionsCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

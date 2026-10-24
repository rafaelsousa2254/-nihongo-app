'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { createSurvivalState, generateSurvivalQuestion, processSurvivalAnswer, getSurvivalLevels, type SurvivalState, type SurvivalQuestion } from '@/lib/survival'
import { recordError } from '@/lib/performance'

export default function SurvivalPage() {
  const { level, addXp, addCoins } = useAppStore()
  const [state, setState] = useState<SurvivalState | null>(null)
  const [question, setQuestion] = useState<SurvivalQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = useCallback(() => {
    const newState = createSurvivalState()
    setState(newState)
    setStarted(true)
    setSelectedAnswer('')
    setShowResult(false)
    const q = generateSurvivalQuestion(0)
    setQuestion(q)
  }, [])

  useEffect(() => {
    if (!started || !state?.isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev || !prev.isPlaying) return prev
        const newTime = prev.timeRemaining - 1
        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0, isPlaying: false, isGameOver: true }
        }
        return { ...prev, timeRemaining: newTime }
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [started, state?.isPlaying])

  const handleAnswer = useCallback((answer: string) => {
    if (!state || !question || showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer.toLowerCase().trim() !== question.correctAnswer.toLowerCase().trim()) {
      recordError(question.category, question.category, question.category, question.question, answer, question.correctAnswer)
    }

    setTimeout(() => {
      const newState = processSurvivalAnswer(state, answer, question)
      setState(newState)
      setSelectedAnswer('')
      setShowResult(false)

      if (newState.isPlaying) {
        const nextQ = generateSurvivalQuestion(newState.level)
        setQuestion(nextQ)
      } else {
        addXp(newState.xpEarned)
        addCoins(newState.coinsEarned)
      }
    }, 1000)
  }, [state, question, showResult, addXp, addCoins])

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div className="glass rounded-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-4">⏱️</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Survival Mode</h1>
          <p className="text-[var(--text-secondary)] mb-6">Quanto tempo você aguenta? A dificuldade aumenta progressivamente!</p>
          <div className="space-y-2 mb-6 text-left">
            {getSurvivalLevels().map((lvl, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-primary)]">
                <span className="text-sm font-bold text-[var(--accent)] w-6">{i + 1}</span>
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{lvl.name}</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-2">({lvl.timeLimit}s por pergunta)</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
            🎮 Iniciar Survival
          </button>
        </motion.div>
      </div>
    )
  }

  if (!state) return null

  if (state.isGameOver) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div className="glass rounded-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Game Over!</h2>
          <p className="text-[var(--text-secondary)] mb-6">Nível alcançado: {getSurvivalLevels()[state.level]?.name || 'Máximo'}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[var(--bg-primary)] rounded-lg p-3">
              <div className="text-xl font-bold text-[var(--accent)]">{state.score}</div>
              <div className="text-xs text-[var(--text-secondary)]">Pontos</div>
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-3">
              <div className="text-xl font-bold text-[var(--warning)]">{state.xpEarned}</div>
              <div className="text-xs text-[var(--text-secondary)]">XP Ganho</div>
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-3">
              <div className="text-xl font-bold text-[var(--danger)]">{state.maxCombo}</div>
              <div className="text-xs text-[var(--text-secondary)]">Maior Combo</div>
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-3">
              <div className="text-xl font-bold text-[var(--text-primary)]">{state.record}</div>
              <div className="text-xs text-[var(--text-secondary)]">Recorde</div>
            </div>
          </div>
          {state.errors.length > 0 && (
            <div className="mb-6 text-left">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Erros para revisar:</h4>
              {state.errors.slice(0, 5).map((err, i) => (
                <div key={i} className="text-xs p-2 rounded bg-[var(--bg-primary)] mb-1">
                  <span className="text-[var(--danger)]">{err.question}</span>
                  <span className="text-[var(--text-secondary)]"> → {err.correctAnswer}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={startGame} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
            🔄 Jogar Novamente
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">Survival Mode</div>
            <div className="text-xs text-[var(--text-secondary)]">Nível {state.level + 1}: {getSurvivalLevels()[state.level]?.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-[var(--text-primary)]">{state.score} pts</div>
          <div className="text-xs text-[var(--text-secondary)]">Combo: {state.combo}x</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-secondary)]">Tempo</span>
            <span className={`text-xs font-bold ${state.timeRemaining <= 5 ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>
              {state.timeRemaining}s
            </span>
          </div>
          <div className="w-full h-4 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: state.timeRemaining <= 5 ? 'var(--danger)' : state.timeRemaining <= 10 ? 'var(--warning)' : 'var(--accent)' }}
              animate={{ width: `${(state.timeRemaining / getSurvivalLevels()[state.level].timeLimit) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {question && (
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="text-5xl font-bold text-[var(--text-primary)] mb-6">{question.question}</div>

            {question.options && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === question.correctAnswer
                  let bgClass = 'bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)]'
                  if (showResult) {
                    if (isCorrect) bgClass = 'bg-[var(--success)]/20 border-[var(--success)]'
                    else if (isSelected) bgClass = 'bg-[var(--danger)]/20 border-[var(--danger)]'
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`p-4 rounded-xl border border-transparent transition-all text-[var(--text-primary)] font-medium ${bgClass}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

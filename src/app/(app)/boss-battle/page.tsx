'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { generateBattleQuestions, createInitialState, processAnswer, BATTLE_PHASES, type BattleState, type BattleQuestion } from '@/lib/boss-battle'
import { recordError } from '@/lib/performance'

export default function BossBattlePage() {
  const { level, addXp, addCoins } = useAppStore()
  const [questions, setQuestions] = useState<BattleQuestion[]>([])
  const [state, setState] = useState<BattleState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started && questions.length > 0 && !state) {
      setState(createInitialState(questions))
    }
  }, [started, questions, state])

  const startBattle = useCallback(() => {
    const qs = generateBattleQuestions(level)
    setQuestions(qs)
    setState(null)
    setSelectedAnswer('')
    setShowResult(false)
    setStarted(true)
  }, [level])

  const handleAnswer = useCallback((answer: string) => {
    if (!state || showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)

    setTimeout(() => {
      const newState = processAnswer(state, answer, questions)
      setState(newState)
      setSelectedAnswer('')
      setShowResult(false)

      if (!newState.completed) return

      addXp(newState.xpEarned)
      addCoins(newState.coinsEarned)

      newState.errors.forEach((err) => {
        recordError(err.category, err.category, err.category, err.question, err.givenAnswer, err.correctAnswer)
      })
    }, 1200)
  }, [state, showResult, questions, addXp, addCoins])

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div className="glass rounded-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-4">👑</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Boss Battle</h1>
          <p className="text-[var(--text-secondary)] mb-6">Enfrente um desafio épico com 5 fases!</p>
          <div className="space-y-2 mb-6 text-left">
            {BATTLE_PHASES.map((phase, i) => (
              <div key={phase.name} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-primary)]">
                <span className="text-lg">{phase.icon}</span>
                <div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">Fase {i + 1}: {phase.name}</span>
                  <span className="text-xs text-[var(--text-secondary)] ml-2">({phase.questionCount} perguntas)</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={startBattle} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
            ⚔️ Iniciar Batalha
          </button>
        </motion.div>
      </div>
    )
  }

  if (!state) return null

  if (state.completed) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div className="glass rounded-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-6xl mb-4">{state.hp > 0 ? '🎉' : '💀'}</div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{state.hp > 0 ? 'Boss Derrotado!' : 'Game Over!'}</h2>
          <p className="text-[var(--text-secondary)] mb-6">Precisão: {state.questionsAnswered > 0 ? Math.round((state.questionsAnswered - state.errors.length) / state.questionsAnswered * 100) : 0}%</p>
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
              <div className="text-xl font-bold text-[var(--success)]">{state.coinsEarned}</div>
              <div className="text-xs text-[var(--text-secondary)]">Moedas</div>
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
          <button onClick={startBattle} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all">
            🔄 Jogar Novamente
          </button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[state.currentQuestion]
  const currentPhase = BATTLE_PHASES[currentQuestion?.phase || 0]
  const progress = ((state.currentQuestion) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">Boss Battle</div>
            <div className="text-xs text-[var(--text-secondary)]">Fase {(currentQuestion?.phase || 0) + 1}: {currentPhase?.name}</div>
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
            <span className="text-xs text-[var(--text-secondary)]">HP</span>
            <span className="text-xs text-[var(--danger)]">{state.hp}/{state.maxHp}</span>
          </div>
          <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: state.hp > 50 ? 'var(--success)' : state.hp > 25 ? 'var(--warning)' : 'var(--danger)' }}
              animate={{ width: `${state.hp}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {state.currentQuestion + 1}/{questions.length}
        </div>
      </div>

      <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
        <motion.div className="h-full bg-[var(--accent)] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">{currentQuestion.question}</div>
            <div className="text-sm text-[var(--text-secondary)] mb-6">
              {currentPhase?.icon} {currentPhase?.name}
            </div>

            {currentQuestion.options && (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correctAnswer
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

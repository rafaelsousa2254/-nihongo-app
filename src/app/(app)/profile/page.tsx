'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { getLeaderboardWithUser, formatTimeAgo, type Competitor } from '@/lib/competitive-quiz'
import { getWeeklyStats, getMonthlyChart, type DayRecord } from '@/lib/study-history'
import { MASTERY_COLORS, MASTERY_LABELS, MASTERY_ICONS, type MasteryLevel } from '@/lib/mastery'
import { detectAllIllusions, type IllusionScore } from '@/lib/illusion-detector'
import { getConfidenceDistribution } from '@/lib/confidence'

type TabType = 'stats' | 'achievements' | 'leaderboard' | 'history' | 'recognition'

const BADGE_RARITY: Record<string, { color: string; glow: string }> = {
  common: { color: '#94a3b8', glow: 'shadow-slate-500/20' },
  uncommon: { color: '#22c55e', glow: 'shadow-green-500/30' },
  rare: { color: '#0ea5e9', glow: 'shadow-blue-500/30' },
  epic: { color: '#8b5cf6', glow: 'shadow-purple-500/30' },
  legendary: { color: '#f59e0b', glow: 'shadow-yellow-500/40' },
}

function getAchievementRarity(index: number): string {
  if (index < 5) return 'common'
  if (index < 10) return 'uncommon'
  if (index < 15) return 'rare'
  if (index < 20) return 'epic'
  return 'legendary'
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('stats')
  const { user, xp, level, coins, streak, achievements, totalStudyMinutes } = useAppStore()
  const [leaderboard, setLeaderboard] = useState<Competitor[]>([])
  const [weeklyStats, setWeeklyStats] = useState<ReturnType<typeof getWeeklyStats> | null>(null)
  const [illusions, setIllusions] = useState<IllusionScore[]>([])
  const [confidenceDist, setConfidenceDist] = useState<Record<string, { correct: number; incorrect: number }>>({})

  const xpProgress = ((xp % 100) / 100) * 100
  const xpRemaining = 100 - (xp % 100)
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  useEffect(() => {
    setLeaderboard(getLeaderboardWithUser(xp, level, streak, user?.name || 'Você'))
    setWeeklyStats(getWeeklyStats())
    setIllusions(detectAllIllusions())
    setConfidenceDist(getConfidenceDistribution())
  }, [xp, level, streak, user?.name])

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'stats', label: 'Estatísticas', icon: '📊' },
    { id: 'achievements', label: 'Conquistas', icon: '🏆' },
    { id: 'leaderboard', label: 'Ranking', icon: '🥇' },
    { id: 'history', label: 'Histórico', icon: '📅' },
    { id: 'recognition', label: 'Reconhecimento vs Produção', icon: '🎯' },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="glass rounded-2xl p-6 flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-3xl font-bold text-white">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{user?.name || 'Estudante'}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-[#f59e0b]">⭐ Nível {level}</span>
            <span className="text-sm text-[#0ea5e9]">{xp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-2 bg-[#0f172a] rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="text-xs text-[#64748b] mt-1">{xpRemaining} XP para Nível {level + 1}</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Horas Estudadas', value: `${Math.floor((totalStudyMinutes || 0) / 60)}h`, icon: '⏱️', color: '#0ea5e9' },
          { label: 'Sequência', value: `${streak} dias`, icon: '🔥', color: '#ef4444' },
          { label: 'Moedas', value: coins.toString(), icon: '🪙', color: '#22c55e' },
          { label: 'Conquistas', value: `${unlockedAchievements.length}/${achievements.length}`, icon: '🏆', color: '#f59e0b' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[#94a3b8]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StatsTab weeklyStats={weeklyStats} />
          </motion.div>
        )}
        {activeTab === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AchievementsTab achievements={achievements} />
          </motion.div>
        )}
        {activeTab === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LeaderboardTab leaderboard={leaderboard} />
          </motion.div>
        )}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HistoryTab />
          </motion.div>
        )}
        {activeTab === 'recognition' && (
          <motion.div key="recognition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RecognitionTab illusions={illusions} confidenceDist={confidenceDist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatsTab({ weeklyStats }: { weeklyStats: ReturnType<typeof getWeeklyStats> | null }) {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">📊 Resumo da Semana</h3>
        {weeklyStats && weeklyStats.daysStudied > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#0f172a] rounded-lg">
              <div className="text-2xl font-bold text-[#0ea5e9]">{weeklyStats.totalXp}</div>
              <div className="text-xs text-[#94a3b8]">XP Ganho</div>
            </div>
            <div className="text-center p-3 bg-[#0f172a] rounded-lg">
              <div className="text-2xl font-bold text-[#22c55e]">{weeklyStats.totalMinutes}min</div>
              <div className="text-xs text-[#94a3b8]">Tempo Total</div>
            </div>
            <div className="text-center p-3 bg-[#0f172a] rounded-lg">
              <div className="text-2xl font-bold text-[#f59e0b]">{weeklyStats.totalItems}</div>
              <div className="text-xs text-[#94a3b8]">Itens Estudados</div>
            </div>
            <div className="text-center p-3 bg-[#0f172a] rounded-lg">
              <div className="text-2xl font-bold text-[#8b5cf6]">{Math.round(weeklyStats.avgAccuracy)}%</div>
              <div className="text-xs text-[#94a3b8]">Precisão Média</div>
            </div>
          </div>
        ) : (
          <p className="text-[#94a3b8] text-sm">Comece a estudar para ver estatísticas aqui!</p>
        )}
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">🔥 Sequência de Estudos</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const day = new Date(Date.now() - (6 - i) * 86400000)
            const dayStr = day.toISOString().split('T')[0]
            const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
            return (
              <div key={i} className="text-center">
                <div className="text-[10px] text-[#64748b] mb-1">{dayNames[day.getDay()]}</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  weeklyStats?.dailyData?.some((d) => d.date === dayStr)
                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                    : 'bg-[#0f172a] text-[#64748b]'
                }`}>
                  {weeklyStats?.dailyData?.some((d) => d.date === dayStr) ? '✓' : '·'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AchievementsTab({ achievements }: { achievements: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievements.map((a, i) => {
        const rarity = getAchievementRarity(i)
        const rarityStyle = BADGE_RARITY[rarity]
        return (
          <motion.div
            key={a.id}
            className={`glass rounded-xl p-4 ${!a.unlocked ? 'opacity-40' : ''} ${
              a.unlocked ? `shadow-lg ${rarityStyle.glow}` : ''
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            whileHover={a.unlocked ? { scale: 1.03, rotate: 2 } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">{a.icon}</div>
              {a.unlocked && (
                <motion.div
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: `${rarityStyle.color}20`, color: rarityStyle.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.03 + 0.2, type: 'spring' }}
                >
                  {rarity.toUpperCase()}
                </motion.div>
              )}
            </div>
            <div className="font-semibold text-white text-sm">{a.name}</div>
            <div className="text-xs text-[#94a3b8] mt-1">{a.description}</div>
            {a.unlocked && a.unlockedAt && (
              <motion.div
                className="text-xs text-[#22c55e] mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 + 0.3 }}
              >
                ✓ {new Date(a.unlockedAt).toLocaleDateString('pt-BR')}
              </motion.div>
            )}
            {!a.unlocked && (
              <div className="text-xs text-[#64748b] mt-2">🔒 Bloqueado</div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function LeaderboardTab({ leaderboard }: { leaderboard: Competitor[] }) {
  return (
    <div className="space-y-3">
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold text-white mb-4">🏆 Ranking Semanal</h3>
        <p className="text-xs text-[#94a3b8] mb-4">Competidores baseados em XP total</p>
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                entry.id === 'user'
                  ? 'bg-[#0ea5e9]/10 border border-[#0ea5e9]/30'
                  : 'bg-[#0f172a]'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? 'bg-yellow-500 text-black' :
                i === 1 ? 'bg-gray-300 text-black' :
                i === 2 ? 'bg-orange-600 text-white' :
                'bg-[#1e293b] text-[#94a3b8]'
              }`}>
                {i + 1}
              </div>
              <div className="text-xl">{entry.avatar}</div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${entry.id === 'user' ? 'text-[#0ea5e9]' : 'text-white'}`}>
                  {entry.name} {entry.id === 'user' && '(Você)'}
                </div>
                <div className="text-xs text-[#64748b]">
                  Nv.{entry.level} · 🔥{entry.streak} dias
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#f59e0b]">{entry.xp.toLocaleString()} XP</div>
                <div className="text-[10px] text-[#64748b]">{formatTimeAgo(entry.lastActive)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HistoryTab() {
  const [history, setHistory] = useState<DayRecord[]>([])

  useEffect(() => {
    const { getStudyHistory } = require('@/lib/study-history')
    setHistory(getStudyHistory(30))
  }, [])

  const totalXp = history.reduce((s, d) => s + d.xpEarned, 0)
  const totalMinutes = history.reduce((s, d) => s + d.minutesStudied, 0)
  const totalItems = history.reduce((s, d) => s + d.itemsStudied, 0)

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">📅 Histórico dos Últimos 30 Dias</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-[#0ea5e9]">{totalXp.toLocaleString()}</div>
            <div className="text-xs text-[#94a3b8]">XP Total</div>
          </div>
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-[#22c55e]">{Math.floor(totalMinutes / 60)}h</div>
            <div className="text-xs text-[#94a3b8]">Horas</div>
          </div>
          <div className="text-center p-3 bg-[#0f172a] rounded-lg">
            <div className="text-2xl font-bold text-[#f59e0b]">{totalItems}</div>
            <div className="text-xs text-[#94a3b8]">Itens</div>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length === 0 && (
            <p className="text-[#94a3b8] text-sm text-center py-4">Nenhum registro ainda</p>
          )}
          {history.reverse().map((day, i) => (
            <div key={day.date} className="flex items-center gap-3 p-2 rounded-lg bg-[#0f172a]">
              <div className="text-sm text-[#94a3b8] w-20">
                {new Date(day.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#0ea5e9]">⭐ {day.xpEarned} XP</span>
                  <span className="text-[#22c55e]">📝 {day.itemsStudied} itens</span>
                  <span className="text-[#f59e0b]">⏱️ {day.minutesStudied}min</span>
                </div>
                {day.totalAnswers > 0 && (
                  <div className="text-[10px] text-[#64748b] mt-1">
                    Precisão: {Math.round((day.correctAnswers / day.totalAnswers) * 100)}%
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {day.categories.map((cat) => (
                  <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecognitionTab({ illusions, confidenceDist }: {
  illusions: IllusionScore[]
  confidenceDist: Record<string, { correct: number; incorrect: number }>
}) {
  const illusionItems = illusions.filter((i) => i.isIllusion)
  const confidenceEntries = Object.entries(confidenceDist)

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">🎯 Reconhecimento vs Produção</h3>
        <p className="text-sm text-[#94a3b8] mb-4">
          Ilusão de maestria: quando você reconhece bem mas não consegue produzir sem ajuda.
        </p>
        {illusionItems.length === 0 ? (
          <div className="text-center py-6 text-[#94a3b8]">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm">Nenhuma ilusão detectada! Continue praticando.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {illusionItems.map((illusion, i) => (
              <motion.div
                key={`${illusion.contentType}-${illusion.contentId}`}
                className="p-4 bg-[#0f172a] rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{illusion.contentId}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b]">
                    GAP: {illusion.illusionGap}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-[#94a3b8] mb-1">Reconhecimento</div>
                    <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e] rounded-full"
                        style={{ width: `${illusion.recognitionScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#22c55e] mt-1">{illusion.recognitionScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#94a3b8] mb-1">Produção</div>
                    <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ef4444] rounded-full"
                        style={{ width: `${illusion.productionScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#ef4444] mt-1">{illusion.productionScore}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">🧠 Distribuição de Confiança</h3>
        <p className="text-sm text-[#94a3b8] mb-4">
          Compare sua confiança com sua precisão real.
        </p>
        {confidenceEntries.length === 0 ? (
          <p className="text-[#94a3b8] text-sm text-center py-4">Dados insuficientes</p>
        ) : (
          <div className="space-y-3">
            {confidenceEntries.map(([level, data]) => {
              const total = data.correct + data.incorrect
              const accuracy = total > 0 ? (data.correct / total) * 100 : 0
              const confLabels: Record<string, string> = {
                chuted: ' chutei',
                low: ' Baixa',
                medium: ' Média',
                high: ' Alta',
              }
              return (
                <div key={level} className="p-3 bg-[#0f172a] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Confiança{confLabels[level] || level}</span>
                    <span className="text-xs text-[#94a3b8]">{total} tentativas</span>
                  </div>
                  <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${accuracy}%`,
                        backgroundColor: accuracy >= 70 ? '#22c55e' : accuracy >= 40 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: accuracy >= 70 ? '#22c55e' : accuracy >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {Math.round(accuracy)}% precisão
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

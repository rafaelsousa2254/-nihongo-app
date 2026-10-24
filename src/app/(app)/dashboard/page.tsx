'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { generateDailyMissions, type Mission } from '@/lib/journey-engine'
import { detectWeaknesses, type WeaknessPattern } from '@/lib/shadow-sensei'
import { calculateRadarSkills, type RadarSkill } from '@/lib/japanese-radar'
import { generateContextualTips, type ContextualTip } from '@/lib/contextual-tips'
import Link from 'next/link'

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={mission.href} className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all group">
        <div className="flex items-center gap-4">
          <div className="text-3xl group-hover:scale-110 transition-transform">{mission.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text-primary)]">{mission.title}</h3>
              {mission.type === 'boss' && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--danger)]/20 text-[var(--danger)]">BOSS</span>}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{mission.description}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[var(--text-secondary)]">⏱️ {mission.duration}</span>
              <span className="text-xs text-[var(--accent)]">→ {mission.reason}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function WeaknessCard({ weakness, index }: { weakness: WeaknessPattern; index: number }) {
  const severityColors = { low: 'var(--text-secondary)', medium: 'var(--warning)', high: 'var(--danger)' }
  return (
    <motion.div
      className="glass rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">⚠️</div>
        <div className="flex-1">
          <p className="text-sm text-[var(--text-primary)]">{weakness.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs" style={{ color: severityColors[weakness.severity] }}>
              {weakness.severity === 'high' ? 'Alta' : weakness.severity === 'medium' ? 'Média' : 'Baixa'} prioridade
            </span>
            <Link href={weakness.actionHref} className="text-xs text-[var(--accent)] hover:underline">
              {weakness.actionLabel} →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RadarSkillCard({ skill }: { skill: RadarSkill }) {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return 'var(--accent)'
    if (score >= 40) return 'var(--warning)'
    return 'var(--danger)'
  }

  return (
    <Link href={skill.actionHref} className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{skill.icon}</span>
          <span className="font-semibold text-[var(--text-primary)]">{skill.name}</span>
        </div>
        <span className="text-sm font-medium" style={{ color: getBarColor(skill.score) }}>
          {skill.score}%
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: getBarColor(skill.score) }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.score}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-[var(--text-secondary)]">{skill.level}</span>
        {skill.weaknesses.length > 0 && (
          <span className="text-xs text-[var(--danger)]">⚡ {skill.weaknesses[0]}</span>
        )}
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user, xp, level, coins, streak } = useAppStore()
  const [missions, setMissions] = useState<Mission[]>([])
  const [weaknesses, setWeaknesses] = useState<WeaknessPattern[]>([])
  const [radarSkills, setRadarSkills] = useState<RadarSkill[]>([])
  const [contextualTips, setContextualTips] = useState<ContextualTip[]>([])
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work')

  useEffect(() => {
    setMissions(generateDailyMissions())
    setWeaknesses(detectWeaknesses())
    setRadarSkills(calculateRadarSkills())
    setContextualTips(generateContextualTips())
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (pomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime((t) => t - 1), 1000)
    } else if (pomodoroTime === 0) {
      setPomodoroRunning(false)
      if (pomodoroMode === 'work') {
        setPomodoroTime(5 * 60)
        setPomodoroMode('break')
      } else {
        setPomodoroTime(25 * 60)
        setPomodoroMode('work')
      }
    }
    return () => { if (interval) clearInterval(interval) }
  }, [pomodoroRunning, pomodoroTime, pomodoroMode])

  const formatPomodoro = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          おかえりなさい、<span className="text-[var(--accent)]">{user?.name || 'Estudante'}</span>! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">Continue sua jornada de aprendizado</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'XP Total', value: xp.toLocaleString(), icon: '⭐', color: 'var(--warning)' },
          { label: 'Nível', value: level.toString(), icon: '📈', color: 'var(--accent)' },
          { label: 'Sequência', value: `${streak} dias`, icon: '🔥', color: 'var(--danger)' },
          { label: 'Moedas', value: coins.toString(), icon: '🪙', color: 'var(--success)' },
          { label: 'Radar', value: `${Math.round(radarSkills.reduce((s, sk) => s + sk.score, 0) / radarSkills.length)}%`, icon: '📊', color: '#8b5cf6' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[var(--text-primary)]">🎯 Meta Diária</h3>
          <span className="text-sm text-[var(--text-secondary)]">{xp % 100} / 100 XP</span>
        </div>
        <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-glow)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(((xp % 100) / 100) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {weaknesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">🔮 Shadow Sensei</h3>
          <div className="space-y-3">
            {weaknesses.slice(0, 3).map((w, i) => (
              <WeaknessCard key={w.type + i} weakness={w} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">🗺️ Missão de Hoje</h3>
        <div className="space-y-3">
          {missions.slice(0, 6).map((m, i) => (
            <MissionCard key={m.id} mission={m} index={i} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">📊 Japanese Radar</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {radarSkills.map((skill) => (
            <RadarSkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pomodoro Widget */}
        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">🍅 Pomodoro</h3>
          <div className="text-center space-y-4">
            <div className={`text-5xl font-mono font-bold ${pomodoroMode === 'work' ? 'text-[var(--accent)]' : 'text-[var(--success)]'}`}>
              {formatPomodoro(pomodoroTime)}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {pomodoroMode === 'work' ? '📚 Estudando' : '☕ Pausa'}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  pomodoroRunning
                    ? 'bg-[var(--danger)]/20 text-[var(--danger)]'
                    : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                }`}
              >
                {pomodoroRunning ? '⏸ Pausar' : '▶ Iniciar'}
              </button>
              <button
                onClick={() => { setPomodoroRunning(false); setPomodoroTime(25 * 60); setPomodoroMode('work') }}
                className="px-4 py-2 rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
              >
                ↺
              </button>
            </div>
            <Link href="/focus" className="text-xs text-[var(--accent)] hover:underline">
              🎯 Modo Foco Completo →
            </Link>
          </div>
        </motion.div>

        {/* Contextual Tips */}
        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">💡 Dicas para Você</h3>
          <div className="space-y-3">
            {contextualTips.slice(0, 4).map((tip, i) => (
              <Link
                key={tip.id}
                href={tip.actionHref}
                className="block p-3 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{tip.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {tip.title}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{tip.description}</div>
                  </div>
                  <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">🎮 Desafios</h3>
          <div className="space-y-3">
            <Link href="/boss-battle" className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👑</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Boss Battle</div>
                  <div className="text-xs text-[var(--text-secondary)]">Enfrente um desafio épico</div>
                </div>
              </div>
            </Link>
            <Link href="/survival" className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⏱️</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Survival Mode</div>
                  <div className="text-xs text-[var(--text-secondary)]">Quanto tempo você aguenta?</div>
                </div>
              </div>
            </Link>
            <Link href="/focus" className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Modo Foco</div>
                  <div className="text-xs text-[var(--text-secondary)]">Tela limpa sem distrações</div>
                </div>
              </div>
            </Link>
            <Link href="/daily-capsule" className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💊</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Cápsula Diária</div>
                  <div className="text-xs text-[var(--text-secondary)]">Conteúdo novo todo dia</div>
                </div>
              </div>
            </Link>
            <Link href="/activities/immersion" className="block glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Modo Imersão</div>
                  <div className="text-xs text-[var(--text-secondary)]">Leia textos reais em japonês</div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">⚡ Estudo Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'あ', label: 'Hiragana', href: '/hiragana' },
              { icon: 'ア', label: 'Katakana', href: '/katakana' },
              { icon: '漢', label: 'Kanji', href: '/kanji' },
              { icon: '📚', label: 'Vocabulário', href: '/vocabulary' },
              { icon: '📝', label: 'Gramática', href: '/grammar' },
              { icon: '💬', label: 'Conversação', href: '/conversation' },
              { icon: '📖', label: 'Imersão', href: '/activities/immersion' },
              { icon: '🎯', label: 'Modo Foco', href: '/focus' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="glass rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-all text-center"
              >
                <div className="text-2xl mb-1">{action.icon}</div>
                <div className="text-xs font-medium text-[var(--text-primary)]">{action.label}</div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

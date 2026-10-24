'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { calculateRadarSkills, type RadarSkill } from '@/lib/japanese-radar'
import Link from 'next/link'

function RadarChart({ skills }: { skills: RadarSkill[] }) {
  const size = 300
  const center = size / 2
  const radius = 120
  const levels = 5

  const getPoint = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2
    const r = (score / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const getPolygonPoints = (scoreFn: (s: RadarSkill) => number) => {
    return skills.map((s, i) => {
      const p = getPoint(i, scoreFn(s))
      return `${p.x},${p.y}`
    }).join(' ')
  }

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const levelScore = ((i + 1) / levels) * 100
    return getPolygonPoints(() => levelScore)
  })

  const dataPolygon = getPolygonPoints((s) => s.score)

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto">
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {skills.map((_, i) => {
        const p = getPoint(i, 100)
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--bg-tertiary)" strokeWidth="1" opacity={0.3} />
        )
      })}

      <polygon
        points={dataPolygon}
        fill="rgba(14, 165, 233, 0.2)"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {skills.map((skill, i) => {
        const p = getPoint(i, skill.score)
        const labelP = getPoint(i, 115)
        const getColor = (score: number) => {
          if (score >= 80) return 'var(--success)'
          if (score >= 60) return 'var(--accent)'
          if (score >= 40) return 'var(--warning)'
          return 'var(--danger)'
        }
        return (
          <g key={skill.id}>
            <circle cx={p.x} cy={p.y} r="4" fill={getColor(skill.score)} />
            <text
              x={labelP.x}
              y={labelP.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              {skill.icon} {skill.name}
            </text>
            <text
              x={labelP.x}
              y={labelP.y + 14}
              textAnchor="middle"
              fill={getColor(skill.score)}
              fontSize="10"
              fontWeight="bold"
            >
              {skill.score}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SkillDetail({ skill }: { skill: RadarSkill }) {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return 'var(--accent)'
    if (score >= 40) return 'var(--warning)'
    return 'var(--danger)'
  }

  return (
    <motion.div
      className="glass rounded-xl p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{skill.icon}</span>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">{skill.name}</h3>
            <span className="text-sm" style={{ color: getBarColor(skill.score) }}>{skill.level}</span>
          </div>
        </div>
        <span className="text-2xl font-bold" style={{ color: getBarColor(skill.score) }}>{skill.score}%</span>
      </div>

      <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: getBarColor(skill.score) }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.score}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-[var(--success)] mb-2">✅ Pontos Fortes</h4>
          {skill.strengths.length > 0 ? (
            <ul className="space-y-1">
              {skill.strengths.map((s, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)]">• {s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">Continue praticando!</p>
          )}
        </div>
        <div>
          <h4 className="text-xs font-semibold text-[var(--danger)] mb-2">⚡ Fraquezas</h4>
          {skill.weaknesses.length > 0 ? (
            <ul className="space-y-1">
              {skill.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)]">• {w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">Nenhuma fraqueza detectada!</p>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] rounded-lg p-3 mb-4">
        <p className="text-sm text-[var(--text-primary)]">{skill.recommendation}</p>
      </div>

      <Link
        href={skill.actionHref}
        className="block w-full py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-medium text-center hover:opacity-90 transition-all"
      >
        🎯 Treinar esta habilidade
      </Link>
    </motion.div>
  )
}

export default function JapaneseRadarPage() {
  const [skills, setSkills] = useState<RadarSkill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<RadarSkill | null>(null)

  useEffect(() => {
    setSkills(calculateRadarSkills())
  }, [])

  const average = skills.length > 0 ? Math.round(skills.reduce((s, sk) => s + sk.score, 0) / skills.length) : 0

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">📊 Japanese Radar</h1>
        <p className="text-[var(--text-secondary)]">Visualize suas habilidades em japonês</p>
      </motion.div>

      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-[var(--accent)]">{average}%</div>
          <div className="text-sm text-[var(--text-secondary)]">Média Geral</div>
        </div>
        <RadarChart skills={skills} />
      </motion.div>

      <div className="space-y-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
            className="cursor-pointer"
          >
            <div className={`glass rounded-xl p-4 transition-all ${selectedSkill?.id === skill.id ? 'ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--bg-tertiary)]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">{skill.name}</span>
                    <span className="text-sm text-[var(--text-secondary)] ml-2">{skill.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${skill.score}%`,
                        backgroundColor: skill.score >= 80 ? 'var(--success)' : skill.score >= 60 ? 'var(--accent)' : skill.score >= 40 ? 'var(--warning)' : 'var(--danger)',
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{
                    color: skill.score >= 80 ? 'var(--success)' : skill.score >= 60 ? 'var(--accent)' : skill.score >= 40 ? 'var(--warning)' : 'var(--danger)',
                  }}>
                    {skill.score}%
                  </span>
                </div>
              </div>
            </div>
            {selectedSkill?.id === skill.id && (
              <div className="mt-2">
                <SkillDetail skill={skill} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

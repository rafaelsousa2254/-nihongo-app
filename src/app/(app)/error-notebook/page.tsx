'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getErrors, clearErrorsForContent, clearAllErrors, type ErrorRecord } from '@/lib/performance'
import { MASTERY_ICONS, MASTERY_COLORS, type MasteryLevel } from '@/lib/mastery'
import Link from 'next/link'

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  isolated: { label: 'Isolado', color: 'var(--text-secondary)', bg: 'var(--bg-primary)' },
  recurring: { label: 'Recorrente', color: 'var(--warning)', bg: 'rgba(234, 179, 8, 0.1)' },
  weakness: { label: 'Fraqueza', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  critical_weakness: { label: 'Crítico', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' },
}

const CATEGORY_NAMES: Record<string, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  kanji: 'Kanji',
  vocabulary: 'Vocabulário',
  grammar: 'Gramática',
  listening: 'Audição',
  pronunciation: 'Pronúncia',
}

function ErrorCard({ error, index }: { error: ErrorRecord; index: number }) {
  const severity = SEVERITY_CONFIG[error.severity] || SEVERITY_CONFIG.isolated

  return (
    <motion.div
      className="glass rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: severity.bg, color: severity.color }}>
              {severity.label}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {CATEGORY_NAMES[error.contentType] || error.contentType}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {new Date(error.timestamp).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="text-sm text-[var(--text-primary)] font-medium mb-1">{error.question}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--danger)]">Sua resposta: {error.givenAnswer}</span>
            <span className="text-[var(--text-secondary)]">→</span>
            <span className="text-[var(--success)]">Correto: {error.correctAnswer}</span>
          </div>
          {error.occurrenceCount > 1 && (
            <div className="text-xs text-[var(--warning)] mt-1">
              ⚠️ {error.occurrenceCount} ocorrências
            </div>
          )}
        </div>
        <div className="text-lg">
          {error.severity === 'critical_weakness' ? '🔴' :
           error.severity === 'weakness' ? '🟠' :
           error.severity === 'recurring' ? '🟡' : '⚪'}
        </div>
      </div>
    </motion.div>
  )
}

export default function ErrorNotebookPage() {
  const [errors, setErrors] = useState<ErrorRecord[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    setErrors(getErrors())
  }, [])

  const filteredErrors = errors.filter((e) => {
    if (filter !== 'all' && e.severity !== filter) return false
    if (categoryFilter !== 'all' && e.contentType !== categoryFilter) return false
    return true
  })

  const stats = {
    total: errors.length,
    isolated: errors.filter((e) => e.severity === 'isolated').length,
    recurring: errors.filter((e) => e.severity === 'recurring').length,
    weakness: errors.filter((e) => e.severity === 'weakness').length,
    critical: errors.filter((e) => e.severity === 'critical_weakness').length,
  }

  const categories = [...new Set(errors.map((e) => e.contentType))]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">📓 Caderno de Erros</h1>
        <p className="text-[var(--text-secondary)]">Acompanhe seus padrões de erro para melhorar mais rápido</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: '📝', color: 'var(--text-primary)' },
          { label: 'Isolados', value: stats.isolated, icon: '⚪', color: 'var(--text-secondary)' },
          { label: 'Recorrentes', value: stats.recurring, icon: '🟡', color: 'var(--warning)' },
          { label: 'Fraquezas', value: stats.weakness, icon: '🟠', color: '#f97316' },
          { label: 'Críticos', value: stats.critical, icon: '🔴', color: 'var(--danger)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
          }`}
        >
          Todos
        </button>
        {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === key ? 'text-white' : 'text-[var(--text-secondary)]'
            }`}
            style={filter === key ? { backgroundColor: config.color } : { backgroundColor: 'var(--bg-primary)' }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
            }`}
          >
            Todas categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
              }`}
            >
              {CATEGORY_NAMES[cat] || cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filteredErrors.length > 0 ? (
          filteredErrors.map((error, i) => (
            <ErrorCard key={error.id} error={error} index={i} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[var(--text-secondary)]">
              {errors.length === 0 ? 'Nenhum erro registrado ainda!' : 'Nenhum erro encontrado com este filtro.'}
            </p>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="flex gap-3 justify-center">
          <Link href="/flashcards" className="px-4 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all">
            🎴 Revisar com Flashcards
          </Link>
          <button
            onClick={() => { clearAllErrors(); setErrors([]) }}
            className="px-4 py-2 bg-[var(--danger)]/20 text-[var(--danger)] rounded-xl text-sm font-medium hover:bg-[var(--danger)]/30 transition-all"
          >
            🗑️ Limpar Tudo
          </button>
        </div>
      )}
    </div>
  )
}

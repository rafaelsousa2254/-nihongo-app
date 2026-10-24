'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { immersionTexts, type ImmersionText } from '@/data/immersion'
import { SpeakJapanese, CheckVoiceSupport } from '@/lib/speech'

export default function ImmersionPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeText, setActiveText] = useState<ImmersionText | null>(null)
  const [showReading, setShowReading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const voiceSupported = CheckVoiceSupport()

  const levels = ['all', 'N5', 'N4', 'N3', 'N2', 'N1']
  const categories = [
    { id: 'all', label: 'Todos', icon: '📚' },
    { id: 'news', label: 'Notícias', icon: '📰' },
    { id: 'manga', label: 'Mangá', icon: '📖' },
    { id: 'daily', label: 'Dia a Dia', icon: '🗣️' },
    { id: 'song', label: 'Músicas', icon: '🎵' },
    { id: 'proverb', label: 'Provérbios', icon: '🏮' },
  ]

  const filtered = immersionTexts.filter((t) => {
    const matchLevel = selectedLevel === 'all' || t.level === selectedLevel
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory
    return matchLevel && matchCat
  })

  const categoryColors: Record<string, string> = {
    news: '#0ea5e9',
    manga: '#ef4444',
    daily: '#22c55e',
    song: '#8b5cf6',
    proverb: '#f59e0b',
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">📖 Modo Imersão</h1>
        <p className="text-[var(--text-secondary)]">Leia textos reais em japonês com tradução hover</p>
      </motion.div>

      {!activeText ? (
        <>
          <div className="flex gap-2 flex-wrap">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLevel === l
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {l === 'all' ? 'Todos' : l}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === c.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((text, i) => (
              <motion.button
                key={text.id}
                className="w-full glass rounded-xl p-4 text-left hover:bg-[var(--bg-tertiary)] transition-all"
                onClick={() => setActiveText(text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${categoryColors[text.category]}20`, color: categoryColors[text.category] }}>
                        {text.category}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">{text.level}</span>
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">{text.title}</h3>
                    <p className="text-[var(--text-primary)] mt-1">{text.japanese}</p>
                  </div>
                  <span className="text-[var(--text-secondary)]">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <button
            onClick={() => { setActiveText(null); setShowReading(false); setShowTranslation(false) }}
            className="text-[var(--accent)] hover:text-[var(--accent-glow)] transition-colors flex items-center gap-2"
          >
            ← Voltar
          </button>

          <div className="glass rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${categoryColors[activeText.category]}20`, color: categoryColors[activeText.category] }}>
                {activeText.category}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">{activeText.level}</span>
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)]">{activeText.title}</h2>

            {/* Japanese text */}
            <div className="text-2xl leading-relaxed text-[var(--text-primary)] font-medium p-4 rounded-xl bg-[var(--bg-primary)]">
              {activeText.japanese.split('').map((char, i) => (
                <span
                  key={i}
                  className="cursor-pointer hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-all inline-block"
                  onMouseEnter={() => setHoveredWord(char)}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredWord && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-center text-sm text-[var(--accent)]"
                >
                  caractere: {hoveredWord}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggles */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReading(!showReading)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showReading
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--bg-tertiary)]'
                }`}
              >
                🔤 {showReading ? 'Ocultar Leitura' : 'Mostrar Leitura'}
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showTranslation
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--bg-tertiary)]'
                }`}
              >
                🇧🇷 {showTranslation ? 'Ocultar Tradução' : 'Mostrar Tradução'}
              </button>
            </div>

            {/* Reading */}
            <AnimatePresence>
              {showReading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
                    <div className="text-xs text-[var(--accent)] mb-1">📖 Leitura (Furigana)</div>
                    <div className="text-[var(--text-primary)]">{activeText.reading}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Translation */}
            <AnimatePresence>
              {showTranslation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-[var(--success)]/5 border border-[var(--success)]/20">
                    <div className="text-xs text-[var(--success)] mb-1">🇧🇷 Tradução</div>
                    <div className="text-[var(--text-primary)]">{activeText.portuguese}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Audio */}
            {voiceSupported && (
              <button
                onClick={() => SpeakJapanese(activeText.japanese)}
                className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                🔊 Ouvir Áudio
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

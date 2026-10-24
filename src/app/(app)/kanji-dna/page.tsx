'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { kanji, type KanjiCharacter } from '@/data/kanji'
import { playKanjiAudio } from '@/lib/speech'
import { getMnemonic, type Mnemonic } from '@/lib/kanji-mnemonics'

const RADICAL_MAP: Record<string, string[]> = {
  '一': ['one', 'single'],
  '二': ['two', 'double'],
  '三': ['three', 'triple'],
  '口': ['mouth', 'opening'],
  '日': ['sun', 'day'],
  '月': ['moon', 'month'],
  '木': ['tree', 'wood'],
  '水': ['water'],
  '火': ['fire'],
  '土': ['earth', 'soil'],
  '金': ['gold', 'metal'],
  '人': ['person', 'human'],
  '大': ['big', 'large'],
  '小': ['small', 'little'],
  '中': ['middle', 'center'],
  '上': ['up', 'above'],
  '下': ['down', 'below'],
  '山': ['mountain'],
  '川': ['river'],
  '田': ['rice field'],
  '力': ['power', 'strength'],
  '手': ['hand'],
  '目': ['eye'],
  '心': ['heart', 'mind'],
}

function findRelatedKanji(char: KanjiCharacter): KanjiCharacter[] {
  const related: KanjiCharacter[] = []

  for (const radical of char.radicals) {
    for (const k of kanji) {
      if (k.id !== char.id && k.radicals.includes(radical)) {
        related.push(k)
      }
    }
  }

  if (related.length === 0) {
    const sharedMeanings = kanji.filter((k) =>
      k.id !== char.id &&
      k.meanings.some((m) => char.meanings.some((cm) => cm.toLowerCase() === m.toLowerCase()))
    )
    related.push(...sharedMeanings)
  }

  return [...new Set(related)].slice(0, 6)
}

function findSameRadical(char: KanjiCharacter): KanjiCharacter[] {
  return kanji
    .filter((k) => k.id !== char.id && k.radicals.some((r) => char.radicals.includes(r)))
    .slice(0, 8)
}

export default function KanjiDNAPage() {
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('Todos')
  const [selected, setSelected] = useState<KanjiCharacter | null>(null)

  const levels = ['Todos', 'N5', 'N4', 'N3', 'N2', 'N1']
  const filtered = kanji.filter((k) => {
    const matchLevel = selectedLevel === 'Todos' || k.jlptLevel === selectedLevel
    const matchSearch = !search || k.character.includes(search) || k.meanings.some((m) => m.includes(search))
    return matchLevel && matchSearch
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">🧬 Kanji DNA</h1>
        <p className="text-[var(--text-secondary)]">Explore as conexões entre kanji, radicais e significados</p>
      </motion.div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar kanji por caractere ou significado..."
          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-lg focus:border-[var(--accent)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedLevel === level
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {filtered.slice(0, 60).map((k, i) => (
          <motion.button
            key={k.id}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
              selected?.id === k.id
                ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]'
                : 'bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] hover:border-[var(--accent)]'
            }`}
            onClick={() => setSelected(selected?.id === k.id ? null : k)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold text-[var(--text-primary)]">{k.character}</span>
            <span className="text-[9px] text-[var(--text-secondary)]">{k.jlptLevel}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-8xl font-bold text-[var(--accent)] inline-block">{selected.character}</div>
                <div className="inline-block ml-3 px-3 py-1 rounded-lg text-sm font-bold bg-[var(--accent)]/20 text-[var(--accent)]">
                  JLPT {selected.jlptLevel}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-2">{selected.strokes} traços</div>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Significados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.meanings.map((m, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] text-sm">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-1">On&apos;yomi (音読み)</h4>
                    <div className="text-lg font-semibold text-[var(--accent)]">{selected.onyomi.join(', ')}</div>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Kun&apos;yomi (訓読み)</h4>
                    <div className="text-lg font-semibold text-[var(--warning)]">{selected.kunyomi.join(', ')}</div>
                  </div>
                </div>

                <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Radicais</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.radicals.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {(() => {
                  const mnemonic = getMnemonic(selected.character)
                  if (!mnemonic) return null
                  return (
                    <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-[var(--accent)] mb-2">🧠 Mnemônico</h4>
                      <p className="text-[var(--text-primary)] text-sm mb-2">{mnemonic.mnemonic}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{mnemonic.visualTip.split(' ')[0]}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{mnemonic.visualTip.split(' ').slice(1).join(' ')}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-2">📐 {mnemonic.radicalBreakdown}</p>
                    </div>
                  )
                })()}

                {selected.examples.length > 0 && (
                  <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Exemplos</h4>
                    <div className="space-y-2">
                      {selected.examples.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]">
                          <div>
                            <span className="text-[var(--text-primary)] font-medium">{ex.word}</span>
                            <span className="text-[var(--text-secondary)] text-sm ml-2">({ex.reading})</span>
                          </div>
                          <span className="text-[var(--text-secondary)] text-sm">{ex.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {findRelatedKanji(selected).length > 0 && (
                  <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">🔗 Kanji Relacionados</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {findRelatedKanji(selected).map((k) => (
                        <button
                          key={k.id}
                          onClick={() => setSelected(k)}
                          className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/20 transition-all text-center"
                        >
                          <span className="text-xl font-bold text-[var(--text-primary)]">{k.character}</span>
                          <div className="text-[10px] text-[var(--text-secondary)]">{k.meanings[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {findSameRadical(selected).length > 0 && (
                  <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">🏛️ Mesmos Radicais</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {findSameRadical(selected).map((k) => (
                        <button
                          key={k.id}
                          onClick={() => setSelected(k)}
                          className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/20 transition-all text-center"
                        >
                          <span className="text-xl font-bold text-[var(--text-primary)]">{k.character}</span>
                          <div className="text-[10px] text-[var(--text-secondary)]">{k.meanings[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => playKanjiAudio(selected.character, selected.onyomi[0] || selected.kunyomi[0])}
                  className="flex-1 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all"
                >
                  🔊 Ouvir Pronúncia
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-primary)] transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { generateDailyCapsule, hasCollectedToday, markCollectedToday, type DailyCapsuleItem } from '@/lib/daily-capsule'

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  kanji: { icon: '漢', color: 'var(--accent)', label: 'Kanji do Dia' },
  word: { icon: '📚', color: 'var(--success)', label: 'Palavra do Dia' },
  expression: { icon: '💬', color: '#8b5cf6', label: 'Expressão do Dia' },
  curiosity: { icon: '🇯🇵', color: 'var(--warning)', label: 'Curiosidade Cultural' },
  challenge: { icon: '⚡', color: 'var(--danger)', label: 'Desafio do Dia' },
}

function CapsuleCard({ item, index }: { item: DailyCapsuleItem; index: number }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.kanji

  return (
    <motion.div
      className="glass rounded-2xl p-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10" style={{ backgroundColor: config.color }} />
      <div className="flex items-start gap-4">
        <div className="text-4xl w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
          {item.type === 'kanji' ? item.content : config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
              {config.label}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {item.difficulty === 'easy' ? '🟢 Fácil' : item.difficulty === 'medium' ? '🟡 Médio' : '🔴 Difícil'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            {item.type === 'kanji' ? (
              <span className="text-4xl">{item.content}</span>
            ) : item.type === 'word' || item.type === 'expression' ? (
              <>
                <span className="text-xl">{item.content}</span>
                {item.reading && <span className="text-sm text-[var(--text-secondary)] ml-2">({item.reading})</span>}
              </>
            ) : (
              item.title
            )}
          </h3>
          {item.meaning && (
            <p className="text-[var(--text-secondary)] text-sm mb-2">{item.meaning}</p>
          )}
          {item.example && (
            <div className="bg-[var(--bg-primary)] rounded-lg p-3 mt-2">
              <span className="text-sm text-[var(--text-primary)]">{item.example}</span>
            </div>
          )}
          {item.trivia && (
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{item.trivia}</p>
          )}
          {item.type === 'challenge' && (
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 mt-2">
              <p className="text-[var(--text-primary)] font-medium">{item.content}</p>
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-[var(--warning)]">⭐ +{item.xpReward} XP</span>
            <span className="text-xs text-[var(--success)]">🪙 +{item.coinsReward} moedas</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DailyCapsulePage() {
  const { user, addXp, addCoins } = useAppStore()
  const [items, setItems] = useState<DailyCapsuleItem[]>([])
  const [collected, setCollected] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const capsule = generateDailyCapsule(user?.level || 1)
    setItems(capsule)
    setCollected(hasCollectedToday())
  }, [user?.level])

  const collectRewards = () => {
    if (collected) return
    items.forEach((item) => {
      addXp(item.xpReward)
      addCoins(item.coinsReward)
    })
    markCollectedToday()
    setCollected(true)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">💊 Cápsula Diária</h1>
        <p className="text-[var(--text-secondary)]">Conteúdo novo todo dia para manter você avançando!</p>
      </motion.div>

      <motion.div
        className="glass rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-5xl mb-4">🧧</div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          {collected ? '✅ Você já coletou a cápsula de hoje!' : '5 itens novos esperando por você!'}
        </p>
        {!collected && (
          <button
            onClick={collectRewards}
            className="px-8 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            🎁 Coletar Recompensas
          </button>
        )}
      </motion.div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <CapsuleCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <motion.div
        className="glass rounded-xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-[var(--text-secondary)]">
          💡 A cápsula é atualizada todo dia à meia-noite. Volte amanhã para mais conteúdo!
        </p>
      </motion.div>
    </div>
  )
}

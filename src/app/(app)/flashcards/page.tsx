'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { calculateNextReview } from '@/lib/sm2';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import { kanji } from '@/data/kanji';
import { vocabulary } from '@/data/vocabulary';

type FlashcardSM2 = {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview?: string;
};

type Flashcard = {
  id: string;
  front: string;
  back: string;
  reading?: string;
  sm2: FlashcardSM2;
};

const MAX_CARDS_PER_DECK = 30;

function generateHiraganaDeck() {
  return hiragana.slice(0, MAX_CARDS_PER_DECK).map((h) => ({
    id: `h_${h.id}`,
    front: h.character,
    back: h.romanization,
  }));
}

function generateKatakanaDeck() {
  return katakana.slice(0, MAX_CARDS_PER_DECK).map((k) => ({
    id: `k_${k.id}`,
    front: k.character,
    back: k.romanization,
  }));
}

function generateKanjiDeck() {
  return kanji.filter((k) => k.jlptLevel === 'N5').slice(0, MAX_CARDS_PER_DECK).map((k) => ({
    id: `kj_${k.id}`,
    front: k.character,
    back: k.meanings[0],
    reading: k.onyomi[0] || k.kunyomi[0],
  }));
}

function generateVocabDeck() {
  return vocabulary.filter((v) => v.jlptLevel === 'N5').slice(0, MAX_CARDS_PER_DECK).map((v) => ({
    id: `v_${v.id}`,
    front: v.word,
    back: v.meaning,
    reading: v.reading,
  }));
}

const initialDecks: Record<string, Omit<Flashcard, 'sm2'>[]> = {
  'Hiragana': generateHiraganaDeck(),
  'Katakana': generateKatakanaDeck(),
  'Kanji': generateKanjiDeck(),
  'Vocabulário': generateVocabDeck(),
};

const defaultSM2: FlashcardSM2 = { easeFactor: 2.5, interval: 0, repetitions: 0 };

function getStoredDeck(deckName: string): Flashcard[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`flashcard_${deckName}`);
  if (stored) return JSON.parse(stored);

  return initialDecks[deckName].map((card) => ({
    ...card,
    sm2: { ...defaultSM2 },
  }));
}

function saveDeck(deckName: string, cards: Flashcard[]) {
  localStorage.setItem(`flashcard_${deckName}`, JSON.stringify(cards));
}

const deckNames = Object.keys(initialDecks);

export default function FlashcardsPage() {
  const { addXp, addCoins, token } = useAppStore();
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const startDeck = useCallback((deck: string) => {
    const storedCards = getStoredDeck(deck);
    const now = new Date();
    const dueCards = storedCards.filter((c) => {
      if (c.sm2.repetitions === 0) return true;
      if (!c.sm2.nextReview) return true;
      return new Date(c.sm2.nextReview) <= now;
    });
    const shuffled = dueCards.length > 0 ? [...dueCards].sort(() => Math.random() - 0.5) : [...storedCards].sort(() => Math.random() - 0.5);

    setSelectedDeck(deck);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  }, []);

  const rateCard = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const qualityMap = { again: 1, hard: 2, good: 4, easy: 5 };
    const quality = qualityMap[rating];
    const card = cards[currentIndex];

    const result = calculateNextReview(card.sm2, quality);

    const xpMap = { again: 2, hard: 5, good: 10, easy: 15 };
    const coinsMap = { again: 0, hard: 1, good: 2, easy: 3 };
    const xpEarned = xpMap[rating];
    const coinsEarned = coinsMap[rating];

    addXp(xpEarned);
    addCoins(coinsEarned);

    if (token) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentType: selectedDeck?.toLowerCase(),
            contentId: card.id,
            quality,
          }),
        });
      } catch {
        // silently fail
      }
    }

    const updatedCards = cards.map((c, i) =>
      i === currentIndex ? { ...c, sm2: { ...result, nextReview: result.nextReview.toISOString() } } : c
    );
    setCards(updatedCards);

    if (selectedDeck) {
      saveDeck(selectedDeck, updatedCards);
    }

    setStats((s) => ({ ...s, [rating]: s[rating] + 1 }));

    if (currentIndex + 1 >= cards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  if (!selectedDeck) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">🎴 Flashcards</h1>
          <p className="text-[#94a3b8]">Sistema de repetição espaçada SM-2</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deckNames.map((deck, i) => {
            const storedCards = getStoredDeck(deck);
            const now = new Date();
            const dueCount = storedCards.filter((c) => {
              if (c.sm2.repetitions === 0) return true;
              if (!c.sm2.nextReview) return true;
              return new Date(c.sm2.nextReview) <= now;
            }).length;
            return (
              <motion.button
                key={deck}
                onClick={() => startDeck(deck)}
                className="glass rounded-xl p-6 text-center hover:bg-[#334155] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-4xl mb-3">🎴</div>
                <div className="font-semibold text-white">{deck}</div>
                <div className="text-sm text-[#94a3b8] mt-1">{storedCards.length} cards</div>
                {dueCount > 0 && (
                  <div className="text-xs text-[#f59e0b] mt-2">📋 {dueCount} para revisar</div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Sessão Completa!</h2>
          <p className="text-[#94a3b8] mb-6">{selectedDeck} - {total} cards revisados</p>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#ef4444]/20 rounded-lg p-3">
              <div className="text-xl font-bold text-[#ef4444]">{stats.again}</div>
              <div className="text-xs text-[#94a3b8]">De novo</div>
            </div>
            <div className="bg-[#f59e0b]/20 rounded-lg p-3">
              <div className="text-xl font-bold text-[#f59e0b]">{stats.hard}</div>
              <div className="text-xs text-[#94a3b8]">Difícil</div>
            </div>
            <div className="bg-[#22c55e]/20 rounded-lg p-3">
              <div className="text-xl font-bold text-[#22c55e]">{stats.good}</div>
              <div className="text-xs text-[#94a3b8]">Bom</div>
            </div>
            <div className="bg-[#0ea5e9]/20 rounded-lg p-3">
              <div className="text-xl font-bold text-[#0ea5e9]">{stats.easy}</div>
              <div className="text-xs text-[#94a3b8]">Fácil</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => startDeck(selectedDeck)}
              className="flex-1 py-3 bg-[#0ea5e9] text-white rounded-lg font-medium hover:bg-[#38bdf8] transition-all"
            >
              Estudar Novamente
            </button>
            <button
              onClick={() => setSelectedDeck(null)}
              className="flex-1 py-3 bg-[#334155] text-white rounded-lg font-medium hover:bg-[#475569] transition-all"
            >
              Voltar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedDeck(null)}
          className="text-[#94a3b8] hover:text-white transition-colors"
        >
          ← Voltar
        </button>
        <div className="text-sm text-[#94a3b8]">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#0ea5e9] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div
        className={`flip-card h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flip-card-inner relative w-full h-full">
          <div className="flip-card-front glass rounded-2xl flex flex-col items-center justify-center">
            <div className="text-7xl font-bold text-white mb-4">{card.front}</div>
            {card.reading && <div className="text-lg text-[#94a3b8]">{card.reading}</div>}
            <div className="text-sm text-[#64748b] mt-4">Toque para virar</div>
          </div>
          <div className="flip-card-back glass rounded-2xl flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-[#0ea5e9] neon-glow mb-4">{card.back}</div>
            {card.reading && <div className="text-lg text-[#94a3b8]">{card.reading}</div>}
            <div className="text-sm text-[#64748b] mt-4">Toque para voltar</div>
          </div>
        </div>
      </div>

      {/* Rating */}
      {isFlipped && (
        <motion.div
          className="grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => rateCard('again')}
            className="py-3 bg-[#ef4444]/20 text-[#ef4444] rounded-xl font-medium hover:bg-[#ef4444]/30 transition-all"
          >
            <div className="text-lg">1</div>
            <div className="text-xs">De novo</div>
          </button>
          <button
            onClick={() => rateCard('hard')}
            className="py-3 bg-[#f59e0b]/20 text-[#f59e0b] rounded-xl font-medium hover:bg-[#f59e0b]/30 transition-all"
          >
            <div className="text-lg">2</div>
            <div className="text-xs">Difícil</div>
          </button>
          <button
            onClick={() => rateCard('good')}
            className="py-3 bg-[#22c55e]/20 text-[#22c55e] rounded-xl font-medium hover:bg-[#22c55e]/30 transition-all"
          >
            <div className="text-lg">3</div>
            <div className="text-xs">Bom</div>
          </button>
          <button
            onClick={() => rateCard('easy')}
            className="py-3 bg-[#0ea5e9]/20 text-[#0ea5e9] rounded-xl font-medium hover:bg-[#0ea5e9]/30 transition-all"
          >
            <div className="text-lg">4</div>
            <div className="text-xs">Fácil</div>
          </button>
        </motion.div>
      )}
    </div>
  );
}

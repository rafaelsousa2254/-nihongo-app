'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playWordAudio, playSentenceAudio } from '@/lib/speech';
import { vocabulary } from '@/data/vocabulary';

const CATEGORY_MAP: Record<string, string[]> = {
  'Saudações': ['Expression'],
  'Números': ['Number'],
  'Família': ['Family', 'Person'],
  'Comida': ['Food', 'Drink'],
  'Cores': ['Color'],
  'Tempo': ['Time', 'Date'],
  'Animais': ['Animal'],
  'Natureza': ['Nature', 'Weather'],
  'Dias da Semana': ['Day'],
  'Vocabulário Básico': ['Pronoun', 'Adverb', 'Question'],
};

const vocabData: Record<string, { word: string; reading: string; meaning: string; example?: string }[]> = {};

Object.entries(CATEGORY_MAP).forEach(([category, partsOfSpeech]) => {
  const words = vocabulary
    .filter((v) => partsOfSpeech.some((p) => v.partOfSpeech.toLowerCase().includes(p.toLowerCase())))
    .slice(0, 15)
    .map((v) => ({
      word: v.word,
      reading: v.reading,
      meaning: v.meaning,
      example: v.examples[0]?.japanese,
    }));
  vocabData[category] = words;
});

const categories = Object.keys(vocabData);

export default function VocabularyPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const items = vocabData[activeCategory].filter((item) => {
    if (!search) return true;
    return (
      item.word.includes(search) ||
      item.reading.toLowerCase().includes(search.toLowerCase()) ||
      item.meaning.includes(search)
    );
  });

  const handlePlayWord = useCallback((word: string, reading: string) => {
    setPlayingWord(word);
    playWordAudio(word, reading);
    setTimeout(() => setPlayingWord(null), 1000);
  }, []);

  const handlePlayExample = useCallback((example: string) => {
    playSentenceAudio(example);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">📚 Vocabulário</h1>
        <p className="text-[#94a3b8]">Aprenda palavras essenciais do japonês</p>
      </motion.div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar palavra..."
          className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white placeholder-[#64748b]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">🔍</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearch(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.word + item.reading}
            className="glass rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <button
              onClick={() => setExpanded(expanded === item.word ? null : item.word)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#334155]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-white">{item.word}</span>
                <span className="text-sm text-[#94a3b8]">{item.reading}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWord(item.word, item.reading);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    playingWord === item.word
                      ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]'
                      : 'text-[#64748b] hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10'
                  }`}
                >
                  🔊
                </button>
                <span className="text-[#0ea5e9] font-medium">{item.meaning}</span>
                <motion.span
                  animate={{ rotate: expanded === item.word ? 180 : 0 }}
                  className="text-[#64748b]"
                >
                  ▼
                </motion.span>
              </div>
            </button>
            <AnimatePresence>
              {expanded === item.word && item.example && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#334155]"
                >
                  <div className="px-5 py-4 bg-[#0f172a]/50 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#94a3b8]">Exemplo:</div>
                      <div className="text-lg text-white mt-1">{item.example}</div>
                    </div>
                    <button
                      onClick={() => handlePlayExample(item.example!)}
                      className="p-2 rounded-lg text-[#64748b] hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 transition-all"
                    >
                      🔊
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            <div className="text-4xl mb-3">🔍</div>
            <p>Nenhuma palavra encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

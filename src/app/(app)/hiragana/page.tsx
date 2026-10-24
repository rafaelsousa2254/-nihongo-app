'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playHiraganaAudio, playSentenceAudio } from '@/lib/speech';
import { hiragana } from '@/data/hiragana';

const hiraganaData: Record<string, { char: string; romaji: string }[]> = {
  'Básico': hiragana.filter(h => h.group === 'basic').map(h => ({ char: h.character, romaji: h.romanization })),
  'Dakuten': hiragana.filter(h => h.group === 'dakuten').map(h => ({ char: h.character, romaji: h.romanization })),
  'Handakuten': hiragana.filter(h => h.group === 'handakuten').map(h => ({ char: h.character, romaji: h.romanization })),
  'Combinados': hiragana.filter(h => h.group === 'combo').map(h => ({ char: h.character, romaji: h.romanization })),
};

const tabs = Object.keys(hiraganaData);
const filterOptions = ['Todos', 'Novos', 'Em revisão'];

export default function HiraganaPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<{ char: string; romaji: string } | null>(null);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  const items = hiraganaData[activeTab].filter((item) => {
    if (filter === 'Novos') return !learned.has(item.char);
    if (filter === 'Em revisão') return learned.has(item.char);
    return true;
  });

  const handlePlayAudio = useCallback((char: string) => {
    setPlayingChar(char);
    playHiraganaAudio(char);
    setTimeout(() => setPlayingChar(null), 800);
  }, []);

  const totalChars = Object.values(hiraganaData).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">ひらがな - Hiragana</h1>
        <p className="text-[#94a3b8]">Aprenda os caracteres básicos do japonês</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs transition-all ${
              filter === f
                ? 'bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]'
                : 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-sm text-[#94a3b8]">
          {learned.size} / {totalChars} aprendidos
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-3">
        {items.map((item, i) => (
          <motion.button
            key={item.char}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center text-2xl font-bold transition-all ${
              learned.has(item.char)
                ? 'bg-[#0ea5e9]/20 border border-[#0ea5e9]/30 text-[#0ea5e9]'
                : 'bg-[#1e293b] border border-[#334155] text-white hover:border-[#0ea5e9]'
            } ${selected?.char === item.char ? 'ring-2 ring-[#0ea5e9] neon-glow' : ''}`}
            onClick={() => {
              setSelected(item);
              handlePlayAudio(item.char);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.char}
            <span className="text-[10px] text-[#94a3b8] font-normal">{item.romaji}</span>
            {playingChar === item.char && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-[#0ea5e9]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="glass rounded-2xl p-6 flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-8xl font-bold text-[#0ea5e9] neon-glow rounded-2xl w-32 h-32 flex items-center justify-center bg-[#0f172a]">
              {selected.char}
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white">{selected.romaji}</h3>
              <p className="text-[#94a3b8] mt-1">Hiragana</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const newLearned = new Set(learned);
                    if (newLearned.has(selected.char)) newLearned.delete(selected.char);
                    else newLearned.add(selected.char);
                    setLearned(newLearned);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    learned.has(selected.char)
                      ? 'bg-[#22c55e] text-white'
                      : 'bg-[#334155] text-white hover:bg-[#0ea5e9]'
                  }`}
                >
                  {learned.has(selected.char) ? '✓ Aprendido' : 'Marcar como aprendido'}
                </button>
                <button
                  onClick={() => handlePlayAudio(selected.char)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#334155] text-white hover:bg-[#0ea5e9] transition-all flex items-center gap-2"
                >
                  🔊 Ouvir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

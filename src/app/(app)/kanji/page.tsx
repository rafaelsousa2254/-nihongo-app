'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playKanjiAudio } from '@/lib/speech';
import { kanji as kanjiDataFull, type KanjiCharacter } from '@/data/kanji';

const kanjiData = kanjiDataFull.map((k) => ({
  char: k.character,
  meaning: k.meanings[0],
  reading: [...k.onyomi, ...k.kunyomi].join('、'),
  level: k.jlptLevel,
  onyomi: k.onyomi.join(', '),
  kunyomi: k.kunyomi.join(', '),
}));

const levels = ['Todos', 'N5', 'N4', 'N3', 'N2', 'N1'];
const levelColors: Record<string, string> = {
  N5: '#22c55e', N4: '#0ea5e9', N3: '#f59e0b', N2: '#ef4444', N1: '#8b5cf6',
};

export default function KanjiPage() {
  const [activeLevel, setActiveLevel] = useState('Todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof kanjiData[0] | null>(null);
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  const filtered = kanjiData.filter((k) => {
    const matchLevel = activeLevel === 'Todos' || k.level === activeLevel;
    const matchSearch = !search || k.char.includes(search) || k.meaning.includes(search) || k.reading.includes(search);
    return matchLevel && matchSearch;
  });

  const handlePlayAudio = useCallback((char: string, reading: string) => {
    setPlayingChar(char);
    const firstReading = reading.split('、')[0];
    playKanjiAudio(char, firstReading);
    setTimeout(() => setPlayingChar(null), 1000);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">漢字 - Kanji</h1>
        <p className="text-[#94a3b8]">Aprenda os caracteres chineses no japonês</p>
      </motion.div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar kanji por caractere, significado ou leitura..."
          className="w-full px-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white placeholder-[#64748b]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">🔍</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLevel === level
                ? 'text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
            style={activeLevel === level ? { backgroundColor: levelColors[level] || '#0ea5e9' } : {}}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {filtered.map((item, i) => (
          <motion.button
            key={item.char}
            className="aspect-square rounded-xl flex flex-col items-center justify-center bg-[#1e293b] border border-[#334155] hover:border-[#0ea5e9] transition-all relative"
            onClick={() => {
              setSelected(item);
              handlePlayAudio(item.char, item.reading);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl font-bold text-white">{item.char}</span>
            <span
              className="text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${levelColors[item.level]}20`, color: levelColors[item.level] }}
            >
              {item.level}
            </span>
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
              className="glass rounded-2xl p-8 max-w-lg w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-9xl font-bold text-[#0ea5e9] neon-glow inline-block">{selected.char}</div>
                <div
                  className="inline-block ml-3 px-3 py-1 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: `${levelColors[selected.level]}20`, color: levelColors[selected.level] }}
                >
                  JLPT {selected.level}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#0f172a] rounded-lg p-4">
                  <div className="text-sm text-[#94a3b8]">Significado</div>
                  <div className="text-lg font-semibold text-white">{selected.meaning}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0f172a] rounded-lg p-4">
                    <div className="text-sm text-[#94a3b8]">On&apos;yomi (音読み)</div>
                    <div className="text-lg font-semibold text-[#0ea5e9]">{selected.onyomi}</div>
                  </div>
                  <div className="bg-[#0f172a] rounded-lg p-4">
                    <div className="text-sm text-[#94a3b8]">Kun&apos;yomi (訓読み)</div>
                    <div className="text-lg font-semibold text-[#f59e0b]">{selected.kunyomi}</div>
                  </div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-4">
                  <div className="text-sm text-[#94a3b8]">Leitura Principal</div>
                  <div className="text-lg font-semibold text-white">{selected.reading}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handlePlayAudio(selected.char, selected.reading)}
                  className="flex-1 py-3 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  🔊 Ouvir Pronúncia
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 bg-[#334155] hover:bg-[#0ea5e9] text-white rounded-lg transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

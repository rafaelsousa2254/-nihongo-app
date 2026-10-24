'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playKatakanaAudio } from '@/lib/speech';

const katakanaData: Record<string, { char: string; romaji: string }[]> = {
  'Básico': [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' },
    { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
    { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' },
    { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
    { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' },
    { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
    { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' },
    { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
    { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' },
    { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
    { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' },
    { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
    { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' },
    { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
    { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' },
    { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' },
    { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
    { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' }, { char: 'ン', romaji: 'n' },
  ],
  'Dakuten': [
    { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' },
    { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
    { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' },
    { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
    { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' },
    { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
    { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' },
    { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
  ],
  'Handakuten': [
    { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' },
    { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
  ],
  'Combinados': [
    { char: 'キャ', romaji: 'kya' }, { char: 'キュ', romaji: 'kyu' }, { char: 'キョ', romaji: 'kyo' },
    { char: 'シャ', romaji: 'sha' }, { char: 'シュ', romaji: 'shu' }, { char: 'ショ', romaji: 'sho' },
    { char: 'チャ', romaji: 'cha' }, { char: 'チュ', romaji: 'chu' }, { char: 'チョ', romaji: 'cho' },
    { char: 'ニャ', romaji: 'nya' }, { char: 'ニュ', romaji: 'nyu' }, { char: 'ニョ', romaji: 'nyo' },
    { char: 'ヒャ', romaji: 'hya' }, { char: 'ヒュ', romaji: 'hyu' }, { char: 'ヒョ', romaji: 'hyo' },
    { char: 'ミャ', romaji: 'mya' }, { char: 'ミュ', romaji: 'myu' }, { char: 'ミョ', romaji: 'myo' },
    { char: 'リャ', romaji: 'rya' }, { char: 'リュ', romaji: 'ryu' }, { char: 'リョ', romaji: 'ryo' },
  ],
};

const tabs = Object.keys(katakanaData);
const filterOptions = ['Todos', 'Novos', 'Em revisão'];

export default function KatakanaPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<{ char: string; romaji: string } | null>(null);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  const items = katakanaData[activeTab].filter((item) => {
    if (filter === 'Novos') return !learned.has(item.char);
    if (filter === 'Em revisão') return learned.has(item.char);
    return true;
  });

  const handlePlayAudio = useCallback((char: string) => {
    setPlayingChar(char);
    playKatakanaAudio(char);
    setTimeout(() => setPlayingChar(null), 800);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">カタカナ - Katakana</h1>
        <p className="text-[#94a3b8]">Caracteres para palavras estrangeiras</p>
      </motion.div>

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
          {learned.size} / {katakanaData['Básico'].length + katakanaData['Dakuten'].length + katakanaData['Handakuten'].length + katakanaData['Combinados'].length} aprendidos
        </span>
      </div>

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
              <p className="text-[#94a3b8] mt-1">Katakana</p>
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

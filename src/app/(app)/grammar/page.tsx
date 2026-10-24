'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammar } from '@/data/grammar';

const grammarData: Record<string, { pattern: string; meaning: string; explanation: string; example: string; translation: string }[]> = {};

grammar.forEach((g) => {
  if (!grammarData[g.level]) grammarData[g.level] = [];
  grammarData[g.level].push({
    pattern: g.pattern,
    meaning: g.meaning,
    explanation: g.explanation,
    example: g.examples[0]?.japanese || '',
    translation: g.examples[0]?.portuguese || '',
  });
});

const levels = Object.keys(grammarData);

export default function GrammarPage() {
  const [activeLevel, setActiveLevel] = useState(levels[0]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const items = grammarData[activeLevel];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">📖 Gramática</h1>
        <p className="text-[#94a3b8]">Padrões gramaticais do japonês por nível JLPT</p>
      </motion.div>

      {/* Level Tabs */}
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => { setActiveLevel(level); setExpanded(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLevel === level
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Grammar Items */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.pattern}
            className="glass rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#334155]/50 transition-colors"
            >
              <div className="text-left">
                <div className="text-lg font-bold text-[#0ea5e9]">{item.pattern}</div>
                <div className="text-sm text-[#94a3b8] mt-1">{item.meaning}</div>
              </div>
              <motion.span
                animate={{ rotate: expanded === i ? 180 : 0 }}
                className="text-[#64748b] text-xl"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#334155]"
                >
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-[#94a3b8] mb-1">Explicação</div>
                      <p className="text-white">{item.explanation}</p>
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-4">
                      <div className="text-sm text-[#94a3b8]">Exemplo</div>
                      <div className="text-xl text-white mt-1">{item.example}</div>
                      <div className="text-[#0ea5e9] mt-1">{item.translation}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

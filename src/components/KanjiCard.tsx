'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen } from 'lucide-react';
import Badge from './Badge';

interface KanjiReading {
  type: 'on' | 'kun';
  reading: string;
  meaning: string;
}

interface Kanji {
  character: string;
  meaning: string;
  readings: KanjiReading[];
  examples?: { word: string; reading: string; meaning: string }[];
  jlptLevel?: string;
}

interface KanjiCardProps {
  kanji: Kanji;
  expanded?: boolean;
  onClick?: () => void;
}

export default function KanjiCard({
  kanji,
  expanded: controlledExpanded,
  onClick,
}: KanjiCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;

  const handleToggle = () => {
    if (onClick) {
      onClick();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <motion.div
      layout
      onClick={handleToggle}
      className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm cursor-pointer hover:border-slate-600 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {kanji.character}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{kanji.meaning}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {kanji.readings.slice(0, 3).map((r) => (
                  <span
                    key={r.reading}
                    className="text-xs text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded"
                  >
                    {r.reading}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {kanji.jlptLevel && (
              <Badge variant="info" size="sm">
                {kanji.jlptLevel}
              </Badge>
            )}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <h4 className="text-sm font-medium text-slate-400 mb-3">
                  Leituras
                </h4>
                <div className="space-y-2">
                  {kanji.readings.map((r) => (
                    <div key={r.reading} className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          r.type === 'on'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {r.type === 'on' ? '音' : '訓'}
                      </span>
                      <span className="text-sm text-white">{r.reading}</span>
                      <span className="text-sm text-slate-400">{r.meaning}</span>
                    </div>
                  ))}
                </div>

                {kanji.examples && kanji.examples.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Exemplos
                    </h4>
                    <div className="space-y-2">
                      {kanji.examples.map((ex) => (
                        <div
                          key={ex.word}
                          className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50"
                        >
                          <span className="text-lg font-bold text-white">
                            {ex.word}
                          </span>
                          <span className="text-sm text-cyan-400">
                            {ex.reading}
                          </span>
                          <span className="text-sm text-slate-400 ml-auto">
                            {ex.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

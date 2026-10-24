'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FlashCardProps {
  front: string;
  back: string;
  reading?: string;
  example?: string;
  onRate?: (quality: 1 | 2 | 3 | 4 | 5) => void;
}

export default function FlashCard({
  front,
  back,
  reading,
  example,
  onRate,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => setIsFlipped(!isFlipped), [isFlipped]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
    if (isFlipped && onRate) {
      const keyMap: Record<string, 1 | 2 | 3 | 4 | 5> = {
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
      };
      if (keyMap[e.key]) {
        onRate(keyMap[e.key]);
      }
    }
  }, [isFlipped, onRate, handleFlip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const ratingLabels: Record<number, { label: string; color: string; key: string }> = {
    1: { label: 'Não sei', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30', key: '1' },
    2: { label: 'Difícil', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30', key: '2' },
    3: { label: 'Bom', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30', key: '3' },
    4: { label: 'Fácil', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30', key: '4' },
    5: { label: 'Perfeito', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30', key: '5' },
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="relative h-64 cursor-pointer"
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard: ${front}. Toque ou pressione Enter para ver a resposta.`}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-xl p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-5xl font-bold text-white mb-2">{front}</p>
            {reading && (
              <p className="text-lg text-cyan-400 font-medium">{reading}</p>
            )}
            <p className="text-xs text-slate-500 mt-4">Toque ou pressione Enter para ver a resposta</p>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 backdrop-blur-xl p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-3xl font-bold text-white mb-2">{back}</p>
            {example && (
              <p className="text-sm text-slate-300 text-center mt-3 italic">
                &ldquo;{example}&rdquo;
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {isFlipped && onRate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2 mt-4"
          role="group"
          aria-label="Avaliar flashcard"
        >
          {Object.entries(ratingLabels).map(([value, { label, color, key }]) => (
            <button
              key={value}
              onClick={(e) => {
                e.stopPropagation();
                onRate(Number(value) as 1 | 2 | 3 | 4 | 5);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${color}`}
              aria-label={`${label} (tecla ${key})`}
            >
              {label}
              <span className="ml-1 opacity-50">({key})</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

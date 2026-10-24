'use client';

import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';

interface KanaCardProps {
  character: string;
  romanization: string;
  isSelected?: boolean;
  onClick?: () => void;
  learned?: boolean;
  isNew?: boolean;
}

export default function KanaCard({
  character,
  romanization,
  isSelected = false,
  onClick,
  learned = false,
  isNew = false,
}: KanaCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200
        ${
          isSelected
            ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      {learned && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-400" />
        </div>
      )}

      {isNew && !learned && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400">
          NOVO
        </div>
      )}

      <p className="text-4xl font-bold text-white mb-1">{character}</p>
      <p className="text-sm text-slate-400 font-medium">{romanization}</p>

      <div className="mt-2 p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
        <Volume2 className="w-4 h-4" />
      </div>
    </motion.button>
  );
}

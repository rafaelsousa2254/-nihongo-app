'use client';

import { motion } from 'framer-motion';
import { Lock, Trophy } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface Achievement {
  title: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

export default function AchievementCard({
  achievement,
  unlocked,
}: AchievementCardProps) {
  const percentage = Math.min(
    (achievement.current / achievement.requirement) * 100,
    100
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative overflow-hidden rounded-2xl border p-5 transition-all
        ${
          unlocked
            ? 'bg-gradient-to-br from-amber-900/30 to-slate-800/80 border-amber-500/30 shadow-lg shadow-amber-500/10'
            : 'bg-slate-800/30 border-slate-700/30 opacity-70'
        }
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div
            className={`
              w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
              ${
                unlocked
                  ? 'bg-amber-500/20 shadow-inner'
                  : 'bg-slate-700/50'
              }
            `}
          >
            {unlocked ? (
              <span>{achievement.icon}</span>
            ) : (
              <Lock className="w-6 h-6 text-slate-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${unlocked ? 'text-white' : 'text-slate-400'}`}>
                {achievement.title}
              </h3>
              {unlocked && (
                <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              {achievement.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={achievement.current}
            max={achievement.requirement}
            color={unlocked ? 'amber' : 'cyan'}
            showLabel
            size="sm"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            {achievement.current}/{achievement.requirement}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'lesson' | 'achievement' | 'stat';
  gradient?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function Card({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
  gradient = false,
  children,
  className = '',
}: CardProps) {
  const variantClasses = {
    default: 'bg-slate-800/50 border-slate-700/50',
    lesson: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-cyan-500/20',
    achievement:
      'bg-gradient-to-br from-amber-900/30 to-slate-800/80 border-amber-500/20',
    stat: 'bg-slate-800/60 border-slate-700/60',
  };

  const gradientClasses = gradient
    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10'
    : '';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-sm
        ${variantClasses[variant]} ${gradientClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative p-5">
        {(Icon || title) && (
          <div className="flex items-start gap-3 mb-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            {title && (
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                {description && (
                  <p className="text-sm text-slate-400 mt-0.5">{description}</p>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  trend?: 'up' | 'down';
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  trend,
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-5">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {change !== undefined && trend && (
          <div className="flex items-center gap-1.5 mt-3">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-slate-500">vs. semana anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}

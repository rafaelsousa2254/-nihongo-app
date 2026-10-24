'use client';

import { useState, useEffect } from 'react';
import { Flame, Bell, Sun, Moon, Coins, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatNumber, getGreeting } from '@/lib/utils';

export default function Header() {
  const { user, xp, level, coins, streak, theme, toggleTheme } = useAppStore();
  const [greeting, setGreeting] = useState(() => getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const xpProgress = ((xp % 100) / 100) * 100;

  return (
    <header className="sticky top-0 z-40 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <div className="lg:hidden w-10" />

          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-white">
              {greeting}, {user?.name || 'Estudante'} 👋
            </h2>
            <p className="text-xs text-slate-400">Continue seus estudos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">{streak}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div className="w-20">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] text-slate-400">LV.{level}</span>
                <span className="text-[10px] text-cyan-400">{formatNumber(xp)} XP</span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">{formatNumber(coins)}</span>
          </div>

          <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

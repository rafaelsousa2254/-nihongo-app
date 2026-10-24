'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PracticeTimerProps {
  duration: number;
  onComplete: () => void;
  onTick?: (remaining: number) => void;
}

export default function PracticeTimer({ duration, onComplete, onTick }: PracticeTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (remaining <= 0) {
      onCompleteRef.current();
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setRemaining((prev) => {
          const next = prev - 1;
          onTickRef.current?.(next);
          if (next <= 0) {
            clearInterval(intervalRef.current!);
            setTimeout(() => onCompleteRef.current(), 0);
          }
          return next;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = duration > 0 ? remaining / duration : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - progress);

  const getColor = useCallback(() => {
    if (remaining <= 10) return '#ef4444';
    if (remaining <= 30) return '#f59e0b';
    return '#0ea5e9';
  }, [remaining]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <button
        onClick={() => setPaused((p) => !p)}
        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
      >
        {paused ? '▶ Continuar' : '⏸ Pausar'}
      </button>
    </div>
  );
}

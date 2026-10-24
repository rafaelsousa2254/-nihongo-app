'use client';

import { useMemo } from 'react';

interface WaveAnimationProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function WaveAnimation({ isPlaying, color = '#0ea5e9', barCount = 5 }: WaveAnimationProps) {
  const bars = useMemo(() =>
    Array.from({ length: barCount }).map((_, i) => ({
      height: 12 + seededRandom(i * 7 + 1) * 20,
      delay: `${i * 0.1}s`,
      animDuration: `0.${4 + i}s`,
    })),
  [barCount]);

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-150"
          style={{
            backgroundColor: color,
            height: isPlaying ? `${bar.height}px` : '4px',
            animation: isPlaying
              ? `wave ${bar.animDuration} ease-in-out infinite alternate`
              : 'none',
            animationDelay: bar.delay,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          0% {
            height: 4px;
          }
          100% {
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
}

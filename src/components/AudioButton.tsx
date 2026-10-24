'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioButtonProps {
  audioSrc?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioButton({
  audioSrc,
  label,
  size = 'md',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const playAudio = useCallback(async () => {
    if (!audioSrc) return;

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  }, [audioSrc, isPlaying]);

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={playAudio}
        disabled={!audioSrc}
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center transition-colors
          ${
            isPlaying
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:text-cyan-400 hover:border-cyan-500/30'
          }
          ${!audioSrc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Volume2 className={iconSizeClasses[size]} />
          </motion.div>
        ) : (
          <Volume2 className={iconSizeClasses[size]} />
        )}
      </motion.button>

      {label && (
        <span className="text-sm text-slate-400">{label}</span>
      )}
    </div>
  );
}

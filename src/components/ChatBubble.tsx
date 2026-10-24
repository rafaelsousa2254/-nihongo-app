'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatBubble({
  message,
  isUser,
  timestamp,
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${
            isUser
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600'
              : 'bg-slate-700 border border-slate-600'
          }
        `}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-cyan-400" />
        )}
      </div>

      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3
          ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-md'
              : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-md'
          }
        `}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p
            className={`text-[10px] mt-1.5 ${
              isUser ? 'text-white/60' : 'text-slate-500'
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
}

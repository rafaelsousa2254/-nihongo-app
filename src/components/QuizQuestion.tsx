'use client';

import { useState } from 'react';

interface QuizQuestionProps {
  question: string;
  type: 'multiple-choice' | 'text-input' | 'match-pairs';
  options?: { id: string; text: string }[];
  matchPairs?: { left: string; right: string }[];
  onAnswer: (answer: string | string[]) => void;
  showResult?: boolean;
  correctAnswer?: string | string[];
}

export default function QuizQuestion({
  question,
  type,
  options = [],
  matchPairs = [],
  onAnswer,
  showResult = false,
  correctAnswer,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleMultipleChoice = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onAnswer(textInput.trim());
  };

  const handleMatchClick = (left: string, right: string) => {
    setMatches((prev) => {
      const next = { ...prev };
      if (next[left] === right) {
        delete next[left];
      } else {
        next[left] = right;
      }
      return next;
    });
  };

  const isCorrect = (optionId: string) => {
    if (Array.isArray(correctAnswer)) return correctAnswer.includes(optionId);
    return correctAnswer === optionId;
  };

  const isTextCorrect = () => {
    if (!correctAnswer) return false;
    const answer = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
    return textInput.trim() === answer;
  };

  if (type === 'text-input') {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-white">{question}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            disabled={showResult}
            placeholder="Digite sua resposta..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {!showResult && (
            <button
              onClick={handleTextSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              ✓
            </button>
          )}
        </div>
        {showResult && (
          <div
            className={`p-3 rounded-lg text-sm ${
              isTextCorrect()
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {isTextCorrect()
              ? '✓ Correto!'
              : `✗ Resposta correta: ${Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer}`}
          </div>
        )}
      </div>
    );
  }

  if (type === 'match-pairs') {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-white">{question}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {matchPairs.map((pair) => (
              <div
                key={pair.left}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                  matches[pair.left]
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {pair.left}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {matchPairs.map((pair) => (
              <div
                key={pair.right}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                  Object.values(matches).includes(pair.right)
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
                onClick={() => {
                  const leftKey = Object.keys(matches).find((k) => matches[k] === pair.right);
                  if (leftKey) {
                    setMatches((prev) => {
                      const next = { ...prev };
                      delete next[leftKey];
                      return next;
                    });
                  }
                }}
              >
                {pair.right}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-white">{question}</p>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const correct = showResult && isCorrect(opt.id);
          const incorrect = showResult && isSelected && !isCorrect(opt.id);

          let classes = 'p-4 rounded-xl text-left transition-all cursor-pointer border ';
          if (showResult) {
            if (correct) {
              classes += 'bg-green-500/10 border-green-500/50 text-green-400';
            } else if (incorrect) {
              classes += 'bg-red-500/10 border-red-500/50 text-red-400';
            } else {
              classes += 'bg-slate-800/50 border-slate-700/50 text-slate-500';
            }
          } else if (isSelected) {
            classes += 'bg-cyan-500/20 border-cyan-500/50 text-white';
          } else {
            classes += 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80';
          }

          return (
            <button key={opt.id} onClick={() => handleMultipleChoice(opt.id)} className={classes}>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

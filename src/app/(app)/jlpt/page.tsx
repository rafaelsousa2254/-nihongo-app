'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import ScoreDisplay from '@/components/ScoreDisplay';
import PracticeTimer from '@/components/PracticeTimer';
import { vocabByLevel, grammarByLevel, kanjiByLevel, shuffleArray, type JLPTLevel, type JLPTQuestion } from '@/data/jlpt-questions';

type PracticeMode = 'vocab' | 'grammar' | 'kanji' | 'mixed';

export default function JLPTPage() {
  const [level, setLevel] = useState<JLPTLevel>('N5');
  const [mode, setMode] = useState<PracticeMode>('vocab');
  const [questions, setQuestions] = useState<JLPTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300);

  const startQuiz = (timed = false) => {
    let allQuestions: JLPTQuestion[] = [];
    if (mode === 'mixed') {
      allQuestions = [
        ...vocabByLevel[level],
        ...grammarByLevel[level],
        ...kanjiByLevel[level],
      ];
    } else if (mode === 'vocab') {
      allQuestions = vocabByLevel[level];
    } else if (mode === 'grammar') {
      allQuestions = grammarByLevel[level];
    } else {
      allQuestions = kanjiByLevel[level];
    }

    const shuffled = shuffleArray(allQuestions).slice(0, timed ? 10 : allQuestions.length);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setTestMode(timed);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
    setShowResult(true);
    if (optionIndex === questions[currentIndex].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameEnded(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleTimerComplete = () => {
    setGameEnded(true);
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (gameEnded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ScoreDisplay
          score={score}
          total={questions.length}
          percentage={percentage}
          onRetry={() => startQuiz(testMode)}
          onNext={() => {
            setGameEnded(false);
            setGameStarted(false);
          }}
        />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">JLPT Prep</h1>
          <p className="text-sm text-slate-400">Prepare-se para o exame JLPT</p>
        </div>

        {/* Level Selector */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Nível JLPT</h3>
          <div className="grid grid-cols-5 gap-3">
            {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`p-3 rounded-xl text-center font-bold transition-all border ${
                  level === l
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Modo de Prática</h3>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'vocab', label: 'Vocabulário', icon: '📚' },
              { id: 'grammar', label: 'Gramática', icon: '📖' },
              { id: 'kanji', label: 'Kanji', icon: '漢' },
              { id: 'mixed', label: 'Misto', icon: '🎯' },
            ] as const).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-xl text-center transition-all border ${
                  mode === m.id
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-sm font-medium">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timer Option */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Tempo (opcional)</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sem limite', duration: 0 },
              { label: '5 minutos', duration: 300 },
              { label: '10 minutos', duration: 600 },
            ].map((t) => (
              <button
                key={t.duration}
                onClick={() => setTimerDuration(t.duration)}
                className={`p-3 rounded-xl text-center text-sm transition-all border ${
                  timerDuration === t.duration
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => startQuiz(false)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            📝 Praticar
          </button>
          <button
            onClick={() => startQuiz(true)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            ⏱ Teste Cronometrado
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">JLPT {level}</h1>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
            {mode === 'vocab'
              ? 'Vocabulário'
              : mode === 'grammar'
              ? 'Gramática'
              : mode === 'kanji'
              ? 'Kanji'
              : 'Misto'}
          </span>
        </div>
        <span className="text-sm text-slate-400">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {testMode && timerDuration > 0 && (
        <div className="flex justify-center">
          <PracticeTimer duration={timerDuration} onComplete={handleTimerComplete} />
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < currentIndex
                ? 'bg-green-500'
                : i === currentIndex
                ? 'bg-cyan-500'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="glass rounded-2xl p-8 space-y-6">
        <p className="text-lg font-semibold text-white text-center">{current.question}</p>

        <div className="space-y-3">
          {current.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === current.correctIndex;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            let classes = 'w-full p-4 rounded-xl text-left transition-all border text-lg ';
            if (showResult) {
              if (showCorrect) {
                classes += 'bg-green-500/10 border-green-500/50 text-green-400';
              } else if (showIncorrect) {
                classes += 'bg-red-500/10 border-red-500/50 text-red-400';
              } else {
                classes += 'bg-slate-800/50 border-slate-700/50 text-slate-500';
              }
            } else {
              classes += 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80';
            }

            return (
              <button key={i} onClick={() => handleSelect(i)} className={classes}>
                <span className="font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          {currentIndex + 1 >= questions.length ? 'Ver Resultado' : 'Próxima Pergunta →'}
        </button>
      )}
    </div>
  );
}

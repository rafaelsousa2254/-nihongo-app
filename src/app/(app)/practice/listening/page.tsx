'use client';

import { useState, useCallback, useRef } from 'react';
import { SpeakJapanese, CheckVoiceSupport } from '@/lib/speech';
import ScoreDisplay from '@/components/ScoreDisplay';
import WaveAnimation from '@/components/WaveAnimation';

interface ListeningQuestion {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  options: string[];
  correctIndex: number;
}

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const questionsByDifficulty: Record<Difficulty, ListeningQuestion[]> = {
  beginner: [
    { id: 'b1', japanese: 'こんにちは', reading: 'こんにちは', meaning: 'Olá', options: ['Adeus', 'Olá', 'Obrigado', 'Desculpe'], correctIndex: 1 },
    { id: 'b2', japanese: 'ありがとう', reading: 'ありがとう', meaning: 'Obrigado', options: ['Olá', 'Adeus', 'Obrigado', 'Sim'], correctIndex: 2 },
    { id: 'b3', japanese: 'さようなら', reading: 'さようなら', meaning: 'Adeus', options: ['Adeus', 'Olá', 'Obrigado', 'Não'], correctIndex: 0 },
    { id: 'b4', japanese: 'おはよう', reading: 'おはよう', meaning: 'Bom dia', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Desculpe'], correctIndex: 1 },
    { id: 'b5', japanese: 'すみません', reading: 'すみません', meaning: 'Com licença', options: ['Obrigado', 'Olá', 'Com licença', 'Sim'], correctIndex: 2 },
    { id: 'b6', japanese: 'はい', reading: 'はい', meaning: 'Sim', options: ['Não', 'Sim', 'Talvez', 'Obrigado'], correctIndex: 1 },
    { id: 'b7', japanese: 'いいえ', reading: 'いいえ', meaning: 'Não', options: ['Sim', 'Não', 'Olá', 'Adeus'], correctIndex: 1 },
    { id: 'b8', japanese: 'おやすみ', reading: 'おやすみ', meaning: 'Boa noite (dormir)', options: ['Bom dia', 'Boa tarde', 'Boa noite', 'Adeus'], correctIndex: 2 },
  ],
  intermediate: [
    { id: 'i1', japanese: 'いただきます', reading: 'いただきます', meaning: 'Bon appétit (antes de comer)', options: ['Obrigado pela comida', 'Com licença', 'Adeus', 'Desculpe'], correctIndex: 0 },
    { id: 'i2', japanese: 'ごちそうさまでした', reading: 'ごちそうさまでした', meaning: 'Obrigado pela refeição', options: ['Bom dia', 'Obrigado pela refeição', 'Até logo', 'Com licença'], correctIndex: 1 },
    { id: 'i3', japanese: 'お願いします', reading: 'おねがいします', meaning: 'Por favor', options: ['Obrigado', 'Desculpe', 'Por favor', 'Sim'], correctIndex: 2 },
    { id: 'i4', japanese: '大丈夫', reading: 'だいじょうぶ', meaning: 'Está tudo bem', options: ['Está tudo bem', 'Obrigado', 'Não', 'Adeus'], correctIndex: 0 },
    { id: 'i5', japanese: 'やっぱり', reading: 'やっぱり', meaning: 'Na verdade / Afinal', options: ['Definitivamente', 'Na verdade', 'Talvez', 'Sempre'], correctIndex: 1 },
    { id: 'i6', japanese: '场面', reading: 'ばめん', meaning: 'Cena / Situação', options: ['Cena', 'Pessoa', 'Lugar', 'Coisa'], correctIndex: 0 },
  ],
  advanced: [
    { id: 'a1', japanese: '恐れ入りますが', reading: 'おそれいりますが', meaning: 'Com licença (formal)', options: ['Desculpe', 'Com licença (formal)', 'Obrigado', 'Por favor'], correctIndex: 1 },
    { id: 'a2', japanese: '承知しました', reading: 'しょうちしました', meaning: 'Entendido (formal)', options: ['Desculpe', 'Não sei', 'Entendido (formal)', 'Talvez'], correctIndex: 2 },
    { id: 'a3', japanese: '申し訳ございません', reading: 'もうしわけございません', meaning: 'Muito desculpe (formal)', options: ['Obrigado', 'Muito desculpe (formal)', 'Com licença', 'Sim'], correctIndex: 1 },
    { id: 'a4', japanese: 'お忙しいところ恐縮ですが', reading: 'おいそがしいところきょうしゅくですが', meaning: 'Desculpe incomodá-lo', options: ['Obrigado', 'Bom dia', 'Desculpe incomodá-lo', 'Adeus'], correctIndex: 2 },
  ],
};

export default function ListeningPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const supported = CheckVoiceSupport();

  const startGame = () => {
    const shuffled = [...questionsByDifficulty[difficulty]].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(8, shuffled.length)));
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handlePlay = () => {
    if (questions.length === 0) return;
    setIsPlaying(true);
    SpeakJapanese(questions[currentIndex].japanese);
    setTimeout(() => setIsPlaying(false), 2000);
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

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (gameEnded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ScoreDisplay
          score={score}
          total={questions.length}
          percentage={percentage}
          onRetry={startGame}
          onNext={startGame}
        />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Compreensão Auditiva</h1>
          <p className="text-sm text-slate-400">Ouça e escolha o significado correto</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Nível de Dificuldade</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-xl text-center transition-all border ${
                  difficulty === d
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-lg font-bold">
                  {d === 'beginner' ? '🟢' : d === 'intermediate' ? '🟡' : '🔴'}
                </div>
                <div className="text-sm mt-1">
                  {d === 'beginner' ? 'Iniciante' : d === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </div>
              </button>
            ))}
          </div>

          {!supported && (
            <p className="text-sm text-red-400">
              Seu navegador não suporta síntese de voz. Tente Chrome ou Edge.
            </p>
          )}

          <button
            onClick={startGame}
            disabled={!supported}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            🎧 Começar Quiz
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Compreensão Auditiva</h1>
        <span className="text-sm text-slate-400">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

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

      {/* Audio Button */}
      <div className="glass rounded-2xl p-8 text-center space-y-6">
        <p className="text-sm text-slate-400 uppercase tracking-wider">Ouça o áudio</p>

        <button
          onClick={handlePlay}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
            isPlaying
              ? 'bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 border-2 border-slate-700 hover:border-cyan-500/50'
          }`}
        >
          {isPlaying ? <WaveAnimation isPlaying={true} color="#0ea5e9" /> : '🔊'}
        </button>

        {isPlaying && <p className="text-sm text-cyan-400 animate-pulse">Reproduzindo...</p>}

        <button
          onClick={handlePlay}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          🔄 Ouvir Novamente
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((option, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = i === current.correctIndex;
          const showCorrect = showResult && isCorrect;
          const showIncorrect = showResult && isSelected && !isCorrect;

          let classes = 'w-full p-4 rounded-xl text-left transition-all border ';
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

      {/* Result feedback */}
      {showResult && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl text-center ${
              selectedOption === current.correctIndex
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <p className="font-semibold text-white">
              {selectedOption === current.correctIndex ? '✓ Correto!' : '✗ Incorreto'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {current.japanese} ({current.reading}) = {current.meaning}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            {currentIndex + 1 >= questions.length ? 'Ver Resultado' : 'Próxima Pergunta →'}
          </button>
        </div>
      )}
    </div>
  );
}

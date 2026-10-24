'use client';

import { useState } from 'react';
import { playHiraganaAudio } from '@/lib/speech';

interface WritingWord {
  id: string;
  portuguese: string;
  japanese: string;
  reading: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  strokeOrder?: number[];
}

const words: WritingWord[] = [
  { id: '1', portuguese: 'Água', japanese: 'みず', reading: 'みず', type: 'hiragana' },
  { id: '2', portuguese: 'Fogo', japanese: 'ひ', reading: 'ひ', type: 'hiragana' },
  { id: '3', portuguese: 'Árvore', japanese: 'き', reading: 'き', type: 'hiragana' },
  { id: '4', portuguese: 'Sol', japanese: 'ひ', reading: 'ひ', type: 'hiragana' },
  { id: '5', portuguese: 'Lua', japanese: 'つき', reading: 'つき', type: 'hiragana' },
  { id: '6', portuguese: 'Flor', japanese: 'はな', reading: 'はな', type: 'hiragana' },
  { id: '7', portuguese: 'Montanha', japanese: 'やま', reading: 'やま', type: 'hiragana' },
  { id: '8', portuguese: 'Rio', japanese: 'かわ', reading: 'かわ', type: 'hiragana' },
  { id: '9', portuguese: 'Céu', japanese: 'そら', reading: 'そら', type: 'hiragana' },
  { id: '10', portuguese: 'Mar', japanese: 'うみ', reading: 'うみ', type: 'hiragana' },
  { id: '11', portuguese: 'Café', japanese: 'コーヒー', reading: 'こーひー', type: 'katakana' },
  { id: '12', portuguese: 'Pão', japanese: 'パン', reading: 'ぱん', type: 'katakana' },
  { id: '13', portuguese: 'Sorvete', japanese: 'アイス', reading: 'あいす', type: 'katakana' },
  { id: '14', portuguese: 'Caneta', japanese: 'ペン', reading: 'ぺん', type: 'katakana' },
  { id: '15', portuguese: 'Roda', japanese: 'ホイール', reading: 'ほいーる', type: 'katakana' },
  { id: '16', portuguese: 'Dia', japanese: '日', reading: 'ひ', type: 'kanji' },
  { id: '17', portuguese: 'Mês', japanese: '月', reading: 'つき', type: 'kanji' },
  { id: '18', portuguese: 'Fogo', japanese: '火', reading: 'ひ', type: 'kanji' },
  { id: '19', portuguese: 'Água', japanese: '水', reading: 'みず', type: 'kanji' },
  { id: '20', portuguese: 'Árvore', japanese: '木', reading: 'き', type: 'kanji' },
  { id: '21', portuguese: 'Montanha', japanese: '山', reading: 'やま', type: 'kanji' },
  { id: '22', portuguese: 'Pessoa', japanese: '人', reading: 'ひと', type: 'kanji' },
  { id: '23', portuguese: 'Mão', japanese: '手', reading: 'て', type: 'kanji' },
  { id: '24', portuguese: 'Olho', japanese: '目', reading: 'め', type: 'kanji' },
  { id: '25', portuguese: 'Ouvido', japanese: '耳', reading: 'みみ', type: 'kanji' },
];

export default function WritingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = words[currentIndex];
  const isCorrect = userInput.trim() === current.japanese;

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setShowResult(true);
    setAttempted((a) => a + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % words.length);
    setUserInput('');
    setShowResult(false);
  };

  const handleHint = () => {
    setUserInput(current.japanese);
  };

  const handlePlay = () => {
    playHiraganaAudio(current.reading);
  };

  const typeColors = {
    hiragana: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    katakana: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    kanji: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  };

  const percentage = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Escrita</h1>
          <p className="text-sm text-slate-400">Escreva a palavra em japonês</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Sequência</div>
            <div className="text-lg font-bold text-amber-400">🔥 {streak}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Acertos</div>
            <div className="text-lg font-bold text-green-400">{percentage}%</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {words.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Word Card */}
      <div className="glass rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[current.type]}`}
          >
            {current.type === 'hiragana'
              ? 'ひらがな'
              : current.type === 'katakana'
              ? 'カタカナ'
              : '漢字'}
          </span>
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-2">Como se escreve?</p>
          <p className="text-3xl font-bold text-white">{current.portuguese}</p>
          <button
            onClick={handlePlay}
            className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            🔊 Ouvir pronúncia
          </button>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
            disabled={showResult}
            placeholder="Digite em japonês..."
            className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-2xl text-center placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-japanese"
          />

          {!showResult && (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                ✓ Verificar
              </button>
              <button
                onClick={handleHint}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                💡
              </button>
            </div>
          )}
        </div>

        {/* Result */}
        {showResult && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl text-center ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <p className="text-2xl font-bold text-white mb-1">
                {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
              </p>
              {!isCorrect && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">
                    Sua resposta: <span className="text-red-400">{userInput}</span>
                  </p>
                  <p className="text-sm text-slate-400">
                    Resposta correta:{' '}
                    <span className="text-green-400 text-lg font-bold">{current.japanese}</span>
                  </p>
                  <p className="text-xs text-slate-500">{current.reading}</p>
                </div>
              )}
              {isCorrect && (
                <p className="text-sm text-green-400/80 mt-1">{current.reading}</p>
              )}
            </div>

            {/* Stroke Order Reference */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-sm font-medium text-white mb-2">Referência de escrita</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-japanese text-white">{current.japanese}</div>
                <div className="text-sm text-slate-400">
                  <p>Leitura: {current.reading}</p>
                  <p>Tipo: {current.type}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Próxima Palavra →
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-white">{attempted}</div>
            <div className="text-xs text-slate-400">Tentadas</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">{correct}</div>
            <div className="text-xs text-slate-400">Corretas</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">🔥 {streak}</div>
            <div className="text-xs text-slate-400">Sequência</div>
          </div>
          <div>
            <div className="text-xl font-bold text-cyan-400">{percentage}%</div>
            <div className="text-xs text-slate-400">Precisão</div>
          </div>
        </div>
      </div>
    </div>
  );
}

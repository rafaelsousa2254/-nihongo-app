'use client';

import { useState, useCallback } from 'react';
import { RecognizeSpeech, SpeakJapanese, CheckVoiceSupport, calculateSimilarity } from '@/lib/speech';
import WaveAnimation from '@/components/WaveAnimation';

interface Phrase {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  furigana: string;
}

const phrases: Phrase[] = [
  { id: '1', japanese: 'こんにちは', reading: 'こんにちは', meaning: 'Olá', furigana: 'こんにちは' },
  { id: '2', japanese: 'ありがとうございます', reading: 'ありがとうございます', meaning: 'Muito obrigado', furigana: 'ありがとうございます' },
  { id: '3', japanese: 'すみません', reading: 'すみません', meaning: 'Com licença', furigana: 'すみません' },
  { id: '4', japanese: 'おはようございます', reading: 'おはようございます', meaning: 'Bom dia', furigana: 'おはようございます' },
  { id: '5', japanese: 'げんきです', reading: 'げんきです', meaning: 'Estou bem', furigana: 'げんきです' },
  { id: '6', japanese: 'はじめまして', reading: 'はじめまして', meaning: 'Prazer em conhecê-lo', furigana: 'はじめまして' },
  { id: '7', japanese: '日本語をべんきょうしています', reading: 'にほんごをべんきょうしています', meaning: 'Estou estudando japonês', furigana: 'にほんごをべんきょうしています' },
  { id: '8', japanese: 'お元気ですか', reading: 'おげんきですか', meaning: 'Como vai?', furigana: 'おげんきですか' },
  { id: '9', japanese: 'よろしくおねがいします', reading: 'よろしくおねがいします', meaning: 'Por favor, cuide de mim', furigana: 'よろしくおねがいします' },
  { id: '10', japanese: 'さようなら', reading: 'さようなら', meaning: 'Adeus', furigana: 'さようなら' },
];

export default function PronunciationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  const supported = CheckVoiceSupport();
  const current = phrases[currentIndex];

  const handleRecord = useCallback(async () => {
    if (!supported) {
      setError('Reconhecimento de fala não suportado neste navegador.');
      return;
    }
    setError('');
    setIsRecording(true);
    setRecognizedText('');
    setShowResult(false);

    try {
      const text = await RecognizeSpeech();
      setRecognizedText(text);
      const similarity = calculateSimilarity(current.japanese, text);
      setScore(similarity);
      setAttempted((a) => a + 1);
      setTotalScore((t) => t + similarity);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reconhecer fala');
    } finally {
      setIsRecording(false);
    }
  }, [current, supported]);

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % phrases.length);
    setRecognizedText('');
    setScore(0);
    setShowResult(false);
    setError('');
  };

  const handleListen = () => {
    SpeakJapanese(current.japanese);
  };

  const avgScore = attempted > 0 ? Math.round(totalScore / attempted) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fonética</h1>
          <p className="text-sm text-slate-400">Pratique a pronúncia de frases japonesas</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Pontuação Média</div>
          <div className="text-xl font-bold text-cyan-400">{avgScore}%</div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {phrases.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Current Phrase */}
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <div className="text-xs text-slate-500 uppercase tracking-wider">
          {currentIndex + 1} / {phrases.length}
        </div>

        <div>
          <p className="text-4xl font-bold text-white mb-2">{current.japanese}</p>
          <p className="text-lg text-cyan-400">{current.reading}</p>
          <p className="text-sm text-slate-400 mt-1">{current.meaning}</p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleListen}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            🔊 Ouvir Exemplo
          </button>
        </div>

        {/* Recording Button */}
        <div className="pt-4">
          <button
            onClick={handleRecord}
            disabled={isRecording || !supported}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
              isRecording
                ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105'
            } disabled:opacity-50`}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          {isRecording && (
            <div className="mt-3">
              <WaveAnimation isPlaying={true} />
              <p className="text-sm text-slate-400 mt-2">Ouvindo...</p>
            </div>
          )}
        </div>

        {!supported && (
          <p className="text-sm text-red-400">
            Seu navegador não suporta reconhecimento de fala. Tente Chrome ou Edge.
          </p>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {/* Result */}
      {showResult && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Resultado</h3>
            <span
              className={`text-2xl font-bold ${
                score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              {score}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Original:</span>
              <span className="text-white">{current.japanese}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Reconhecido:</span>
              <span
                className={
                  recognizedText === current.japanese ? 'text-green-400' : 'text-yellow-400'
                }
              >
                {recognizedText || '(nenhum texto reconhecido)'}
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Próxima Frase →
          </button>
        </div>
      )}

      {/* Stats */}
      {attempted > 0 && (
        <div className="glass rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">{attempted}</div>
              <div className="text-xs text-slate-400">Praticadas</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">{avgScore}%</div>
              <div className="text-xs text-slate-400">Média</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">
                {phrases.filter((_, i) => i < currentIndex).length}/{phrases.length}
              </div>
              <div className="text-xs text-slate-400">Progresso</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import ScoreDisplay from '@/components/ScoreDisplay';

type QuestionType = 'multiple-choice' | 'text-input' | 'match-pairs';

interface QuizQuestionData {
  id: string;
  type: QuestionType;
  question: string;
  options?: { id: string; text: string }[];
  matchPairs?: { left: string; right: string }[];
  correctAnswer: string | string[];
}

const questions: QuizQuestionData[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Como se diz "obrigado" em japonês?',
    options: [
      { id: 'a', text: 'すみません' },
      { id: 'b', text: 'ありがとうございます' },
      { id: 'c', text: 'こんにちは' },
      { id: 'd', text: 'さようなら' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '2',
    type: 'text-input',
    question: 'Escreva "bom dia" em hiragana:',
    correctAnswer: 'おはようございます',
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'Qual kanji significa "pessoa"?',
    options: [
      { id: 'a', text: '山' },
      { id: 'b', text: '川' },
      { id: 'c', text: '人' },
      { id: 'd', text: '木' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '4',
    type: 'match-pairs',
    question: 'Conecte o kanji ao significado:',
    matchPairs: [
      { left: '山', right: 'Montanha' },
      { left: '川', right: 'Rio' },
      { left: '火', right: 'Fogo' },
      { left: '水', right: 'Água' },
    ],
    correctAnswer: ['山-Montanha', '川-Rio', '火-Fogo', '水-Água'],
  },
  {
    id: '5',
    type: 'text-input',
    question: 'Como se diz "obrigado" (formal) em hiragana?',
    correctAnswer: 'ありがとうございます',
  },
  {
    id: '6',
    type: 'multiple-choice',
    question: 'Qual é a partícula correta? "私は学生___"',
    options: [
      { id: 'a', text: 'を' },
      { id: 'b', text: 'に' },
      { id: 'c', text: 'です' },
      { id: 'd', text: 'で' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '7',
    type: 'multiple-choice',
    question: 'Qual palavra significa "livro"?',
    options: [
      { id: 'a', text: '紙' },
      { id: 'b', text: '本' },
      { id: 'c', text: 'ペン' },
      { id: 'd', text: '辞書' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '8',
    type: 'text-input',
    question: 'Escreva "adeus" em hiragana:',
    correctAnswer: 'さようなら',
  },
  {
    id: '9',
    type: 'multiple-choice',
    question: 'Como se diz "eu" em japonês?',
    options: [
      { id: 'a', text: 'あなた' },
      { id: 'b', text: '彼' },
      { id: 'c', text: '私' },
      { id: 'd', text: '先生' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '10',
    type: 'match-pairs',
    question: 'Conecte a expressão ao significado:',
    matchPairs: [
      { left: 'おはよう', right: 'Bom dia' },
      { left: 'こんにちは', right: 'Olá' },
      { left: 'こんばんは', right: 'Boa noite' },
      { left: 'さようなら', right: 'Adeus' },
    ],
    correctAnswer: ['おはよう-Bom dia', 'こんにちは-Olá', 'こんばんは-Boa noite', 'さようなら-Adeus'],
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const startQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setGameStarted(true);
    setGameEnded(false);
    setShowResult(false);
  };

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: answer }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameEnded(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setShowResult(false);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (!answer) return;
      if (Array.isArray(q.correctAnswer)) {
        if (Array.isArray(answer) && answer.length === q.correctAnswer.length) {
          const sorted1 = [...answer].sort();
          const sorted2 = [...q.correctAnswer].sort();
          if (sorted1.every((v, i) => v === sorted2[i])) correct++;
        }
      } else {
        if (answer === q.correctAnswer) correct++;
      }
    });
    return correct;
  };

  const score = getScore();
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (gameEnded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ScoreDisplay
          score={score}
          total={questions.length}
          percentage={percentage}
          onRetry={startQuiz}
          onNext={() => {
            setGameEnded(false);
            setGameStarted(false);
          }}
        />

        {/* Review */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Revisão</h3>
          {questions.map((q, i) => {
            const answer = answers[q.id];
            let isCorrect = false;
            if (answer) {
              if (Array.isArray(q.correctAnswer)) {
                const sorted1 = [...(answer as string[])].sort();
                const sorted2 = [...q.correctAnswer].sort();
                isCorrect = sorted1.every((v, i) => v === sorted2[i]);
              } else {
                isCorrect = answer === q.correctAnswer;
              }
            }
            return (
              <div
                key={q.id}
                className={`p-3 rounded-lg border ${
                  isCorrect
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-white">{q.question}</p>
                    {!isCorrect && (
                      <p className="text-xs text-slate-400 mt-1">
                        Resposta correta:{' '}
                        {Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join(', ')
                          : q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quiz Geral</h1>
          <p className="text-sm text-slate-400">Teste seus conhecimentos de japonês</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Tipos de Perguntas</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>📝 Múltipla escolha - Respostas corretas</p>
            <p>✏️ Digitar resposta - Escreva em japonês</p>
            <p>🔗 Conectar pares - Associe conceitos</p>
          </div>
          <div className="pt-2">
            <p className="text-sm text-slate-400">
              Total: {questions.length} perguntas
            </p>
          </div>
          <button
            onClick={startQuiz}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            🎯 Começar Quiz
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Quiz Geral</h1>
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

      {/* Question */}
      <div className="glass rounded-2xl p-8">
        <QuizQuestion
          question={current.question}
          type={current.type}
          options={current.options}
          matchPairs={current.matchPairs}
          correctAnswer={current.correctAnswer}
          onAnswer={handleAnswer}
          showResult={showResult}
        />
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

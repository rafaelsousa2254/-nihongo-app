'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeakJapanese, CheckVoiceSupport } from '@/lib/speech';

type ActivityType = 'match' | 'fill' | 'order' | 'listen';

interface MatchItem {
  id: string;
  japanese: string;
  portuguese: string;
}

interface FillItem {
  id: string;
  sentence: string;
  blank: string;
  answer: string;
  options: string[];
}

interface OrderItem {
  id: string;
  words: string[];
  correctOrder: string[];
  meaning: string;
}

interface ListenItem {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
}

const matchItems: MatchItem[] = [
  { id: '1', japanese: '猫', portuguese: 'Gato' },
  { id: '2', japanese: '犬', portuguese: 'Cachorro' },
  { id: '3', japanese: '鳥', portuguese: 'Pássaro' },
  { id: '4', japanese: '魚', portuguese: 'Peixe' },
  { id: '5', japanese: '花', portuguese: 'Flor' },
  { id: '6', japanese: '木', portuguese: 'Árvore' },
];

const fillItems: FillItem[] = [
  { id: '1', sentence: '私は___です。', blank: '___', answer: '学生', options: ['先生', '学生', '医生', '鳥'] },
  { id: '2', sentence: 'これ___何ですか？', blank: '___', answer: 'は', options: ['は', 'が', 'を', 'に'] },
  { id: '3', sentence: '日本語___べんきょうします。', blank: '___', answer: 'を', options: ['は', 'が', 'を', 'で'] },
  { id: '4', sentence: '明天___学校に行きます。', blank: '___', answer: 'に', options: ['に', 'で', 'を', 'は'] },
  { id: '5', sentence: 'お茶___飲みます。', blank: '___', answer: 'を', options: ['は', 'が', 'を', 'に'] },
];

const orderItems: OrderItem[] = [
  { id: '1', words: ['わたし', 'は', 'がくせい', 'です'], correctOrder: ['わたし', 'は', 'がくせい', 'です'], meaning: 'Eu sou estudante' },
  { id: '2', words: ['これ', 'は', 'ほん', 'です'], correctOrder: ['これ', 'は', 'ほん', 'です'], meaning: 'Isto é um livro' },
  { id: '3', words: ['にほんご', 'を', 'べんきょう', 'します'], correctOrder: ['にほんご', 'を', 'べんきょう', 'します'], meaning: 'Estudo japonês' },
  { id: '4', words: ['にわ', 'に', 'き', 'が', 'ある'], correctOrder: ['にわ', 'に', 'き', 'が', 'ある'], meaning: 'Tem árvore no jardim' },
];

const listenItems: ListenItem[] = [
  { id: '1', japanese: 'おはようございます', reading: 'おはようございます', meaning: 'Bom dia (formal)' },
  { id: '2', japanese: 'こんにちは', reading: 'こんにちは', meaning: 'Olá (dia)' },
  { id: '3', japanese: 'こんばんは', reading: 'こんばんは', meaning: 'Boa noite (saudação)' },
  { id: '4', japanese: 'ありがとうございます', reading: 'ありがとうございます', meaning: 'Muito obrigado' },
  { id: '5', japanese: 'さようなら', reading: 'さようなら', meaning: 'Adeus' },
  { id: '6', japanese: 'がんばって', reading: 'がんばって', meaning: 'Boa sorte / Force' },
];

export default function ActivitiesPage() {
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);

  const voiceSupported = CheckVoiceSupport();

  const activities = [
    { id: 'match' as ActivityType, icon: '🔗', title: 'Associar', desc: 'Conecte japonês ao português', color: '#0ea5e9' },
    { id: 'fill' as ActivityType, icon: '✏️', title: 'Preencher', desc: 'Complete as frases', color: '#22c55e' },
    { id: 'order' as ActivityType, icon: '📋', title: 'Ordem', desc: 'Organize as palavras', color: '#f59e0b' },
    { id: 'listen' as ActivityType, icon: '👂', title: 'Ouvir', desc: 'Escute e identifique', color: '#8b5cf6' },
  ];

  if (!activeActivity) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Atividades</h1>
          <p className="text-[#94a3b8]">Pratique japonês com exercícios interativos</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity) => (
            <motion.button
              key={activity.id}
              onClick={() => setActiveActivity(activity.id)}
              className="glass rounded-xl p-6 text-left hover:bg-[#334155] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-3">{activity.icon}</div>
              <div className="font-semibold text-white">{activity.title}</div>
              <div className="text-sm text-[#94a3b8] mt-1">{activity.desc}</div>
            </motion.button>
          ))}
        </div>

        {score > 0 && (
          <div className="glass rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#0ea5e9]">{score}</div>
                <div className="text-xs text-[#94a3b8]">Pontos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#22c55e]">{completed}</div>
                <div className="text-xs text-[#94a3b8]">Completados</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveActivity(null)}
          className="text-[#0ea5e9] hover:text-[#38bdf8] transition-colors flex items-center gap-2"
        >
          ← Voltar
        </button>
        <div className="text-sm text-[#94a3b8]">
          {score} pontos
        </div>
      </div>

      {activeActivity === 'match' && (
        <MatchGame onComplete={() => { setScore(s => s + 10); setCompleted(c => c + 1); }} />
      )}
      {activeActivity === 'fill' && (
        <FillGame onComplete={() => { setScore(s => s + 10); setCompleted(c => c + 1); }} />
      )}
      {activeActivity === 'order' && (
        <OrderGame onComplete={() => { setScore(s => s + 10); setCompleted(c => c + 1); }} />
      )}
      {activeActivity === 'listen' && (
        <ListenGame onComplete={() => { setScore(s => s + 10); setCompleted(c => c + 1); }} voiceSupported={voiceSupported} />
      )}
    </div>
  );
}

function MatchGame({ onComplete }: { onComplete: () => void }) {
  const [selectedJP, setSelectedJP] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledPT, setShuffledPT] = useState(() =>
    [...matchItems].sort(() => Math.random() - 0.5)
  );

  const handleSelectJP = (id: string) => {
    if (matched.has(id)) return;
    setSelectedJP(id);
  };

  const handleSelectPT = (pt: string) => {
    if (!selectedJP) return;
    const item = matchItems.find((m) => m.id === selectedJP);
    if (item && item.portuguese === pt) {
      const newMatched = new Set(matched);
      newMatched.add(selectedJP);
      setMatched(newMatched);
      setSelectedJP(null);
      if (newMatched.size === matchItems.length) {
        onComplete();
      }
    } else {
      setSelectedJP(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">🔗 Associar</h2>
        <p className="text-sm text-[#94a3b8]">Conecte o japonês ao português</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {matchItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectJP(item.id)}
              className={`w-full p-3 rounded-xl text-left transition-all border ${
                matched.has(item.id)
                  ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
                  : selectedJP === item.id
                  ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#0ea5e9]'
                  : 'bg-[#0f172a] border-[#334155] text-white hover:border-[#0ea5e9]'
              }`}
              disabled={matched.has(item.id)}
            >
              <span className="text-lg font-bold">{item.japanese}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {shuffledPT.map((item) => {
            const isMatched = matchItems.find(m => m.portuguese === item.portuguese && matched.has(m.id));
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPT(item.portuguese)}
                className={`w-full p-3 rounded-xl text-left transition-all border ${
                  isMatched
                    ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
                    : 'bg-[#0f172a] border-[#334155] text-white hover:border-[#0ea5e9]'
                }`}
                disabled={!!isMatched}
              >
                <span className="text-sm">{item.portuguese}</span>
              </button>
            );
          })}
        </div>
      </div>

      {matched.size === matchItems.length && (
        <motion.div
          className="glass rounded-xl p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-[#22c55e] font-semibold">✓ Parabéns! Todas associadas!</p>
        </motion.div>
      )}
    </div>
  );
}

function FillGame({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const current = fillItems[currentIndex];

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    if (option === current.answer) {
      onComplete();
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % fillItems.length);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">✏️ Preencher</h2>
        <p className="text-sm text-[#94a3b8]">Complete a lacuna com a palavra correta</p>
      </div>

      <div className="flex items-center gap-2">
        {fillItems.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-[#0ea5e9]' : 'bg-[#334155]'
            }`}
          />
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="text-center">
          <p className="text-xs text-[#94a3b8] mb-2">{currentIndex + 1} / {fillItems.length}</p>
          <p className="text-2xl font-bold text-white">{current.sentence}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 rounded-xl text-center transition-all border ${
                showResult
                  ? option === current.answer
                    ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]'
                    : option === selected
                    ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
                    : 'bg-[#0f172a] border-[#334155] text-[#64748b]'
                  : 'bg-[#0f172a] border-[#334155] text-white hover:border-[#0ea5e9]'
              }`}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className={`font-semibold ${selected === current.answer ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {selected === current.answer ? '✓ Correto!' : '✗ Incorreto'}
            </p>
            <button
              onClick={handleNext}
              className="mt-3 px-6 py-2 rounded-xl bg-[#0ea5e9] text-white font-medium hover:bg-[#38bdf8] transition-all"
            >
              Próxima →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OrderGame({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = orderItems[currentIndex];

  useState(() => {
    setAvailable([...current.words].sort(() => Math.random() - 0.5));
  });

  const handleSelect = (word: string) => {
    if (showResult) return;
    setSelected((s) => [...s, word]);
    setAvailable((a) => a.filter((w) => w !== word));
  };

  const handleRemove = (word: string) => {
    if (showResult) return;
    setSelected((s) => s.filter((w) => w !== word));
    setAvailable((a) => [...a, word]);
  };

  const handleCheck = () => {
    setShowResult(true);
    const isCorrect = JSON.stringify(selected) === JSON.stringify(current.correctOrder);
    if (isCorrect) onComplete();
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % orderItems.length;
    setCurrentIndex(nextIndex);
    setSelected([]);
    setAvailable([...orderItems[nextIndex].words].sort(() => Math.random() - 0.5));
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">📋 Ordem das Palavras</h2>
        <p className="text-sm text-[#94a3b8]">Organize as palavras para formar a frase</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="text-center">
          <p className="text-xs text-[#94a3b8] mb-2">{currentIndex + 1} / {orderItems.length}</p>
          <p className="text-sm text-[#94a3b8]">{current.meaning}</p>
        </div>

        {/* Selected words */}
        <div className="min-h-[60px] p-3 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-wrap gap-2">
          {selected.length === 0 && (
            <span className="text-[#64748b] text-sm">Clique nas palavras na ordem correta...</span>
          )}
          {selected.map((word, i) => (
            <button
              key={i}
              onClick={() => handleRemove(word)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showResult
                  ? word === current.correctOrder[i]
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                    : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                  : 'bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30 hover:bg-[#ef4444]/20 hover:text-[#ef4444]'
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Available words */}
        <div className="flex flex-wrap gap-2 justify-center">
          {available.map((word, i) => (
            <button
              key={i}
              onClick={() => handleSelect(word)}
              className="px-4 py-2 rounded-xl bg-[#1e293b] border border-[#334155] text-white hover:border-[#0ea5e9] transition-all"
            >
              {word}
            </button>
          ))}
        </div>

        {!showResult && selected.length > 0 && (
          <button
            onClick={handleCheck}
            className="w-full py-3 rounded-xl bg-[#0ea5e9] text-white font-medium hover:bg-[#38bdf8] transition-all"
          >
            Verificar
          </button>
        )}

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <p className={`font-semibold ${
              JSON.stringify(selected) === JSON.stringify(current.correctOrder) ? 'text-[#22c55e]' : 'text-[#ef4444]'
            }`}>
              {JSON.stringify(selected) === JSON.stringify(current.correctOrder)
                ? '✓ Correto!'
                : `✗ Correto: ${current.correctOrder.join(' ')}`
              }
            </p>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-xl bg-[#0ea5e9] text-white font-medium hover:bg-[#38bdf8] transition-all"
            >
              Próxima →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ListenGame({ onComplete, voiceSupported }: { onComplete: () => void; voiceSupported: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = listenItems[currentIndex];
  const options = [current.meaning, listenItems[(currentIndex + 1) % listenItems.length].meaning, listenItems[(currentIndex + 2) % listenItems.length].meaning].sort(() => Math.random() - 0.5);

  const handlePlay = () => {
    if (!voiceSupported) return;
    setIsPlaying(true);
    SpeakJapanese(current.japanese);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelected(optionIndex);
    setShowResult(true);
    if (options[optionIndex] === current.meaning) {
      onComplete();
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % listenItems.length);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">👂 Ouvir e Identificar</h2>
        <p className="text-sm text-[#94a3b8]">Ouça e escolha o significado correto</p>
      </div>

      <div className="flex items-center gap-2">
        {listenItems.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-[#8b5cf6]' : 'bg-[#334155]'
            }`}
          />
        ))}
      </div>

      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <p className="text-xs text-[#94a3b8]">{currentIndex + 1} / {listenItems.length}</p>

        <button
          onClick={handlePlay}
          disabled={!voiceSupported}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto transition-all ${
            isPlaying
              ? 'bg-[#8b5cf6]/20 border-2 border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20'
              : 'bg-[#0f172a] border-2 border-[#334155] hover:border-[#8b5cf6]/50'
          } disabled:opacity-50`}
        >
          {isPlaying ? '🔊' : '🎧'}
        </button>

        {!voiceSupported && (
          <p className="text-xs text-[#ef4444]">Navegador não suporta áudio</p>
        )}

        <button
          onClick={handlePlay}
          className="text-sm text-[#94a3b8] hover:text-white transition-colors"
        >
          🔄 Ouvir Novamente
        </button>
      </div>

      <div className="space-y-3">
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = option === current.meaning;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 rounded-xl text-left transition-all border ${
                showResult
                  ? isCorrect
                    ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]'
                    : isSelected
                    ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
                    : 'bg-[#0f172a] border-[#334155] text-[#64748b]'
                  : 'bg-[#0f172a] border-[#334155] text-white hover:border-[#8b5cf6]'
              }`}
              disabled={showResult}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <p className={`font-semibold ${
            options[selected!] === current.meaning ? 'text-[#22c55e]' : 'text-[#ef4444]'
          }`}>
            {options[selected!] === current.meaning ? '✓ Correto!' : '✗ Incorreto'}
          </p>
          <p className="text-sm text-[#94a3b8]">
            {current.japanese} ({current.reading}) = {current.meaning}
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-[#0ea5e9] text-white font-medium hover:bg-[#38bdf8] transition-all"
          >
            Próxima →
          </button>
        </motion.div>
      )}
    </div>
  );
}

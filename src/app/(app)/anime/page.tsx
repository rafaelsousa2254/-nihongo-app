'use client';

import { useState } from 'react';
import { playWordAudio } from '@/lib/speech';

type Category = 'all' | 'greetings' | 'slang' | 'emotional' | 'fighting' | 'friendship';

interface AnimeExpression {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  whenToUse: string;
  formal: boolean;
  category: Category;
  examples: string[];
}

const expressions: AnimeExpression[] = [
  // Greetings
  {
    id: 'g1', japanese: 'やあ', reading: 'やあ', meaning: 'Olá (informal)',
    whenToUse: 'Entre amigos, casual', formal: false, category: 'greetings',
    examples: ['やあ、元気？', 'やあ、久しぶり！'],
  },
  {
    id: 'g2', japanese: 'お疲れ様です', reading: 'おつかれさまです', meaning: 'Bom trabalho / Até logo',
    whenToUse: 'No trabalho, escola, entre colegas', formal: true, category: 'greetings',
    examples: ['お疲れ様です、明日もよろしく。', 'お疲れ様！今日も大変だったね。'],
  },
  {
    id: 'g3', japanese: 'ただいま', reading: 'ただいま', meaning: 'Cheguei (em casa)',
    whenToUse: 'Ao voltar para casa', formal: false, category: 'greetings',
    examples: ['ただいま！', 'ただいま、お母さん。'],
  },
  {
    id: 'g4', japanese: 'いってきます', reading: 'いってきます', meaning: 'Vou sair / Volto logo',
    whenToUse: 'Ao sair de casa', formal: false, category: 'greetings',
    examples: ['いってきます！', 'いってらっしゃい！'],
  },

  // Slang
  {
    id: 's1', japanese: 'やばい', reading: 'やばい', meaning: 'Incrível / Perigoso /legal',
    whenToUse: 'Expressar surpresa, algo impressionante', formal: false, category: 'slang',
    examples: ['やばい、これ最高！', 'やばい、間に合わない！'],
  },
  {
    id: 's2', japanese: 'マジで', reading: 'マジで', meaning: 'Sério / De verdade',
    whenToUse: 'Enfatizar verdade', formal: false, category: 'slang',
    examples: ['マジで？本当？', 'マジでありがとう！'],
  },
  {
    id: 's3', japanese: 'ウザい', reading: 'ウザい', meaning: 'Chato / Irritante',
    whenToUse: 'Algo ou alguém incomodando', formal: false, category: 'slang',
    examples: ['あの人の話、ウザい。', 'もうウザい、やめて！'],
  },
  {
    id: 's4', japanese: 'エモい', reading: 'エモい', meaning: 'Emocionante / Bonito demais',
    whenToUse: 'Algo esteticamente agradável', formal: false, category: 'slang',
    examples: ['この景色、エモい！', 'エモい曲だね。'],
  },

  // Emotional
  {
    id: 'e1', japanese: 'がんばれ', reading: 'がんばれ', meaning: 'Você consegue! / Força!',
    whenToUse: 'Incentivar alguém', formal: false, category: 'emotional',
    examples: ['試験、がんばれ！', 'がんばれ、大丈夫だよ。'],
  },
  {
    id: 'e2', japanese: '信じられない', reading: 'しんじられない', meaning: 'Não acredito!',
    whenToUse: 'Surpresa ou choque', formal: false, category: 'emotional',
    examples: ['信じられない、本当？', '信じられないほど優しい。'],
  },
  {
    id: 'e3', japanese: '嬉しい', reading: 'うれしい', meaning: 'Fel / contente',
    whenToUse: 'Expressar alegria', formal: false, category: 'emotional',
    examples: ['嬉しい、ありがとう！', '本当に嬉しいです。'],
  },
  {
    id: 'e4', japanese: '悲しい', reading: 'かなしい', meaning: 'Triste',
    whenToUse: 'Expressar tristeza', formal: false, category: 'emotional',
    examples: ['悲しい、泣きたい。', '悲しい映画だった。'],
  },

  // Fighting
  {
    id: 'f1', japanese: 'いくぞ', reading: 'いくぞ', meaning: 'Vamos lá! / Vamos!',
    whenToUse: 'Antes de começar algo, lutar', formal: false, category: 'fighting',
    examples: ['いくぞ、みんな！', 'いくぞ、勝つ！'],
  },
  {
    id: 'f2', japanese: 'やる気', reading: 'やるき', meaning: 'Motivação / Vontade',
    whenToUse: 'Falar sobre motivação', formal: false, category: 'fighting',
    examples: ['やる気がある！', 'やる気がない...'],
  },
  {
    id: 'f3', japanese: '력내', reading: 'りょくない', meaning: 'Sem força / Fraco',
    whenToUse: 'Não ter energia', formal: false, category: 'fighting',
    examples: ['力ない、疲れた。', '力ないで戦えない。'],
  },
  {
    id: 'f4', japanese: '一撃', reading: 'いちげき', meaning: 'Um golpe',
    whenToUse: 'Em batalhas, lutas', formal: false, category: 'fighting',
    examples: ['一撃で倒す！', '必殺の一撃！'],
  },

  // Friendship
  {
    id: 'fr1', japanese: '仲間', reading: 'なかま', meaning: 'Amigo / Companheiro',
    whenToUse: 'Falar sobre amigos próximos', formal: false, category: 'friendship',
    examples: ['仲間は大切。', '仲間を助けに行く！'],
  },
  {
    id: 'fr2', japanese: '絆', reading: 'きずな', meaning: 'Laço / Conexão',
    whenToUse: 'Falar sobre laços fortes', formal: false, category: 'friendship',
    examples: ['絆は強い。', 'この絆は永遠だ。'],
  },
  {
    id: 'fr3', japanese: '約束', reading: 'やくそく', meaning: 'Promessa',
    whenToUse: 'Fazer ou lembrar promessas', formal: false, category: 'friendship',
    examples: ['約束するよ。', '約束を守ろう。'],
  },
  {
    id: 'fr4', japanese: '一緒に', reading: 'いっしょに', meaning: 'Juntos',
    whenToUse: 'Fazer algo com outros', formal: false, category: 'friendship',
    examples: ['一緒に遊びに行こう！', '一緒に頑張ろう！'],
  },
];

const categoryLabels: Record<Category, string> = {
  all: 'Todos',
  greetings: 'Saudações',
  slang: 'Gírias',
  emotional: 'Emocional',
  fighting: 'Luta',
  friendship: 'Amizade',
};

const categoryIcons: Record<Category, string> = {
  all: '📋',
  greetings: '👋',
  slang: '😎',
  emotional: '💖',
  fighting: '⚔️',
  friendship: '🤝',
};

export default function AnimePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    selectedCategory === 'all'
      ? expressions
      : expressions.filter((e) => e.category === selectedCategory);

  const handlePlay = (e: AnimeExpression) => {
    playWordAudio(e.japanese, e.reading);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Expressões de Anime</h1>
        <p className="text-sm text-slate-400">Aprenda expressões comuns usadas em animes</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const k = key as Category;
          return (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === k
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {categoryIcons[k]} {label}
            </button>
          );
        })}
      </div>

      {/* Expressions */}
      <div className="space-y-3">
        {filtered.map((expr) => {
          const isExpanded = expandedId === expr.id;
          return (
            <div key={expr.id} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : expr.id)}
                className="w-full p-4 text-left flex items-center gap-4"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(expr);
                  }}
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg hover:bg-slate-600 transition-colors shrink-0"
                >
                  🔊
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{expr.japanese}</span>
                    {!expr.formal && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Informal
                      </span>
                    )}
                    {expr.formal && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                        Formal
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-cyan-400">{expr.reading}</div>
                  <div className="text-sm text-slate-400">{expr.meaning}</div>
                </div>

                <span className="text-slate-500 text-lg">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Quando usar
                    </p>
                    <p className="text-sm text-slate-300">{expr.whenToUse}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Exemplos em Frases
                    </p>
                    <div className="space-y-1">
                      {expr.examples.map((ex, i) => (
                        <p key={i} className="text-sm text-slate-300 pl-2 border-l border-slate-700">
                          {ex}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Categoria
                    </p>
                    <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">
                      {categoryIcons[expr.category]} {categoryLabels[expr.category]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Nenhuma expressão encontrada nesta categoria.
        </div>
      )}
    </div>
  );
}

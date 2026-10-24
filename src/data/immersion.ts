export interface ImmersionText {
  id: string
  title: string
  japanese: string
  reading: string
  portuguese: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  category: 'news' | 'manga' | 'daily' | 'song' | 'proverb'
}

export const immersionTexts: ImmersionText[] = [
  {
    id: 'nhk1',
    title: 'Notícia Simples — Clima',
    japanese: '今日はとても暑いです。日本の夏は毎年暑くなります。',
    reading: 'きょうは とても あつい です。にほん の なつ は まいにつ あつく なります。',
    portuguese: 'Hoje está muito quente. O verão do Japão fica quente todos os anos.',
    level: 'N5',
    category: 'news',
  },
  {
    id: 'nhk2',
    title: 'Notícia — Trânsito',
    japanese: '東京の電車は毎朝とても混んでいます。',
    reading: 'とうきょう の でんしゃ は まいあさ とても こんで います。',
    portuguese: 'Os trens de Tóquio estão muito lotados todas as manhãs.',
    level: 'N5',
    category: 'news',
  },
  {
    id: 'daily1',
    title: 'Frases do Dia a Dia',
    japanese: 'お元気ですか。元気です、ありがとう。',
    reading: 'おげんき ですか。げんき です、ありがとう。',
    portuguese: 'Como vai? Estou bem, obrigado.',
    level: 'N5',
    category: 'daily',
  },
  {
    id: 'daily2',
    title: 'No Restaurante',
    japanese: 'これをください。いくらですか。',
    reading: 'これ を ください。いくら ですか。',
    portuguese: 'Por favor, eu quero isso. Quanto custa?',
    level: 'N5',
    category: 'daily',
  },
  {
    id: 'daily3',
    title: 'No Convenience Store',
    japanese: '袋はいりません。レシートをください。',
    reading: 'ふくろ は いりません。レシート を ください。',
    portuguese: 'Não preciso de sacola. Por favor, me dê o recibo.',
    level: 'N4',
    category: 'daily',
  },
  {
    id: 'manga1',
    title: 'Frase de Mangá — Ação',
    japanese: '絶対に負けない！僕は最强になる！',
    reading: 'ぜったい に まけない！ぼく は さいきょう に なる！',
    portuguese: 'Não vou perder de jeito nenhum! Eu vou me tornar o mais forte!',
    level: 'N3',
    category: 'manga',
  },
  {
    id: 'manga2',
    title: 'Frase de Mangá — Amizade',
    japanese: 'お前は友達だ。ずっと一緒にいるぞ。',
    reading: 'おまえ は ともだち だ。ずっと いっしょ に いる ぞ。',
    portuguese: 'Você é meu amigo. Vamos estar juntos para sempre.',
    level: 'N3',
    category: 'manga',
  },
  {
    id: 'manga3',
    title: 'Frase de Mangá — Determinação',
    japanese: '夢を諦めるな。いつか必ず叶う。',
    reading: 'ゆめ を あきらめる な。いつか かならず かなう。',
    portuguese: 'Não desista do seu sonho. Um dia vai se realizar com certeza.',
    level: 'N3',
    category: 'manga',
  },
  {
    id: 'song1',
    title: 'Música — Letra Clássica',
    japanese: 'さくらさくら会いたいよ嫌だよ散らないで。',
    reading: 'さくら さくら あいたい よ いやだ よ ちらないで。',
    portuguese: 'Cerejeira, cerejeira, quero te ver, não, não caia.',
    level: 'N4',
    category: 'song',
  },
  {
    id: 'proverb1',
    title: 'Provérbio Japonês',
    japanese: '七転び八起き。',
    reading: 'ななころび やおき。',
    portuguese: 'Cair sete vezes, levantar oito. (Nunca desista)',
    level: 'N3',
    category: 'proverb',
  },
  {
    id: 'proverb2',
    title: 'Provérbio Japonês',
    japanese: '石の上にも三年。',
    reading: 'いし の うえ にも さんねん。',
    portuguese: 'Três anos sentado em cima de uma pedra. (Paciência é recompensada)',
    level: 'N3',
    category: 'proverb',
  },
  {
    id: 'proverb3',
    title: 'Provérbio Japonês',
    japanese: '猿も木から落ちる。',
    reading: 'さる も き から おちる。',
    portuguese: 'Até macacos caem de árvore. (Até experts erram)',
    level: 'N3',
    category: 'proverb',
  },
  {
    id: 'news1',
    title: 'Notícia — Tecnologia',
    japanese: '日本の新しい電車は時速三百キロで走ります。',
    reading: 'にほん の あたらしい でんしゃ は じそく さんびゃっキロ で はしります。',
    portuguese: 'O novo trem do Japão corre a 300 km/h.',
    level: 'N4',
    category: 'news',
  },
  {
    id: 'daily4',
    title: 'Na Farmácia',
    japanese: '頭が痛いです。熱があります。',
    reading: 'あたま が いたい です。ねつ が あります。',
    portuguese: 'Minha cabeça dói. Tenho febre.',
    level: 'N5',
    category: 'daily',
  },
  {
    id: 'daily5',
    title: 'No Hotel',
    japanese: 'チェックインお願いします。部屋の鍵をください。',
    reading: 'チェックイン おねがい します。へや の かぎ を ください。',
    portuguese: 'Check-in, por favor. Me dê a chave do quarto.',
    level: 'N4',
    category: 'daily',
  },
  {
    id: 'manga4',
    title: 'Frase de Mangá — Luta',
    japanese: '俺の仲間を傷つけるなら許さない！',
    reading: 'おれ の なかま を きずつける ならゆるさない！',
    portuguese: 'Se você machucar meus amigos, não vou perdoar!',
    level: 'N3',
    category: 'manga',
  },
]

export function getTextsByLevel(level: string): ImmersionText[] {
  if (level === 'all') return immersionTexts
  return immersionTexts.filter((t) => t.level === level)
}

export function getTextsByCategory(category: string): ImmersionText[] {
  if (category === 'all') return immersionTexts
  return immersionTexts.filter((t) => t.category === category)
}

export function getRandomText(count: number): ImmersionText[] {
  const shuffled = [...immersionTexts].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

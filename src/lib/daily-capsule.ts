import { kanji } from '@/data/kanji'
import { vocabulary } from '@/data/vocabulary'
import { grammar } from '@/data/grammar'
import { hiragana } from '@/data/hiragana'
import { calculateMasteryScore } from './mastery'

export interface DailyCapsuleItem {
  id: string
  type: 'kanji' | 'word' | 'expression' | 'curiosity' | 'challenge'
  title: string
  content: string
  reading?: string
  meaning: string
  example?: string
  trivia?: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  coinsReward: number
}

const CULTURAL_CURIOSITIES = [
  { title: 'Origem do 茶', content: 'O caractere 茶 (cha = chá) veio do chinês. No Japão, a cerimônia do chá é uma arte tradicional chamada 茶道 (sadō).', difficulty: 'easy' as const },
  { title: 'Por que 7 cores?', content: 'O arco-íris no Japão tem 7 cores (七色 = nanairo), assim como no ocidente, mas a cultura japonesa valoriza mais as 5 cores tradicionais (五色 = goshiki).', difficulty: 'easy' as const },
  { title: 'Números da sorte', content: 'O número 7 (七 = shichi) é considerado sortudo no Japão. Já o 4 (四 = shi) pode ser evitado por soar como "morte" (死 = shi).', difficulty: 'medium' as const },
  { title: 'Origem do 花見', content: 'Hanami (花見 = ver flores) é a tradição de apreciar as flores de cerejeira. Começou no período Nara (710-794) e era originalmente apenas para a aristocracia.', difficulty: 'medium' as const },
  { title: 'O poder dos onomatopeias', content: 'O japonês tem mais de 4.500 onomatopeias! Exemplos: ザーザー (zāzā = chuva forte), ピカピカ (pikapika = brilhando), ドキドキ (dokidoki = coração acelerado).', difficulty: 'hard' as const },
  { title: 'Sistema de escrita', content: 'O japonês usa 3 sistemas de escrita: Hiragana (gramática), Katakana (palavras estrangeiras) e Kanji (conceitos). Um adulto conhece cerca de 2.000 kanji!', difficulty: 'easy' as const },
  { title: 'Expressão sazonal', content: 'Cada estação tem uma flor associada: primavera = 桜 (sakura), verão = 向日葵 (himawari), outono = 紅葉 (kōyō), inverno = 柊 (hiiragi).', difficulty: 'medium' as const },
  { title: 'Honoríficos', content: 'Os sufixos -san, -chan, -kun e -sama são honoríficos. -san é neutro, -chan é afetuoso, -kun é para jovens e -sama é formal/reverente.', difficulty: 'easy' as const },
  { title: 'Contagem em japonês', content: 'O japonês tem sistemas de contagem diferentes para cada tipo de objeto! Pessoas = 人 (nin/hito), animais = 匹 (hiki), objetos longos = 本 (hon).', difficulty: 'hard' as const },
  { title: 'O kanji mais complexo', content: 'Um dos kanji mais complexos é 鬱 (utsu = depressão), com 29 traços. Já o mais simples é 一 (ichi = um), com apenas 1 traço.', difficulty: 'medium' as const },
]

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getDailySeed(): number {
  const today = new Date()
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function getDifficulty(userLevel: number): 'easy' | 'medium' | 'hard' {
  if (userLevel <= 3) return 'easy'
  if (userLevel <= 7) return 'medium'
  return 'hard'
}

function selectKanji(rng: () => number, difficulty: 'easy' | 'medium' | 'hard'): DailyCapsuleItem | null {
  const filtered = kanji.filter((k) => {
    if (difficulty === 'easy') return k.jlptLevel === 'N5'
    if (difficulty === 'medium') return k.jlptLevel === 'N5' || k.jlptLevel === 'N4'
    return true
  })

  if (filtered.length === 0) return null
  const selected = filtered[Math.floor(rng() * filtered.length)]

  return {
    id: `daily_kanji_${getDayOfYear()}`,
    type: 'kanji',
    title: 'Kanji do Dia',
    content: selected.character,
    reading: selected.onyomi[0] || selected.kunyomi[0],
    meaning: selected.meanings[0],
    example: selected.examples[0]?.word,
    difficulty,
    xpReward: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
    coinsReward: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6,
  }
}

function selectWord(rng: () => number, difficulty: 'easy' | 'medium' | 'hard'): DailyCapsuleItem | null {
  const filtered = vocabulary.filter((v) => {
    if (difficulty === 'easy') return v.jlptLevel === 'N5'
    if (difficulty === 'medium') return v.jlptLevel === 'N5' || v.jlptLevel === 'N4'
    return true
  })

  if (filtered.length === 0) return null
  const selected = filtered[Math.floor(rng() * filtered.length)]

  return {
    id: `daily_word_${getDayOfYear()}`,
    type: 'word',
    title: 'Palavra do Dia',
    content: selected.word,
    reading: selected.reading,
    meaning: selected.meaning,
    example: selected.examples[0]?.japanese,
    difficulty,
    xpReward: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
    coinsReward: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
  }
}

function selectExpression(rng: () => number): DailyCapsuleItem {
  const expressions = vocabulary.filter((v) => v.partOfSpeech === 'Expression')
  const selected = expressions[Math.floor(rng() * expressions.length)]

  return {
    id: `daily_expr_${getDayOfYear()}`,
    type: 'expression',
    title: 'Expressão do Dia',
    content: selected.word,
    reading: selected.reading,
    meaning: selected.meaning,
    example: selected.examples[0]?.japanese,
    difficulty: 'easy',
    xpReward: 5,
    coinsReward: 1,
  }
}

function selectCuriosity(rng: () => number): DailyCapsuleItem {
  const curiosity = CULTURAL_CURIOSITIES[Math.floor(rng() * CULTURAL_CURIOSITIES.length)]

  return {
    id: `daily_curiosity_${getDayOfYear()}`,
    type: 'curiosity',
    title: curiosity.title,
    content: curiosity.content,
    meaning: '',
    trivia: curiosity.content,
    difficulty: curiosity.difficulty,
    xpReward: 5,
    coinsReward: 1,
  }
}

function selectChallenge(rng: () => number, difficulty: 'easy' | 'medium' | 'hard'): DailyCapsuleItem {
  const challenges = [
    { content: 'Escreva 5 frases usando は e です', meaning: 'Prática de estrutura básica', difficulty: 'easy' as const },
    { content: 'Leia um kanji em voz alta 3 vezes', meaning: 'Treino de pronúncia', difficulty: 'easy' as const },
    { content: 'Crie uma conversa de 3 turnos', meaning: 'Prática de conversação', difficulty: 'medium' as const },
    { content: 'Memorize 3 kanji novos', meaning: 'Desafio de memorização', difficulty: 'medium' as const },
    { content: 'Escreva um texto curto sobre seu dia', meaning: 'Prática de escrita', difficulty: 'hard' as const },
    { content: 'Assista 1 min de anime sem legenda', meaning: 'Imersão auditiva', difficulty: 'hard' as const },
  ]

  const filtered = challenges.filter((c) => c.difficulty === difficulty)
  const selected = filtered[Math.floor(rng() * filtered.length)]

  return {
    id: `daily_challenge_${getDayOfYear()}`,
    type: 'challenge',
    title: 'Desafio do Dia',
    content: selected.content,
    meaning: selected.meaning,
    difficulty,
    xpReward: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
    coinsReward: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5,
  }
}

export function generateDailyCapsule(userLevel: number = 1): DailyCapsuleItem[] {
  const seed = getDailySeed()
  const rng = seededRandom(seed)
  const difficulty = getDifficulty(userLevel)

  const kanjiItem = selectKanji(rng, difficulty)
  const wordItem = selectWord(rng, difficulty)
  const expressionItem = selectExpression(rng)
  const curiosityItem = selectCuriosity(rng)
  const challengeItem = selectChallenge(rng, difficulty)

  const items: DailyCapsuleItem[] = []
  if (kanjiItem) items.push(kanjiItem)
  if (wordItem) items.push(wordItem)
  items.push(expressionItem)
  items.push(curiosityItem)
  items.push(challengeItem)

  return items
}

const COLLECTED_KEY = 'nihongo_daily_collected'

function getCollectedDates(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(COLLECTED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCollectedDates(dates: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(COLLECTED_KEY, JSON.stringify(dates.slice(-30)))
}

export function hasCollectedToday(): boolean {
  const today = new Date().toISOString().split('T')[0]
  return getCollectedDates().includes(today)
}

export function markCollectedToday() {
  const today = new Date().toISOString().split('T')[0]
  const dates = getCollectedDates()
  if (!dates.includes(today)) {
    dates.push(today)
    saveCollectedDates(dates)
  }
}

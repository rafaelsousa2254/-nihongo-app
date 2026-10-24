export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export interface JLPTQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  type: 'vocab' | 'grammar' | 'kanji'
}

export const vocabByLevel: Record<JLPTLevel, JLPTQuestion[]> = {
  N5: [
    { id: 'v1', question: 'Qual o significado de こんにちは?', options: ['Olá', 'Adeus', 'Obrigado', 'Bom dia'], correctIndex: 0, type: 'vocab' },
    { id: 'v2', question: 'Qual o significado de 学生?', options: ['Professor', 'Estudante', 'Médico', 'Amigo'], correctIndex: 1, type: 'vocab' },
    { id: 'v3', question: 'Qual o significado de 食べます?', options: ['Beber', 'Comer', 'Ler', 'Escrever'], correctIndex: 1, type: 'vocab' },
    { id: 'v4', question: 'Qual o significado de 本?', options: ['Livro', 'Papel', 'Caneta', 'Mesa'], correctIndex: 0, type: 'vocab' },
    { id: 'v5', question: 'Qual o significado de 大きい?', options: ['Pequeno', 'Bonito', 'Grande', 'Velho'], correctIndex: 2, type: 'vocab' },
    { id: 'v6', question: 'Qual o significado de 友達?', options: ['Família', 'Professor', 'Amigo', 'Aluno'], correctIndex: 2, type: 'vocab' },
  ],
  N4: [
    { id: 'v7', question: 'Qual o significado of 勉強する?', options: ['Trabalhar', 'Estudar', 'Dormir', 'Correr'], correctIndex: 1, type: 'vocab' },
    { id: 'v8', question: 'Qual o significado de 経験?', options: ['Dinheiro', 'Tempo', 'Experiência', 'Lugar'], correctIndex: 2, type: 'vocab' },
    { id: 'v9', question: 'Qual o significado de 変わる?', options: ['Mudar', 'Voltar', 'Sair', 'Entra'], correctIndex: 0, type: 'vocab' },
    { id: 'v10', question: 'Qual o significado de 影響?', options: ['Influência', 'Problema', 'Solução', 'Resposta'], correctIndex: 0, type: 'vocab' },
  ],
  N3: [
    { id: 'v11', question: 'Qual o significado de 展開?', options: ['Desenvolvimento', 'Fim', 'Início', 'Mistério'], correctIndex: 0, type: 'vocab' },
    { id: 'v12', question: 'Qual o significado de 促進?', options: ['Atrasar', 'Promover', 'Impedir', 'Esconder'], correctIndex: 1, type: 'vocab' },
    { id: 'v13', question: 'Qual o significado de 適切?', options: ['Inadequado', 'Apropriado', 'Difícil', 'Fácil'], correctIndex: 1, type: 'vocab' },
  ],
  N2: [
    { id: 'v14', question: 'Qual o significado of 絡繹?', options: ['Ordem', 'Confusão', 'Clareza', 'Silêncio'], correctIndex: 1, type: 'vocab' },
    { id: 'v15', question: 'Qual o significado de 衰弱?', options: ['Fortalecimento', 'Fraqueza', 'Crescimento', 'Velocidade'], correctIndex: 1, type: 'vocab' },
  ],
  N1: [
    { id: 'v16', question: 'Qual o significado de 潤滑?', options: ['Seco', 'Liso/Gorduroso', 'Rough', 'Molhado'], correctIndex: 1, type: 'vocab' },
    { id: 'v17', question: 'Qual o significado de 躊躇?', options: ['Coragem', 'Hesitação', 'Pressa', 'Calma'], correctIndex: 1, type: 'vocab' },
  ],
}

export const grammarByLevel: Record<JLPTLevel, JLPTQuestion[]> = {
  N5: [
    { id: 'g1', question: 'Complete: 私は学生 ___', options: ['です', 'ます', 'から', 'けど'], correctIndex: 0, type: 'grammar' },
    { id: 'g2', question: 'Qual a partícula correta? "公園___歩きます"', options: ['を', 'に', 'で', 'は'], correctIndex: 2, type: 'grammar' },
    { id: 'g3', question: 'Qual a forma correta do verbo "comer"?', options: ['食べます', '飲みます', '行きます', '見ます'], correctIndex: 0, type: 'grammar' },
    { id: 'g4', question: '"___も" significa "também"', options: ['も', 'は', 'を', 'が'], correctIndex: 0, type: 'grammar' },
  ],
  N4: [
    { id: 'g5', question: 'Qual a forma passada de 食べます?', options: ['食べました', '食べません', '食べます', '食べたい'], correctIndex: 0, type: 'grammar' },
    { id: 'g6', question: 'Qual a partícula para objeto direto?', options: ['は', 'が', 'を', 'に'], correctIndex: 2, type: 'grammar' },
    { id: 'g7', question: '"___ように" significa "para que..."', options: ['ように', 'ために', 'けど', 'から'], correctIndex: 0, type: 'grammar' },
  ],
  N3: [
    { id: 'g8', question: 'Qual a forma polida negativa?', options: ['ません', 'ない', 'だ', 'な'], correctIndex: 0, type: 'grammar' },
    { id: 'g9', question: '"___わけにはいかない" significa "não posso..."', options: ['わけにはいかない', 'ようにする', 'ことになる', 'つもりだ'], correctIndex: 0, type: 'grammar' },
  ],
  N2: [
    { id: 'g10', question: '"___どころか" significa "longe de..."', options: ['どころか', 'ばかりか', 'にすぎない', 'わけだ'], correctIndex: 0, type: 'grammar' },
  ],
  N1: [
    { id: 'g11', question: '"___にとどまらず" significa "não se limitando a..."', options: ['にとどまらず', 'を問わず', 'にかかわらず', 'をもとに'], correctIndex: 0, type: 'grammar' },
  ],
}

export const kanjiByLevel: Record<JLPTLevel, JLPTQuestion[]> = {
  N5: [
    { id: 'k1', question: 'Qual a leitura de 山?', options: ['やま', 'かわ', 'もり', 'うみ'], correctIndex: 0, type: 'kanji' },
    { id: 'k2', question: 'Qual a leitura de 水?', options: ['ひ', 'みず', 'つち', 'そら'], correctIndex: 1, type: 'kanji' },
    { id: 'k3', question: 'Qual a leitura de 火?', options: ['みず', 'き', 'ひ', 'かわ'], correctIndex: 2, type: 'kanji' },
    { id: 'k4', question: 'Qual a leitura de 木?', options: ['き', 'ひ', 'やま', 'うみ'], correctIndex: 0, type: 'kanji' },
  ],
  N4: [
    { id: 'k5', question: 'Qual a leitura de 読む?', options: ['よむ', 'かく', 'きく', 'みる'], correctIndex: 0, type: 'kanji' },
    { id: 'k6', question: 'Qual a leitura de 書く?', options: ['よむ', 'かく', 'はなす', 'きく'], correctIndex: 1, type: 'kanji' },
  ],
  N3: [
    { id: 'k7', question: 'Qual a leitura de 展?', options: ['てん', 'せん', 'でん', 'ねん'], correctIndex: 0, type: 'kanji' },
  ],
  N2: [
    { id: 'k8', question: 'Qual a leitura of 繹?', options: ['えき', 'やく', 'しょく', 'じき'], correctIndex: 0, type: 'kanji' },
  ],
  N1: [
    { id: 'k9', question: 'Qual a leitura of 躊?', options: ['ちゅう', 'しゅう', 'とう', 'どう'], correctIndex: 0, type: 'kanji' },
  ],
}

export function getQuestionsForLevel(level: JLPTLevel, mode: string): JLPTQuestion[] {
  switch (mode) {
    case 'vocab':
      return vocabByLevel[level]
    case 'grammar':
      return grammarByLevel[level]
    case 'kanji':
      return kanjiByLevel[level]
    case 'mixed':
      return [...vocabByLevel[level], ...grammarByLevel[level], ...kanjiByLevel[level]]
    default:
      return vocabByLevel[level]
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

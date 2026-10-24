import { NextResponse } from 'next/server'
import { vocabulary } from '@/data/vocabulary'

export async function GET() {
  const data = vocabulary.map((v) => ({
    id: v.id,
    word: v.word,
    reading: v.reading,
    meaning: v.meaning,
    level: v.jlptLevel,
    category: v.partOfSpeech,
  }))
  return NextResponse.json({ vocabulary: data })
}

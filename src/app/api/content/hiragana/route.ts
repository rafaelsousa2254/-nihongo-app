import { NextResponse } from 'next/server'
import { hiragana } from '@/data/hiragana'

export async function GET() {
  const data = hiragana.map((h) => ({
    character: h.character,
    romanji: h.romanization,
    group: h.group,
  }))
  return NextResponse.json({ hiragana: data })
}

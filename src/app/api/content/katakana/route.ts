import { NextResponse } from 'next/server'
import { katakana } from '@/data/katakana'

export async function GET() {
  const data = katakana.map((k) => ({
    character: k.character,
    romanji: k.romanization,
    group: k.group,
  }))
  return NextResponse.json({ katakana: data })
}

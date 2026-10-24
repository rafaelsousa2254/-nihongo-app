import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Verificação por email desabilitada. Use registro direto.' },
    { status: 400 }
  )
}

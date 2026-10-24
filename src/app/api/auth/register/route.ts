import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Dados inválidos'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { name, password } = result.data

    const existingUser = await prisma.user.findUnique({
      where: { name },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Nome de usuário já está em uso' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        passwordHash,
      },
    })

    const token = await signToken({ userId: user.id, name: user.name })

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
      },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

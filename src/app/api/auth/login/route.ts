import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Dados inválidos'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { name, password } = result.data

    const user = await prisma.user.findUnique({
      where: { name },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      )
    }

    const valid = await comparePassword(password, user.passwordHash)

    if (!valid) {
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      )
    }

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
        totalStudyMinutes: user.totalStudyMinutes || 0,
        lastStudyDate: user.lastStudyDate?.toISOString() || null,
        avatar: user.avatar || null,
      },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

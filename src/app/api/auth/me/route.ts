import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const payload = await verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        achievements: { include: { achievement: true } },
        _count: { select: { progress: true, studySessions: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        totalStudyMinutes: user.totalStudyMinutes,
        createdAt: user.createdAt,
        achievements: user.achievements.map((ua) => ({
          id: ua.achievement.id,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          unlockedAt: ua.unlockedAt,
        })),
        stats: {
          progressCount: user._count.progress,
          sessionCount: user._count.studySessions,
        },
      },
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

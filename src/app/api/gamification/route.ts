import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: { include: { achievement: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const level = Math.floor(user.xp / 100) + 1

    const progressCount = await prisma.userProgress.count({
      where: { userId: user.id },
    })

    const allAchievements = await prisma.achievement.findMany()
    const unlockedIds = user.achievements.map((a) => a.achievementId)

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const leaderboard = await prisma.leaderboardEntry.findMany({
      where: { weekStart },
      include: { user: { select: { name: true, level: true, xp: true } } },
      orderBy: { xpEarned: 'desc' },
      take: 20,
    })

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: entry.rank || index + 1,
      name: entry.user.name,
      level: entry.user.level,
      xp: entry.xpEarned,
    }))

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let currentStreak = 0
    if (user.lastStudyDate) {
      const lastStudy = new Date(user.lastStudyDate)
      lastStudy.setHours(0, 0, 0, 0)

      const diffDays = Math.floor(
        (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays <= 1) {
        currentStreak = user.streak
      }
    }

    return NextResponse.json({
      xp: user.xp,
      level,
      coins: user.coins,
      streak: currentStreak,
      totalStudyMinutes: user.totalStudyMinutes,
      progressCount,
      achievements: allAchievements.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        unlocked: unlockedIds.includes(a.id),
      })),
      leaderboard: formattedLeaderboard,
    })
  } catch (error) {
    console.error('Gamification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

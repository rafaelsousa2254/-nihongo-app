import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateNextReview } from '@/lib/sm2'
import { progressSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const result = progressSchema.safeParse(body)
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Dados inválidos'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { contentType, contentId, quality } = result.data

    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType,
          contentId,
        },
      },
    })

    let reviewResult
    let newCorrectCount = 0
    let newIncorrectCount = 0

    if (existing) {
      reviewResult = calculateNextReview(
        {
          easeFactor: existing.easeFactor,
          interval: existing.interval,
          repetitions: existing.repetitions,
        },
        quality
      )

      newCorrectCount = existing.correctCount + (quality >= 3 ? 1 : 0)
      newIncorrectCount = existing.incorrectCount + (quality < 3 ? 1 : 0)

      await prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          easeFactor: reviewResult.easeFactor,
          interval: reviewResult.interval,
          repetitions: reviewResult.repetitions,
          nextReview: reviewResult.nextReview,
          correctCount: newCorrectCount,
          incorrectCount: newIncorrectCount,
          lastReviewedAt: new Date(),
        },
      })
    } else {
      reviewResult = calculateNextReview(
        { easeFactor: 2.5, interval: 0, repetitions: 0 },
        quality
      )

      newCorrectCount = quality >= 3 ? 1 : 0
      newIncorrectCount = quality < 3 ? 1 : 0

      await prisma.userProgress.create({
        data: {
          userId,
          contentType,
          contentId,
          easeFactor: reviewResult.easeFactor,
          interval: reviewResult.interval,
          repetitions: reviewResult.repetitions,
          nextReview: reviewResult.nextReview,
          correctCount: newCorrectCount,
          incorrectCount: newIncorrectCount,
          lastReviewedAt: new Date(),
        },
      })
    }

    const xpEarned = quality >= 3 ? 10 + quality * 2 : 2

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpEarned },
      },
    })

    return NextResponse.json({
      nextReview: reviewResult.nextReview,
      easeFactor: reviewResult.easeFactor,
      interval: reviewResult.interval,
      xpEarned,
    })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

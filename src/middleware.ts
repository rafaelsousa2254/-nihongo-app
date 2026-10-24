import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { checkLoginRateLimit, checkRegisterRateLimit } from '@/lib/rate-limit'

const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/content/hiragana',
  '/api/content/katakana',
  '/api/content/kanji',
  '/api/content/vocabulary',
  '/api/content/grammar',
  '/api/content/conversations',
  '/api/ai/chat',
]

const PUBLIC_PAGE_PATHS = ['/']

const PROTECTED_PAGE_PREFIXES = [
  '/dashboard',
  '/hiragana',
  '/katakana',
  '/kanji',
  '/vocabulary',
  '/grammar',
  '/flashcards',
  '/conversation',
  '/practice',
  '/jlpt',
  '/settings',
  '/profile',
  '/activities',
  '/boss-battle',
  '/survival',
  '/daily-capsule',
  '/error-notebook',
  '/kanji-dna',
  '/japanese-radar',
  '/anime',
  '/focus',
]

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
      if (pathname === '/api/auth/login' || pathname.startsWith('/api/auth/login')) {
        const ip = getClientIp(request)
        if (!checkLoginRateLimit(ip)) {
          return NextResponse.json(
            { error: 'Muitas tentativas de login. Tente novamente em 1 minuto.' },
            { status: 429 }
          )
        }
      }

      if (pathname === '/api/auth/register' || pathname.startsWith('/api/auth/register')) {
        const ip = getClientIp(request)
        if (!checkRegisterRateLimit(ip)) {
          return NextResponse.json(
            { error: 'Muitas tentativas de registro. Tente novamente em 1 minuto.' },
            { status: 429 }
          )
        }
      }

      return NextResponse.next()
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const token = authHeader.split(' ')[1]
      const payload = await verifyToken(token)

      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId)
      response.headers.set('x-user-name', payload.name)
      return response
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }

  if (PUBLIC_PAGE_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  if (isProtectedPage(pathname)) {
    const token = request.cookies.get('token')?.value
    const authHeader = request.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
    const storedToken = token || bearerToken

    if (!storedToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      await verifyToken(storedToken)
      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

function getRateLimit(key: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

export function checkLoginRateLimit(ip: string): boolean {
  return getRateLimit(`login:${ip}`, 60 * 1000, 5)
}

export function checkRegisterRateLimit(ip: string): boolean {
  return getRateLimit(`register:${ip}`, 60 * 1000, 3)
}

export function getRateLimitRemaining(key: string, windowMs: number, maxRequests: number): number {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    return maxRequests
  }

  return Math.max(0, maxRequests - entry.count)
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 1000)

import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(limit: number = 10, windowMs: number = 60000) {
  return async (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    const rateLimitInfo = rateLimitMap.get(ip)
    
    if (!rateLimitInfo) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
      return null
    }
    
    if (now > rateLimitInfo.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
      return null
    }
    
    if (rateLimitInfo.count >= limit) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    rateLimitInfo.count++
    return null
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, info] of rateLimitMap.entries()) {
    if (now > info.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60000) // Clean every minute
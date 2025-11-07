import rateLimit from 'express-rate-limit';
import logger from './server-logger';

// Store for rate limiting (in production, use Redis)
export const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return (req: Request) => {
    const clientIP = req.headers.get('x-forwarded-for') ||
                    req.headers.get('x-real-ip') ||
                    'unknown';

    const key = `${clientIP}-${req.url}`;
    const now = Date.now();
    const windowMs = options.windowMs;
    const max = options.max;

    const existing = rateLimitStore.get(key);

    if (!existing || now > existing.resetTime) {
      // Reset or new entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow
    }

    if (existing.count >= max) {
      logger.warn(`Rate limit exceeded for ${clientIP}`, { url: req.url, count: existing.count });
      return new Response(options.message || 'Too many requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((existing.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': existing.resetTime.toString()
        }
      });
    }

    existing.count++;
    return null; // Allow
  };
};

// Pre-configured rate limiters
export const strictRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

export const generalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});
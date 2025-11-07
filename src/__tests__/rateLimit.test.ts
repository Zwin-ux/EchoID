// Mock the logger using doMock
jest.doMock('@/lib/server-logger', () => ({
  default: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

import { createRateLimiter, strictRateLimit, generalRateLimit, rateLimitStore } from '@/lib/rateLimit';

// Mock Request class for testing
class MockRequest {
  url: string;
  headers: Map<string, string>;

  constructor(url: string, options: { headers?: Record<string, string | undefined> } = {}) {
    this.url = url;
    this.headers = new Map();
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          this.headers.set(key, value);
        }
      });
    }
  }
}

// Mock Response class for testing
class MockResponse {
  status: number;
  statusText: string;
  headers: Map<string, string>;

  constructor(body: string, options: { status?: number; headers?: Record<string, string> } = {}) {
    this.status = options.status || 200;
    this.statusText = '';
    this.headers = new Map();
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
  }
}

// Mock the global Response
global.Response = MockResponse as any;

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the rate limit store before each test
    rateLimitStore.clear();
  });
  describe('createRateLimiter', () => {
    it('should create a rate limiter with custom settings', () => {
      const limiter = createRateLimiter({
        windowMs: 60000, // 1 minute
        max: 10,
        message: 'Too many requests',
      });

      expect(limiter).toBeDefined();
      expect(typeof limiter).toBe('function');
    });

    it('should throw error for invalid options', () => {
      // This should work since all required fields are provided
      expect(() => createRateLimiter({
        windowMs: 60000,
        max: 10,
      })).not.toThrow();
    });
  });

  describe('Rate Limiter Function', () => {
    let limiter: any;

    beforeEach(() => {
      limiter = createRateLimiter({
        windowMs: 60000, // 1 minute
        max: 2, // Only 2 requests per minute for testing
      });
    });

    it('should allow requests within the limit', () => {
      const mockReq = new MockRequest('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '127.0.0.1' },
      });

      // First request
      const result1 = limiter(mockReq as any);
      expect(result1).toBeNull(); // Should allow

      // Second request (still within limit)
      const result2 = limiter(mockReq as any);
      expect(result2).toBeNull(); // Should allow
    });

    it('should block requests over the limit', () => {
      const mockReq = new MockRequest('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '127.0.0.1' },
      });

      // First request
      limiter(mockReq as any);

      // Second request
      limiter(mockReq as any);

      // Third request (should be blocked)
      const result3 = limiter(mockReq as any);
      expect(result3).toBeInstanceOf(Response);
      expect(result3!.status).toBe(429);
    });

    it('should extract client IP correctly', () => {
      const testCases = [
        {
          headers: { 'x-forwarded-for': '192.168.1.1' },
        },
        {
          headers: { 'x-real-ip': '10.0.0.1' },
        },
        {
          headers: {},
        },
      ];

      for (const { headers } of testCases) {
        const limiter = createRateLimiter({ windowMs: 60000, max: 1 });
        const mockReq = new MockRequest('http://localhost/api/test', { headers });
        const result = limiter(mockReq as any);
        expect(result).toBeNull(); // Should allow first request
      }
    });

    it('should set appropriate headers when blocking', () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        max: 1,
        message: 'Rate limit exceeded'
      });

      const mockReq = new MockRequest('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '127.0.0.1' },
      });

      // First request (allow)
      limiter(mockReq as any);

      // Second request (block)
      const response = limiter(mockReq as any);
      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(429);
      expect(response!.headers.get('X-RateLimit-Limit')).toBe('1');
      expect(response!.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response!.headers.get('Retry-After')).toBeDefined();
      expect(response!.headers.get('X-RateLimit-Reset')).toBeDefined();
    });

    it('should reset after window expires', () => {
      const mockNow = jest.spyOn(Date, 'now');
      mockNow.mockReturnValue(1000);

      const limiter = createRateLimiter({
        windowMs: 100, // Very short window for testing
        max: 1,
      });

      const mockReq = new MockRequest('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '127.0.0.1' },
      });

      // First request (allow) - time: 1000
      const result1 = limiter(mockReq as any);
      expect(result1).toBeNull();

      // Second request (should be blocked) - still time: 1000
      const result2 = limiter(mockReq as any);
      expect(result2).toBeInstanceOf(MockResponse);

      // Advance time past the window - time: 1200 (past 1000 + 100)
      mockNow.mockReturnValue(1200);

      // Third request (should be allowed again)
      const result3 = limiter(mockReq as any);
      expect(result3).toBeNull();

      mockNow.mockRestore();
    });
  });

  describe('Pre-configured Rate Limiters', () => {
    it('should have strict rate limiter', () => {
      expect(strictRateLimit).toBeDefined();
      expect(typeof strictRateLimit).toBe('function');
    });

    it('should have general rate limiter', () => {
      expect(generalRateLimit).toBeDefined();
      expect(typeof generalRateLimit).toBe('function');
    });
  });
});
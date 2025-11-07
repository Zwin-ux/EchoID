import { RedisCache, cacheKeys, CACHE_TTL } from '@/lib/redis';

// Mock the logger
jest.mock('@/lib/server-logger', () => ({
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    on: jest.fn(),
  })),
}));

describe('Redis Cache', () => {
  let mockRedisClient: any;
  let redisCache: RedisCache;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisClient = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      setEx: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      on: jest.fn(),
    };

    // Mock the Redis constructor
    const Redis = require('redis');
    Redis.createClient.mockReturnValue(mockRedisClient);

    // Create a new instance for each test
    redisCache = new RedisCache();
  });

  describe('Connection', () => {
    it('should connect to Redis successfully', async () => {
      mockRedisClient.connect.mockResolvedValue(undefined);

      await redisCache.connect();

      expect(mockRedisClient.connect).toHaveBeenCalled();
      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockRedisClient.connect.mockRejectedValue(error);

      await expect(redisCache.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('Cache Operations', () => {
    beforeEach(async () => {
      mockRedisClient.connect.mockResolvedValue(undefined);
      await redisCache.connect();
    });

    describe('get', () => {
      it('should retrieve cached data', async () => {
        const testKey = 'test-key';
        const testValue = 'test-value';
        mockRedisClient.get.mockResolvedValue(testValue);

        const result = await redisCache.get(testKey);

        expect(mockRedisClient.get).toHaveBeenCalledWith(testKey);
        expect(result).toBe(testValue);
      });

      it('should return null for non-existent keys', async () => {
        mockRedisClient.get.mockResolvedValue(null);

        const result = await redisCache.get('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('set', () => {
      it('should set data with TTL', async () => {
        const testKey = 'test-key';
        const testValue = 'test-value';
        const ttl = 300;
        mockRedisClient.setEx.mockResolvedValue('OK');

        await redisCache.set(testKey, testValue, ttl);

        expect(mockRedisClient.setEx).toHaveBeenCalledWith(testKey, ttl, testValue);
      });

      it('should set data without TTL', async () => {
        const testKey = 'test-key';
        const testValue = 'test-value';
        mockRedisClient.set.mockResolvedValue('OK');

        await redisCache.set(testKey, testValue);

        expect(mockRedisClient.set).toHaveBeenCalledWith(testKey, testValue);
      });
    });

    describe('del', () => {
      it('should delete cached data', async () => {
        const testKey = 'test-key';
        mockRedisClient.del.mockResolvedValue(1);

        await redisCache.del(testKey);

        expect(mockRedisClient.del).toHaveBeenCalledWith(testKey);
      });
    });

    describe('exists', () => {
      it('should check if key exists', async () => {
        mockRedisClient.exists.mockResolvedValue(1);

        const result = await redisCache.exists('test-key');

        expect(mockRedisClient.exists).toHaveBeenCalledWith('test-key');
        expect(result).toBe(true);
      });

      it('should return false for non-existent keys', async () => {
        mockRedisClient.exists.mockResolvedValue(0);

        const result = await redisCache.exists('non-existent');

        expect(result).toBe(false);
      });
    });
  });

  describe('Cache Keys', () => {
    it('should generate profile cache keys', () => {
      const address = '5F5gKX2Y';
      const key = cacheKeys.profile(address);

      expect(key).toBe(`profile:${address}`);
    });

    it('should generate attestations cache keys', () => {
      const subject = '5F5gKX2Y';
      const key = cacheKeys.attestations(subject);

      expect(key).toBe(`attestations:${subject}`);
    });

    it('should generate profiles list cache keys', () => {
      const key = cacheKeys.profilesList(1, 10, 'score', 'desc');

      expect(key).toBe('profiles:list:1:10:score:desc');
    });
  });

  describe('Cache TTL Constants', () => {
    it('should have correct TTL values', () => {
      expect(CACHE_TTL.PROFILE).toBe(300); // 5 minutes
      expect(CACHE_TTL.PROFILES_LIST).toBe(60); // 1 minute
      expect(CACHE_TTL.ATTESTATIONS).toBe(120); // 2 minutes
    });
  });
});
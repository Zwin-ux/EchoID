import { createClient, RedisClientType } from 'redis';
import logger from './server-logger';

export class RedisCache {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', { error: err.message });
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      logger.warn('Disconnected from Redis');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) await this.connect();
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error', { key, error });
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (!this.isConnected) await this.connect();
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error('Redis SET error', { key, error });
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.isConnected) await this.connect();
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis DEL error', { key, error });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error', { key, error });
      return false;
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache();

// Cache key generators
export const cacheKeys = {
  profile: (address: string) => `profile:${address}`,
  profilesList: (page: number, limit: number, sortBy: string, sortOrder: string) =>
    `profiles:list:${page}:${limit}:${sortBy}:${sortOrder}`,
  attestations: (subject: string) => `attestations:${subject}`,
};

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PROFILE: 300, // 5 minutes
  PROFILES_LIST: 60, // 1 minute
  ATTESTATIONS: 120, // 2 minutes
};
import NodeCache from 'node-cache';
import Redis from 'ioredis';

if (!process.env.REDIS_URI) {
  console.log('Redis not found. Using node-cache by default');
} else {
  console.log('Using redis');
}

export namespace cache {
  let cacheInstance: NodeCache | Redis;

  function initializeCacheInstance(): void {
    if (!cacheInstance) {
      cacheInstance = process.env.REDIS_URI
        ? new Redis(process.env.REDIS_URI)
        : new NodeCache();
    }
  }

  export async function get(key: string): Promise<any> {
    initializeCacheInstance();

    if (isRedis(cacheInstance)) {
      return await (cacheInstance as Redis).get(key);
    } else {
      return (cacheInstance as NodeCache).get(key);
    }
  }

  export async function set(
    key: string,
    value: any,
    expireTime?: number
  ): Promise<void> {
    initializeCacheInstance();

    if (isRedis(cacheInstance)) {
      if (expireTime) {
        await (cacheInstance as Redis).set(key, value, 'EX', expireTime);
      } else {
        await (cacheInstance as Redis).set(key, value);
      }
    } else {
      if (expireTime) {
        (cacheInstance as NodeCache).set(key, value, expireTime);
      } else {
        (cacheInstance as NodeCache).set(key, value);
      }
    }
  }

  export async function del(key: string): Promise<void> {
    initializeCacheInstance();

    if (isRedis(cacheInstance)) {
      await (cacheInstance as Redis).del(key);
    } else {
      (cacheInstance as NodeCache).del(key);
    }
  }

  function isRedis(cache: NodeCache | Redis): boolean {
    return cache instanceof Redis;
  }
}

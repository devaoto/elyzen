import NodeCache from 'node-cache';
import Redis from 'ioredis';

if (!process.env.REDIS_URI) {
  console.log('Redis not found. Using node-cache by default');
} else {
  console.log('Using redis');
}

export namespace cache {
  let cacheInstance: NodeCache | Redis;

  export async function get(key: string): Promise<any> {
    if (!cacheInstance) {
      cacheInstance = process.env.REDIS_URI
        ? new Redis(process.env.REDIS_URI)
        : new NodeCache();
    }

    if (isRedis(cacheInstance)) {
      return await cacheInstance.get(key);
    } else {
      return (cacheInstance as NodeCache).get(key);
    }
  }

  export async function set(
    key: string,
    value: any,
    expireTime?: number
  ): Promise<void> {
    if (!cacheInstance) {
      cacheInstance = process.env.REDIS_URI
        ? new Redis(process.env.REDIS_URI)
        : new NodeCache();
    }

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

  function isRedis(cache: NodeCache | Redis): boolean {
    return cache instanceof Redis;
  }
}

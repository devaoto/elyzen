import NodeCache from 'node-cache';
import Redis from 'ioredis';

if (!process.env.REDIS_URI) {
  console.log('Redis not found. Using node-cache by default');
} else {
  console.log('Using redis');
}

export namespace cache {
  let cacheInstance: NodeCache | Redis;

  /**
   * Initializes the cache instance if it is not already set.
   */
  function initializeCacheInstance(): void {
    if (!cacheInstance) {
      cacheInstance = process.env.REDIS_URI
        ? new Redis(process.env.REDIS_URI)
        : new NodeCache();
    }
  }

  /**
   * Retrieves the value associated with the given key from the cache instance.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Promise<any>} A promise that resolves with the value corresponding to the key.
   */
  export async function get(key: string): Promise<any> {
    initializeCacheInstance();

    if (isRedis(cacheInstance)) {
      return await (cacheInstance as Redis).get(key);
    } else {
      return (cacheInstance as NodeCache).get(key);
    }
  }

  /**
   * Sets a key-value pair in the cache instance with an optional expiration time.
   *
   * @param {string} key - The key to set the value for.
   * @param {any} value - The value to set.
   * @param {number} [expireTime] - Optional expiration time in seconds.
   * @return {Promise<void>} A promise that resolves once the value is set.
   */
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

  /**
   * Deletes a key-value pair from the cache instance based on the provided key.
   *
   * @param {string} key - The key to delete the value for.
   * @return {Promise<void>} A promise that resolves once the value is deleted.
   */
  export async function del(key: string): Promise<void> {
    initializeCacheInstance();

    if (isRedis(cacheInstance)) {
      await (cacheInstance as Redis).del(key);
    } else {
      (cacheInstance as NodeCache).del(key);
    }
  }

  /**
   * Checks if the cache instance is an instance of Redis.
   *
   * @param {NodeCache | Redis} cache - The cache instance to check.
   * @return {boolean} True if the cache is an instance of Redis, false otherwise.
   */
  function isRedis(cache: NodeCache | Redis): boolean {
    return cache instanceof Redis;
  }
}

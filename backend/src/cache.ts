import redis from 'redis'
import {env} from './env'

const redisClient = redis.createClient({
  username: env.REDIS_USER,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    reconnectStrategy: retries => Math.min(retries * 50, 1000), // Basic reconnect strategy
  },
})

redisClient.on('connect', () =>
  console.log('Successfully connected to Redis server.'),
)
redisClient.on('error', err => console.error('Redis Client Error:', err))

try {
  await redisClient.connect()
} catch (err) {
  console.error('Failed to connect to Redis on startup:', err)
}

const CACHE_EXPIRATION_SECONDS = 3600 // Cache products list for 1 hour

export async function get<T>(cacheKey: string): Promise<T | null> {
  if (!redisClient.isReady) {
    console.warn(
      'Redis client not ready, fetching from DB directly for /products',
    )
    return null
  }

  const cached = await redisClient.get(cacheKey)
  if (!cached) {
    return null
  }

  try {
    return JSON.parse(cached)
  } catch (error) {
    console.error('Error parsing cached data:', error)
    return null
  }
}

export async function set(cacheKey: string, data: any, ttl?: number) {
  await redisClient.set(cacheKey, JSON.stringify(data), {
    EX: ttl ?? CACHE_EXPIRATION_SECONDS,
  })
}

export async function invalidate(cacheKey: string) {
  await redisClient.del(cacheKey)
}

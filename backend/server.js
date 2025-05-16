const express = require('express')
const {Pool} = require('pg')
const redis = require('redis')

const app = express()
app.use(express.json()) // Middleware to parse JSON bodies

// Environment variables with defaults for local development (Docker Compose will override)
const PORT = process.env.PORT || 3000
const PG_HOST = process.env.PG_HOST || 'localhost' // In Docker Compose, this will be 'db'
const PG_USER = process.env.PG_USER || 'postgres'
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres'
const PG_DATABASE = process.env.PG_DATABASE || 'bazaar_db'
const PG_PORT = process.env.PG_PORT || 5432

const REDIS_HOST = process.env.REDIS_HOST || 'localhost' // In Docker Compose, this will be 'cache'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

// PostgreSQL Client Pool Setup
// The pg library is used to interact with PostgreSQL [4, 8]
// Connection pooling is recommended for managing database connections efficiently [8]
const pgPool = new Pool({
  host: PG_HOST,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  port: parseInt(PG_PORT, 10), // Ensure port is an integer
})

pgPool.on('connect', () =>
  console.log('Successfully connected to PostgreSQL database.'),
)
pgPool.on('error', err =>
  console.error('PostgreSQL client pool error:', err.stack),
)

// Redis Client Setup
// The redis library is used for caching [5, 9]
const redisClient = redis.createClient({
  password: REDIS_PASSWORD, // Pass password if set
  socket: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10), // Ensure port is an integer
    reconnectStrategy: retries => Math.min(retries * 50, 1000), // Basic reconnect strategy
  },
})

redisClient.on('connect', () =>
  console.log('Successfully connected to Redis server.'),
)
redisClient.on('error', err => console.error('Redis Client Error:', err))

// Asynchronous connection for Redis client
;(async () => {
  try {
    await redisClient.connect()
  } catch (err) {
    console.error('Failed to connect to Redis on startup:', err)
  }
})()

const PRODUCTS_CACHE_KEY = 'products_list'
const CACHE_EXPIRATION_SECONDS = 3600 // Cache products list for 1 hour

// --- API Endpoints ---

// Health Check Endpoint
// Provides a simple way to verify if the backend service is running.
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// CRUD Operations for Products

// GET /products - Retrieve all products (with caching)
app.get('/products', async (req, res) => {
  if (!redisClient.isReady) {
    console.warn(
      'Redis client not ready, fetching from DB directly for /products',
    )
    // Fallback to DB if Redis is not ready
    try {
      const result = await pgPool.query(
        'SELECT * FROM products ORDER BY id ASC',
      )
      return res.status(200).json(result.rows)
    } catch (dbError) {
      console.error('Error fetching products directly from database:', dbError)
      return res.status(500).json({error: 'Internal server error (DB)'})
    }
  }

  try {
    const cachedProducts = await redisClient.get(PRODUCTS_CACHE_KEY)
    if (cachedProducts) {
      console.log('Serving products from Redis cache.')
      return res.status(200).json(JSON.parse(cachedProducts))
    }

    console.log('Cache miss. Fetching products from PostgreSQL database.')
    const result = await pgPool.query('SELECT * FROM products ORDER BY id ASC')
    // Store in Redis with expiration [10]
    await redisClient.setEx(
      PRODUCTS_CACHE_KEY,
      CACHE_EXPIRATION_SECONDS,
      JSON.stringify(result.rows),
    )
    console.log('Products cached in Redis.')
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// POST /products - Create a new product
app.post('/products', async (req, res) => {
  const {name, description, price, category, image_url, stock_quantity} =
    req.body
  if (!name || price === undefined || stock_quantity === undefined) {
    return res
      .status(400)
      .json({error: 'Name, price, and stock_quantity are required fields.'})
  }

  try {
    const result = await pgPool.query(
      'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        name,
        description,
        parseFloat(price),
        category,
        image_url,
        parseInt(stock_quantity, 10),
      ],
    )

    // Cache Invalidation: Delete the cached list of products
    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY)
      console.log('Products cache invalidated after POST operation.')
    } else {
      console.warn('Redis client not ready, cache not invalidated after POST.')
    }
    res.status(201).json(result.rows)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// GET /products/:id - Retrieve a single product by ID
app.get('/products/:id', async (req, res) => {
  const {id} = req.params
  // Basic cache for single product (optional, can be expanded)
  const singleProductCacheKey = `product:${id}`

  if (redisClient.isReady) {
    try {
      const cachedProduct = await redisClient.get(singleProductCacheKey)
      if (cachedProduct) {
        console.log(`Serving product ID ${id} from Redis cache.`)
        return res.status(200).json(JSON.parse(cachedProduct))
      }
    } catch (cacheError) {
      console.error(
        `Redis GET error for key ${singleProductCacheKey}:`,
        cacheError,
      )
    }
  } else {
    console.warn(
      'Redis client not ready, fetching from DB directly for /products/:id',
    )
  }

  try {
    const result = await pgPool.query('SELECT * FROM products WHERE id = $1', [
      parseInt(id, 10),
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Product not found.'})
    }
    if (redisClient.isReady) {
      await redisClient.setEx(
        singleProductCacheKey,
        CACHE_EXPIRATION_SECONDS,
        JSON.stringify(result.rows),
      )
      console.log(`Product ID ${id} cached in Redis.`)
    }
    res.status(200).json(result.rows)
  } catch (error) {
    console.error(`Error fetching product ID ${id}:`, error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// PUT /products/:id - Update an existing product
app.put('/products/:id', async (req, res) => {
  const {id} = req.params
  const {name, description, price, category, image_url, stock_quantity} =
    req.body

  if (!name || price === undefined || stock_quantity === undefined) {
    return res
      .status(400)
      .json({error: 'Name, price, and stock_quantity are required for update.'})
  }

  try {
    const result = await pgPool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5, stock_quantity = $6 WHERE id = $7 RETURNING *',
      [
        name,
        description,
        parseFloat(price),
        category,
        image_url,
        parseInt(stock_quantity, 10),
        parseInt(id, 10),
      ],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Product not found for update.'})
    }

    // Cache Invalidation
    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY) // Invalidate list
      await redisClient.del(`product:${id}`) // Invalidate specific product
      console.log(
        `Products cache and product ID ${id} cache invalidated after PUT operation.`,
      )
    } else {
      console.warn('Redis client not ready, cache not invalidated after PUT.')
    }
    res.status(200).json(result.rows)
  } catch (error) {
    console.error(`Error updating product ID ${id}:`, error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// DELETE /products/:id - Delete a product
app.delete('/products/:id', async (req, res) => {
  const {id} = req.params
  try {
    const result = await pgPool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [parseInt(id, 10)],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({error: 'Product not found for deletion.'})
    }

    // Cache Invalidation
    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY) // Invalidate list
      await redisClient.del(`product:${id}`) // Invalidate specific product
      console.log(
        `Products cache and product ID ${id} cache invalidated after DELETE operation.`,
      )
    } else {
      console.warn(
        'Redis client not ready, cache not invalidated after DELETE.',
      )
    }
    res
      .status(200)
      .json({
        message: 'Product deleted successfully.',
        deletedProduct: result.rows,
      })
  } catch (error) {
    console.error(`Error deleting product ID ${id}:`, error)
    res.status(500).json({error: 'Internal server error'})
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`)
})

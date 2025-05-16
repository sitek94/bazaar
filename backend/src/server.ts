import {zValidator} from '@hono/zod-validator'
import {Hono} from 'hono'
import {secureHeaders} from 'hono/secure-headers'
import {logger} from 'hono/logger'
import {cors} from 'hono/cors'
import * as cache from './cache'
import * as db from './database'
import {EnvSchema} from './env'

const parsedEnv = EnvSchema.safeParse(Bun.env)
if (!parsedEnv.success) {
  console.error('⚠️ Invalid environment variables ⚠️')
  console.error(parsedEnv.error.message)
  process.exit(1)
}

const app = new Hono()

app.use(logger())
app.use(secureHeaders())
app.use(cors())

const PRODUCTS_CACHE_KEY = 'products_list'

// --- API Endpoints ---

// Health Check Endpoint
app.get('/health', c => c.text('OK'))

// CRUD Operations for Products

// GET /products - Retrieve all products (with caching)
app.get('/products', async c => {
  const cachedProducts = await cache.get(PRODUCTS_CACHE_KEY)
  if (cachedProducts) {
    return c.json(cachedProducts)
  }

  const products = await db.getProducts()
  await cache.set(PRODUCTS_CACHE_KEY, products)

  return c.json(products)
})

// POST /products - Create a new product
app.post(
  '/products',
  zValidator('json', db.ProductSchema.omit({id: true})),
  async c => {
    const payload = c.req.valid('json')
    const product = await db.createProduct(payload)

    return c.json(product, 201)
  },
)

// GET /products/:id - Retrieve a single product by ID
app.get('/products/:id', async c => {
  const {id} = c.req.param()
  // Basic cache for single product (optional, can be expanded)
  const singleProductCacheKey = `product:${id}`

  const cachedProduct = await cache.get(singleProductCacheKey)
  if (cachedProduct) {
    return c.json(cachedProduct)
  }

  const product = await db.getProductById(id)
  await cache.set(singleProductCacheKey, product)

  return c.json(product)
})

// PUT /products/:id - Update an existing product
app.put(
  '/products/:id',
  zValidator('json', db.ProductSchema.omit({id: true}).partial()),
  async c => {
    const {id} = c.req.param()
    const payload = c.req.valid('json')

    const product = await db.updateProduct(id, payload)
    await cache.set(PRODUCTS_CACHE_KEY, product)

    return c.json(product)
  },
)

// DELETE /products/:id - Delete a product
app.delete('/products/:id', async c => {
  const {id} = c.req.param()
  await db.deleteProduct(id)
  await cache.invalidate(PRODUCTS_CACHE_KEY)
  await cache.invalidate(`product:${id}`)

  return c.json({message: 'Product deleted successfully.'})
})

export default app

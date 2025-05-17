import {Pool, types} from 'pg'
import {z} from 'zod'
import {env} from './env'

types.setTypeParser(types.builtins.NUMERIC, (val: string) => parseFloat(val))

// PostgreSQL Client Pool Setup
const pool = new Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  port: env.POSTGRES_PORT,
})

pool.on('connect', () =>
  console.log('Successfully connected to PostgreSQL database.'),
)
pool.on('error', err =>
  console.error('PostgreSQL client pool error:', err.stack),
)

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  image_url: z.string(),
  stock_quantity: z.number(),
})

type Product = z.infer<typeof ProductSchema>

export async function getProducts() {
  const result = await pool.query('SELECT * FROM products ORDER BY id ASC')
  return result.rows
}

export async function getProductById(id: Product['id']) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [
    id,
  ])
  return result.rows[0]
}

export async function createProduct(payload: Omit<Product, 'id'>) {
  const product = ProductSchema.omit({id: true}).parse(payload)
  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      product.name,
      product.description,
      product.price,
      product.category,
      product.image_url,
      product.stock_quantity,
    ],
  )
  return result.rows[0]
}

export async function updateProduct(
  id: Product['id'],
  payload: Partial<Omit<Product, 'id'>>,
) {
  const product = ProductSchema.omit({id: true}).partial().parse(payload)

  const columns = Object.keys(product) as (keyof typeof product)[]
  if (columns.length === 0) {
    throw new Error('No valid fields to update')
  }

  const setClauses = columns.map((column, index) => `${column} = $${index + 1}`)
  const values = columns.map(column => product[column])

  const query = /* sql */ `
    UPDATE products
    SET ${setClauses.join(', ')}
    WHERE id = $${columns.length + 1}
    RETURNING *
  `

  const updatedProduct = await pool.query(query, [...values, id])

  return updatedProduct.rows[0]
}

export async function deleteProduct(id: Product['id']) {
  const result = await pool.query('DELETE FROM products WHERE id = $1', [id])
  return result.rowCount
}

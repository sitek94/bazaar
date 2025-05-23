import type {Product} from './types'

export async function fetchProducts(): Promise<Product[]> {
  const apiUrl = `${window.location.protocol}//${import.meta.env.VITE_API_HOST}/products`
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  const data = await response.json()
  return data as Product[]
}

export async function getProducts(): Promise<Product[]> {
  return [
    {
      id: 1,
      name: 'Wireless Headphones',
      description:
        'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 199.99,
      category: 'Electronics',
      image_url: 'https://placehold.co/300x300?text=Headphones',
      stock_quantity: 45,
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      description: 'Soft, sustainable organic cotton t-shirt in various colors',
      price: 29.99,
      category: 'Clothing',
      image_url: 'https://placehold.co/300x300?text=T-Shirt',
      stock_quantity: 120,
    },
    {
      id: 3,
      name: 'Stainless Steel Water Bottle',
      description:
        'Vacuum insulated water bottle that keeps drinks cold for 24 hours',
      price: 34.99,
      category: 'Home',
      image_url: 'https://placehold.co/300x300?text=Bottle',
      stock_quantity: 78,
    },
    {
      id: 4,
      name: 'Leather Wallet',
      description: 'Handcrafted genuine leather wallet with RFID protection',
      price: 49.99,
      category: 'Accessories',
      image_url: 'https://placehold.co/300x300?text=Wallet',
      stock_quantity: 32,
    },
    {
      id: 5,
      name: 'Smart Watch',
      description:
        'Fitness and health tracking smartwatch with heart rate monitor',
      price: 249.99,
      category: 'Electronics',
      image_url: 'https://placehold.co/300x300?text=Watch',
      stock_quantity: 18,
    },
    {
      id: 6,
      name: 'Yoga Mat',
      description: 'Non-slip, eco-friendly yoga mat with carrying strap',
      price: 39.99,
      category: 'Fitness',
      image_url: 'https://placehold.co/300x300?text=Yoga+Mat',
      stock_quantity: 55,
    },
    {
      id: 7,
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      category: 'Home',
      image_url: 'https://placehold.co/300x300?text=Coffee+Maker',
      stock_quantity: 23,
    },
    {
      id: 8,
      name: 'Backpack',
      description: 'Water-resistant backpack with laptop compartment',
      price: 59.99,
      category: 'Accessories',
      image_url: 'https://placehold.co/300x300?text=Backpack',
      stock_quantity: 42,
    },
    {
      id: 9,
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with charging case',
      price: 129.99,
      category: 'Electronics',
      image_url: 'https://placehold.co/300x300?text=Earbuds',
      stock_quantity: 0,
    },
    {
      id: 10,
      name: 'Ceramic Plant Pot',
      description: 'Minimalist ceramic pot for indoor plants',
      price: 24.99,
      category: 'Home',
      image_url: 'https://placehold.co/300x300?text=Plant+Pot',
      stock_quantity: 67,
    },
    {
      id: 11,
      name: 'Running Shoes',
      description: 'Lightweight running shoes with responsive cushioning',
      price: 119.99,
      category: 'Fitness',
      image_url: 'https://placehold.co/300x300?text=Shoes',
      stock_quantity: 38,
    },
    {
      id: 12,
      name: 'Desk Lamp',
      description: 'Adjustable LED desk lamp with wireless charging base',
      price: 79.99,
      category: 'Home',
      image_url: 'https://placehold.co/300x300?text=Lamp',
      stock_quantity: 29,
    },
  ]
}

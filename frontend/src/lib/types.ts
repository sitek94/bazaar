export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string | null
  image_url: string | null
  stock_quantity: number
}

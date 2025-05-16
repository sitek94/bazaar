import {Card, CardContent, CardFooter} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {ShoppingCart} from 'lucide-react'
import type {Product} from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({product}: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square">
        <img
          src={
            product.image_url ||
            `https://placehold.co/300x300?text=${encodeURIComponent(product.name)}`
          }
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-muted text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" disabled={product.stock_quantity === 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  )
}

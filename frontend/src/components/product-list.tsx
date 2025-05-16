import {useState} from 'react'
import type {Product} from '@/lib/types'
import ProductCard from '@/components/product-card'
import ProductFilters from '@/components/product-filters'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({products}: ProductListProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  const categories = Array.from(
    new Set(products.map(product => product.category)),
  ).filter(Boolean)

  const filteredProducts = filterProducts(products, categoryFilter, priceRange)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ProductFilters
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>

      <div className="md:col-span-3">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function filterProducts(
  products: Product[],
  categoryFilter: string,
  [minPrice, maxPrice]: [number, number],
) {
  let result = [...products]

  if (categoryFilter) {
    result = result.filter(product => product.category === categoryFilter)
  }

  if (minPrice > 0) {
    result = result.filter(product => product.price >= minPrice)
  }

  if (maxPrice < 1000) {
    result = result.filter(product => product.price <= maxPrice)
  }

  return result
}

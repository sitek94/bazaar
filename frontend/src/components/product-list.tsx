'use client'

import {useState, useEffect} from 'react'
import type {Product} from '@/lib/types'
import ProductCard from '@/components/product-card'
import ProductFilters from '@/components/product-filters'

interface ProductListProps {
  initialProducts: Product[]
}

export default function ProductList({initialProducts}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map(product => product.category)),
  ).filter((c): c is string => !!c)

  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter)
    }

    // Apply price filter
    result = result.filter(
      product =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    )

    setFilteredProducts(result)
  }, [products, categoryFilter, priceRange])

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

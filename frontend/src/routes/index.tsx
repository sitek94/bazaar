import {createFileRoute} from '@tanstack/react-router'
import {fetchProducts} from '@/lib/data'
import ProductList from '@/components/product-list'

export const Route = createFileRoute('/')({
  component: App,
  loader: fetchProducts,
})

function App() {
  const products = Route.useLoaderData()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Bazaar</h1>
        <p className="text-muted-foreground mt-2">
          Discover amazing products at great prices
        </p>
      </header>

      <ProductList products={products} />
    </div>
  )
}

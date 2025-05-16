'use client'

import {Slider} from '@/components/ui/slider'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

interface ProductFiltersProps {
  categories: string[]
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
}

export default function ProductFilters({
  categories,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
}: ProductFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const resetFilters = () => {
    setCategoryFilter('')
    setPriceRange([0, 1000])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Category</h3>
              <RadioGroup
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="all" />
                    <Label htmlFor="all">All Categories</Label>
                  </div>
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}>{category}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">Price Range</h3>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={1000}
                step={10}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

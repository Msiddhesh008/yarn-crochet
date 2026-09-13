import { useMemo, useState } from 'react'
import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import type { ProductCategory } from '../types'

const categories: Array<'All' | ProductCategory> = [
  'All',
  'Crochet Flowers',
  'Crochet Bags',
  'Plushies',
  'Keychains',
  'Handmade Gifts',
  'Custom Pieces',
]

export function ShopPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return products
    return products.filter((p) => p.category === filter)
  }, [filter])

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">Shop</p>
        <h1 className="section-heading">
          The collection.
          <span>Every piece a little world.</span>
        </h1>
      </div>
      <div className="container">
        <div className="shop-filters" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip${filter === cat ? ' is-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="shop-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

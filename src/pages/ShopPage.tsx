import { useMemo, useState } from 'react'
import { useStorefront } from '../context/StorefrontContext'
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
  const { products, content } = useStorefront()
  const { shopPage } = content

  const filtered = useMemo(() => {
    if (filter === 'All') return products
    return products.filter((p) => p.category === filter)
  }, [filter, products])

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">{shopPage.eyebrow}</p>
        <h1 className="section-heading">
          {shopPage.heading}
          <span>{shopPage.subheading}</span>
        </h1>
      </div>
      <div className="container">
        <div className="shop-filters" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip${filter === cat ? ' is-active' : ''}`}
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="shop-grid" style={{ marginTop: '2rem' }}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { useStorefront } from '../context/StorefrontContext'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './Skeleton'

interface ProductGridProps {
  limit?: number
  asymmetric?: boolean
}

export function ProductGrid({ limit = 6, asymmetric = true }: ProductGridProps) {
  const { content, getCollectionProducts, loading } = useStorefront()
  const { collection } = content
  const items = getCollectionProducts().slice(0, limit)
  const gridClass = asymmetric ? 'collection-grid' : 'shop-grid'

  return (
    <section className="section" id="collection">
      <div className="container">
        <p className="eyebrow" data-reveal>
          {collection.eyebrow}
        </p>
        <h2 className="section-heading" data-reveal>
          {collection.heading}
          <span>{collection.subheading}</span>
        </h2>
        <p className="section-intro" data-reveal>
          {collection.intro}
        </p>
        <div className={gridClass} aria-busy={loading || undefined}>
          {loading
            ? Array.from({ length: limit }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  )
}

import { collection } from '../data/content'
import { products } from '../data/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  limit?: number
  asymmetric?: boolean
}

export function ProductGrid({ limit = 6, asymmetric = true }: ProductGridProps) {
  const items = products.slice(0, limit)

  return (
    <section className="section" id="collection">
      <div className="container">
        <p className="eyebrow" data-reveal>
          The Collection
        </p>
        <h2 className="section-heading" data-reveal>
          {collection.heading}
          <span>{collection.subheading}</span>
        </h2>
        <p className="section-intro" data-reveal>
          {collection.intro}
        </p>
        <div className={asymmetric ? 'collection-grid' : 'shop-grid'}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

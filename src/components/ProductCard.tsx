import { useNavigate } from 'react-router-dom'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => navigate(`/product/${product.slug}`)}
      data-cursor="loop"
    >
      <div className="product-card__media">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={480}
          height={600}
        />
        <span className="product-card__yarn" aria-hidden />
      </div>
      <div className="product-card__static">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__row">
          <span>${product.price}</span>
          <span>View piece →</span>
        </div>
      </div>
    </button>
  )
}

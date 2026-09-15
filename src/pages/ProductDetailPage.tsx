import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStorefront } from '../context/StorefrontContext'
import { useCart } from '../context/CartContext'
import { MagneticButton } from '../components/MagneticButton'
import { ProductCard } from '../components/ProductCard'
import { scrollToTop } from '../hooks/useLenis'
import { formatMoney } from '../utils/formatMoney'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { products, getProductBySlug, content } = useStorefront()
  const product = slug ? getProductBySlug(slug) : undefined
  const { handmadeNote } = content
  const { addItem } = useCart()
  const [color, setColor] = useState<string | undefined>()

  useEffect(() => {
    setColor(product?.colors[0])
    scrollToTop(true)
  }, [product])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .concat(
        products.filter(
          (p) =>
            p.id !== product.id &&
            p.category !== product.category &&
            p.featured,
        ),
      )
      .slice(0, 3)
  }, [product, products])

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="section-heading">Piece not found</h1>
          <p className="section-intro">This loop seems to have unraveled.</p>
          <MagneticButton to="/shop">Back to shop</MagneticButton>
        </div>
      </div>
    )
  }

  const activeColor = color ?? product.colors[0]

  return (
    <div className="page">
      <div className="container product-detail">
        <div className="product-detail__media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail__info">
          <p className="eyebrow">{product.category}</p>
          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__price">{formatMoney(product.price)}</p>
          <p className="product-detail__desc">{product.description}</p>
          <p className="product-detail__label">Available colours</p>
          <div className="color-swatches">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-swatch${activeColor === c ? ' is-active' : ''}`}
                style={{ background: c }}
                aria-label={`Colour ${c}`}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <p className="handmade-note">{handmadeNote}</p>
          <div className="product-detail__actions">
            <MagneticButton onClick={() => addItem(product, activeColor)}>
              Add to cart
            </MagneticButton>
            <Link to="/shop" className="btn btn--ghost">
              Back to shop
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="container product-related">
          <p className="eyebrow">You may also love</p>
          <h2
            className="section-heading"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            More little loops
          </h2>
          <div className="shop-grid product-related__grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

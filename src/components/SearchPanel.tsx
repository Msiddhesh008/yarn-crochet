import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { products } from '../data/products'

interface SearchPanelProps {
  open: boolean
  onClose: () => void
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className={`search-panel${open ? ' is-open' : ''}`} role="search">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <button type="button" className="icon-btn" aria-label="Close search" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <label className="sr-only" htmlFor="site-search">
        Search products
      </label>
      <input
        id="site-search"
        type="search"
        placeholder="Search flowers, bags, plushies…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={open}
      />
      <div className="search-results">
        {results.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="search-result"
            onClick={onClose}
          >
            <img src={product.image} alt="" />
            <div>
              <strong>{product.name}</strong>
              <p style={{ margin: 0, color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>
                {product.category} · ${product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

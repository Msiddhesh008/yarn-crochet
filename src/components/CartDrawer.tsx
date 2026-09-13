import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, clear, count } = useCart()

  return (
    <>
      {isOpen ? (
        <div
          className="modal-backdrop is-open"
          style={{ background: 'var(--color-overlay-soft)' }}
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      ) : null}
      <aside
        className={`cart-drawer${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Cart"
      >
        <div className="cart-drawer__header">
          <h3>Cart ({count})</h3>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close cart"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="cart-empty">Your cart is waiting for its first loop.</p>
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <img src={item.product.image} alt="" />
                  <div>
                    <strong>{item.product.name}</strong>
                    <p style={{ margin: '0.25rem 0', color: 'var(--color-ink-soft)' }}>
                      Qty {item.quantity} · ${item.product.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      style={{ color: 'var(--color-terracotta)', fontSize: '0.85rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              style={{ marginTop: '1rem' }}
              onClick={clear}
            >
              Clear cart
            </button>
          </>
        )}
      </aside>
    </>
  )
}

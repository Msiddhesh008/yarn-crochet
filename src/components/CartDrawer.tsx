import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { CartQtyStepper } from './CartQtyStepper'
import { useCart } from '../context/CartContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { formatMoney } from '../utils/formatMoney'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clear, count } =
    useCart()
  const { isAuthenticated } = useCustomerAuth()

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

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
                    <p className="cart-item__price">
                      {formatMoney(item.product.price)} each
                    </p>
                    <CartQtyStepper
                      quantity={item.quantity}
                      label={`Quantity for ${item.product.name}`}
                      onChange={(quantity) =>
                        updateQuantity(item.product.id, quantity)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="cart-item__remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>
              Total {formatMoney(total)}
            </p>
            <Link
              to={isAuthenticated ? '/checkout' : '/login'}
              state={isAuthenticated ? undefined : { from: '/checkout' }}
              className="btn btn--primary"
              style={{ marginTop: '0.75rem', display: 'inline-flex' }}
              onClick={() => setIsOpen(false)}
            >
              {isAuthenticated ? 'Checkout' : 'Sign in to checkout'}
            </Link>
            <button
              type="button"
              className="btn btn--ghost"
              style={{ marginTop: '0.5rem' }}
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

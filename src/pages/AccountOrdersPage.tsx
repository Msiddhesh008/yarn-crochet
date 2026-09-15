import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountNav } from '../components/AccountNav'
import {
  OrderStatusBadge,
  OrderStatusStepper,
} from '../components/OrderStatusStepper'
import { apiRequest } from '../services/api'
import type { ShopOrder } from '../types/orders'
import { DownloadInvoiceButton } from '../components/DownloadInvoiceButton'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { mediaUrl } from '../utils/mediaUrl'
import { formatMoney } from '../utils/formatMoney'

export function AccountOrdersPage() {
  const { customer } = useCustomerAuth()
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    apiRequest<ShopOrder[]>('/api/orders/mine', { auth: true })
      .then(setOrders)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load orders')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">Account</p>
        <h1 className="section-heading">My orders</h1>
        <p className="section-intro">
          Signed in as {customer?.name} ({customer?.email})
        </p>
        <AccountNav />
      </div>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? <p className="section-intro">Loading orders…</p> : null}
        {error ? <p className="handmade-note">{error}</p> : null}
        {!loading && !error && orders.length === 0 ? (
          <p className="section-intro">
            No orders yet. <Link to="/shop">Browse the collection</Link>
          </p>
        ) : null}
        <div className="account-order-list">
          {orders.map((order) => {
            const thumbs = order.items.slice(0, 3)
            const extra = order.items.length - thumbs.length
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            )
            return (
              <article key={order.id} className="account-order-card">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="account-order-card__link"
                >
                  <div className="account-order-card__top">
                    <div>
                      <strong>Order {order.id.slice(0, 8)}</strong>
                      <p className="account-order-card__meta">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="account-order-card__thumbs">
                    {thumbs.map((item) => (
                      <img
                        key={`${item.productId}-${item.color ?? ''}`}
                        className="account-order-card__thumb"
                        src={mediaUrl(item.image) || undefined}
                        alt={item.name}
                      />
                    ))}
                    {extra > 0 ? (
                      <span className="account-order-card__more">
                        +{extra} more
                      </span>
                    ) : null}
                  </div>
                  <OrderStatusStepper status={order.status} compact />
                  <div className="account-order-card__footer">
                    <span>
                      {itemCount} item{itemCount === 1 ? '' : 's'}
                    </span>
                    <strong>{formatMoney(order.total)}</strong>
                  </div>
                </Link>
                {order.status === 'completed' ? (
                  <div className="account-order-card__actions">
                    <DownloadInvoiceButton
                      order={order}
                      className="account-order-card__invoice"
                    />
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AccountNav } from '../components/AccountNav'
import { OrderStatusStepper } from '../components/OrderStatusStepper'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { apiRequest, ApiError } from '../services/api'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type ShopOrder,
} from '../types/orders'
import { DownloadInvoiceButton } from '../components/DownloadInvoiceButton'
import { OrderDetailSkeleton } from '../components/Skeleton'
import { completeRazorpayPayment } from '../utils/completeRazorpayPayment'
import { formatMoney } from '../utils/formatMoney'
import { mediaUrl } from '../utils/mediaUrl'

export function AccountOrderDetailPage() {
  const { id } = useParams()
  const { customer } = useCustomerAuth()
  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [error, setError] = useState('')
  const [payError, setPayError] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    apiRequest<ShopOrder>(`/api/orders/${id}`, { auth: true })
      .then(setOrder)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Order not found')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <OrderDetailSkeleton />
  }

  if (error || !order) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="section-heading">Order not found</h1>
          <p className="section-intro">{error}</p>
          <Link to="/account/orders" className="btn btn--ghost">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  const addressLines = [
    order.address.line1,
    order.address.line2,
    `${order.address.city}, ${order.address.state} ${order.address.postalCode}`,
    order.address.country,
  ].filter(Boolean)

  const needsPayment =
    order.paymentMethod === 'razorpay' &&
    order.paymentStatus !== 'paid' &&
    order.status !== 'cancelled'

  const onPayNow = () => {
    setPaying(true)
    setPayError('')
    completeRazorpayPayment({
      order,
      prefill: {
        name: customer?.name ?? order.customer,
        email: customer?.email ?? order.email,
        contact: customer?.phone || undefined,
      },
    })
      .then(setOrder)
      .catch((err: unknown) => {
        setPayError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Payment could not be completed',
        )
      })
      .finally(() => setPaying(false))
  }

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Order</p>
        <h1 className="section-heading">Order {order.id.slice(0, 10)}</h1>
        <p className="section-intro">
          Placed {new Date(order.createdAt).toLocaleString()}
        </p>

        <AccountNav />
      </div>
      <div className="container" style={{ paddingBottom: '4rem', maxWidth: 640 }}>
        <OrderStatusStepper status={order.status} />

        {needsPayment ? (
          <div className="handmade-note" style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.75rem' }}>
              Online payment is still pending for this order.
            </p>
            {payError ? <p style={{ margin: '0 0 0.75rem' }}>{payError}</p> : null}
            <button
              type="button"
              className="btn btn--primary"
              disabled={paying}
              onClick={onPayNow}
            >
              {paying ? 'Opening Razorpay…' : `Pay ${formatMoney(order.total)} now`}
            </button>
          </div>
        ) : null}

        <h2 className="section-heading" style={{ fontSize: '1.5rem' }}>
          Items
        </h2>
        <div>
          {order.items.map((item) => {
            const lineTotal = item.price * item.quantity
            const nameNode = item.slug ? (
              <Link to={`/product/${item.slug}`}>{item.name}</Link>
            ) : (
              item.name
            )
            return (
              <div
                key={`${item.productId}-${item.color ?? ''}`}
                className="order-line"
              >
                <img
                  className="order-line__image"
                  src={mediaUrl(item.image) || undefined}
                  alt=""
                />
                <div>
                  <p className="order-line__name">{nameNode}</p>
                  <p className="order-line__meta">
                    {item.color ? (
                      <>
                        <span
                          className="order-line__swatch"
                          style={{ background: item.color }}
                          aria-hidden
                        />
                        {item.color} ·{' '}
                      </>
                    ) : null}
                    Qty {item.quantity} · {formatMoney(item.price)} each
                  </p>
                </div>
                <div className="order-line__price">{formatMoney(lineTotal)}</div>
              </div>
            )
          })}
        </div>

        <div
          className="split"
          style={{ gap: '2rem', alignItems: 'start', marginTop: '2rem' }}
        >
          <div>
            <h2 className="section-heading" style={{ fontSize: '1.35rem' }}>
              Shipping
            </h2>
            <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
              {addressLines.join('\n')}
            </p>
            <p style={{ marginTop: '1rem' }}>
              Payment:{' '}
              {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
              {order.paymentStatus
                ? ` · ${
                    PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                    order.paymentStatus
                  }`
                : ''}
            </p>
            {order.note ? <p>Note: {order.note}</p> : null}
          </div>
          <div className="order-summary-block">
            <h2
              className="section-heading"
              style={{ fontSize: '1.35rem', marginTop: 0 }}
            >
              Summary
            </h2>
            <p>
              <span>Subtotal</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <p>
              <strong>Total</strong>
              <strong>{formatMoney(order.total)}</strong>
            </p>
          </div>
        </div>

        <div className="account-order-detail__actions">
          <DownloadInvoiceButton order={order} variant="primary" />
          <Link to="/account/orders" className="btn btn--ghost">
            Back to orders
          </Link>
        </div>
      </div>
    </div>
  )
}

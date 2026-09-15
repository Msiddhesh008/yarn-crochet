import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Banknote, CreditCard } from 'lucide-react'
import { CartQtyStepper } from '../components/CartQtyStepper'
import { TextAreaField, TextField } from '../components/form/FormControls'
import { useCart } from '../context/CartContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { apiRequest, ApiError } from '../services/api'
import {
  EMPTY_ADDRESS,
  type CreateOrderResponse,
  type OrderAddress,
  type PaymentMethod,
  type ShopOrder,
} from '../types/orders'
import { completeRazorpayPayment } from '../utils/completeRazorpayPayment'
import { formatMoney } from '../utils/formatMoney'

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod
  label: string
  hint: string
  Icon: typeof CreditCard
}> = [
  {
    value: 'razorpay',
    label: 'Pay online',
    hint: 'UPI, cards, netbanking & wallets via Razorpay',
    Icon: CreditCard,
  },
  {
    value: 'cod',
    label: 'Cash on delivery',
    hint: 'Pay when your handmade piece arrives',
    Icon: Banknote,
  },
]

export function CheckoutPage() {
  const { items, clear, count, updateQuantity } = useCart()
  const { customer, isAuthenticated, ready } = useCustomerAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState<OrderAddress>(EMPTY_ADDRESS)
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('razorpay')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [prefilled, setPrefilled] = useState(false)

  useEffect(() => {
    if (!customer || prefilled) return
    if (customer.address?.line1) {
      setAddress({
        ...EMPTY_ADDRESS,
        ...customer.address,
        line2: customer.address.line2 ?? '',
      })
    }
    setPrefilled(true)
  }, [customer, prefilled])

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  )

  if (ready && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/checkout' }} />
  }

  if (items.length === 0) {
    return (
      <div className="page" style={{ paddingTop: 0 }}>
        <div className="container page-hero">
          <p className="eyebrow">Checkout</p>
          <h1 className="section-heading">Your cart is empty</h1>
          <Link to="/shop" className="btn btn--primary">
            Shop the collection
          </Link>
        </div>
      </div>
    )
  }

  const finishOrder = (order: ShopOrder) => {
    clear()
    navigate(`/account/orders/${order.id}`, { replace: true })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    apiRequest<CreateOrderResponse>('/api/orders', {
      method: 'POST',
      auth: true,
      body: {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          color: item.color,
        })),
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod,
        note,
      },
    })
      .then(async (response) => {
        if (paymentMethod === 'cod') {
          finishOrder(response.order)
          return
        }

        try {
          const paidOrder = await completeRazorpayPayment({
            order: response.order,
            prefill: {
              name: customer?.name ?? response.order.customer,
              email: customer?.email ?? response.order.email,
              contact: customer?.phone || undefined,
            },
          })
          finishOrder(paidOrder)
        } catch (payError: unknown) {
          clear()
          navigate(`/account/orders/${response.order.id}`, { replace: true })
          if (payError instanceof Error || payError instanceof ApiError) {
            console.error(payError)
          }
        }
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Checkout failed',
        )
      })
      .finally(() => setSubmitting(false))
  }

  const submitLabel =
    paymentMethod === 'razorpay'
      ? `Pay ${formatMoney(total)}`
      : `Place COD order · ${formatMoney(total)}`

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">Checkout</p>
        <h1 className="section-heading">Place your order</h1>
        <p className="section-intro">
          {count} item{count === 1 ? '' : 's'} · {formatMoney(total)} — pay online
          with Razorpay or choose cash on delivery.
        </p>
      </div>
      <div className="container" style={{ paddingBottom: '4rem', maxWidth: 640 }}>
        <div className="checkout-preview">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.color ?? ''}`}
              className="checkout-preview__row"
            >
              <img src={item.product.image} alt="" />
              <div>
                <strong>{item.product.name}</strong>
                {item.color ? (
                  <p className="order-line__meta">{item.color}</p>
                ) : null}
                <CartQtyStepper
                  quantity={item.quantity}
                  label={`Quantity for ${item.product.name}`}
                  onChange={(quantity) =>
                    updateQuantity(item.product.id, quantity)
                  }
                />
              </div>
              <span>{formatMoney(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <form className="form-grid" onSubmit={onSubmit}>
          {error ? <p className="handmade-note">{error}</p> : null}
          <TextField
            id="line1"
            label="Address line 1"
            required
            value={address.line1}
            onChange={(line1) => setAddress({ ...address, line1 })}
          />
          <TextField
            id="line2"
            label="Address line 2"
            value={address.line2 ?? ''}
            onChange={(line2) => setAddress({ ...address, line2 })}
          />
          <div className="form-grid form-grid--2">
            <TextField
              id="city"
              label="City"
              required
              value={address.city}
              onChange={(city) => setAddress({ ...address, city })}
            />
            <TextField
              id="state"
              label="State"
              required
              value={address.state}
              onChange={(state) => setAddress({ ...address, state })}
            />
          </div>
          <div className="form-grid form-grid--2">
            <TextField
              id="postal"
              label="Postal code"
              required
              value={address.postalCode}
              onChange={(postalCode) => setAddress({ ...address, postalCode })}
            />
            <TextField
              id="country"
              label="Country"
              required
              value={address.country}
              onChange={(country) => setAddress({ ...address, country })}
            />
          </div>

          <fieldset className="payment-methods">
            <legend className="payment-methods__legend">Payment method</legend>
            <div className="payment-methods__grid" role="radiogroup">
              {PAYMENT_OPTIONS.map(({ value, label, hint, Icon }) => {
                const selected = paymentMethod === value
                return (
                  <label
                    key={value}
                    className={`payment-method${selected ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={selected}
                      onChange={() => setPaymentMethod(value)}
                    />
                    <span className="payment-method__icon" aria-hidden>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <span className="payment-method__copy">
                      <span className="payment-method__label">{label}</span>
                      <span className="payment-method__hint">{hint}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <TextAreaField
            id="note"
            label="Note"
            value={note}
            onChange={setNote}
            rows={3}
          />
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting
              ? paymentMethod === 'razorpay'
                ? 'Opening Razorpay…'
                : 'Placing order…'
              : submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}

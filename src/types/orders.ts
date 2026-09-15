export type OrderStatus =
  | 'new'
  | 'in_progress'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export type PaymentMethod = 'razorpay' | 'cod'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cod_pending'

export interface OrderAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderLineItem {
  productId: string
  name: string
  quantity: number
  price: number
  color?: string
  image: string
  slug?: string
}

export interface ShopOrder {
  id: string
  customerId: string
  customer: string
  email: string
  address: OrderAddress
  paymentMethod: PaymentMethod | string
  paymentStatus?: PaymentStatus | string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  items: OrderLineItem[]
  total: number
  status: OrderStatus | string
  createdAt: string
  note: string
}

export interface RazorpayCheckoutPayload {
  keyId: string
  orderId: string
  amount: number
  currency: string
  name: string
  description: string
  prefill: {
    name: string
    email: string
    contact?: string
  }
}

export interface CreateOrderResponse {
  order: ShopOrder
  razorpay?: RazorpayCheckoutPayload
}

export interface CustomerProfile {
  id: string
  email: string
  name: string
  phone: string
  address: OrderAddress
  createdAt?: string
  updatedAt?: string
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  razorpay: 'Razorpay',
  cod: 'Cash on delivery',
  card: 'Card',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  bank_transfer: 'Bank transfer',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Payment pending',
  paid: 'Paid',
  failed: 'Payment failed',
  cod_pending: 'Pay on delivery',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'new',
  'in_progress',
  'shipped',
  'completed',
]

export const EMPTY_ADDRESS: OrderAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
}

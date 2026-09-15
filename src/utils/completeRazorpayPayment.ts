import { apiRequest } from '../services/api'
import type { RazorpayCheckoutPayload, ShopOrder } from '../types/orders'
import { openRazorpayCheckout } from './razorpayCheckout'

interface RazorpayCreateOrderResponse {
  order_id: string
  amount: number
  currency: string
  key_id: string
}

interface VerifyPaymentResponse {
  success: boolean
  order: ShopOrder
}

export async function completeRazorpayPayment(input: {
  order: ShopOrder
  prefill?: RazorpayCheckoutPayload['prefill']
}): Promise<ShopOrder> {
  const amountPaise = Math.round(input.order.total * 100)
  const razorpayOrder = await apiRequest<RazorpayCreateOrderResponse>(
    '/api/create-order',
    {
      method: 'POST',
      auth: true,
      body: {
        amount: amountPaise,
        currency: 'INR',
        receipt: input.order.id,
      },
    },
  )

  const payment = await openRazorpayCheckout({
    keyId: razorpayOrder.key_id,
    orderId: razorpayOrder.order_id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    name: 'Yarn Studio',
    description: `Order ${input.order.id.slice(0, 10)}`,
    prefill: input.prefill ?? {
      name: input.order.customer,
      email: input.order.email,
    },
  })

  const verified = await apiRequest<VerifyPaymentResponse>(
    '/api/verify-payment',
    {
      method: 'POST',
      auth: true,
      body: {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      },
    },
  )

  return verified.order
}

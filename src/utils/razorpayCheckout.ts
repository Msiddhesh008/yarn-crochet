import type { RazorpayCheckoutPayload } from '../types/orders'

export interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayFailureResponse {
  error: {
    code?: string
    description?: string
    reason?: string
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  on: (
    event: 'payment.failed',
    handler: (response: RazorpayFailureResponse) => void,
  ) => void
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

function getPublicKeyId(fallback?: string): string {
  const fromEnv = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim()
  const key = fromEnv || fallback?.trim()
  if (!key) {
    throw new Error('Missing VITE_RAZORPAY_KEY_ID')
  }
  return key
}

function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-razorpay-checkout]',
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpayCheckout = 'true'
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout(
  session: RazorpayCheckoutPayload,
): Promise<RazorpaySuccessResponse> {
  const ready = await loadRazorpayScript()
  if (!ready || !window.Razorpay) {
    throw new Error('Could not load Razorpay checkout')
  }

  const key = getPublicKeyId(session.keyId)

  return new Promise((resolve, reject) => {
    let settled = false

    const finishOk = (response: RazorpaySuccessResponse) => {
      if (settled) return
      settled = true
      resolve(response)
    }

    const finishErr = (message: string) => {
      if (settled) return
      settled = true
      reject(new Error(message))
    }

    const rzp = new window.Razorpay!({
      key,
      amount: session.amount,
      currency: session.currency,
      name: session.name,
      description: session.description,
      order_id: session.orderId,
      prefill: session.prefill,
      theme: { color: '#6b4f3a' },
      handler: finishOk,
      modal: {
        // Only treat close as cancel — a failed card attempt can still be retried
        // in the same modal, so do not reject on payment.failed.
        ondismiss: () =>
          finishErr('Payment cancelled. You can retry from the order page.'),
      },
    })

    rzp.on('payment.failed', (response) => {
      console.warn(
        'Razorpay payment attempt failed (user can retry):',
        response.error?.description || response.error?.reason || response.error,
      )
    })

    rzp.open()
  })
}

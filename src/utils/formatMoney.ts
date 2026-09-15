/** Catalog and checkout amounts are INR (Razorpay paise = amount × 100). */
export const CURRENCY_SYMBOL = '₹'

export function formatMoney(amount: number, fractionDigits = 2): string {
  const value = Number.isFinite(amount) ? amount : 0
  return `${CURRENCY_SYMBOL}${value.toFixed(fractionDigits)}`
}

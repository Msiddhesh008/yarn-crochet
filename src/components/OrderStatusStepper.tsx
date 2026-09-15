import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
} from '../types/orders'

interface OrderStatusStepperProps {
  status: string
  compact?: boolean
}

export function OrderStatusBadge({ status }: { status: string }) {
  const label = ORDER_STATUS_LABELS[status] ?? status
  const modifier =
    status === 'cancelled'
      ? ' order-status-badge--cancelled'
      : status === 'completed'
        ? ' order-status-badge--completed'
        : ''
  return (
    <span className={`order-status-badge${modifier}`}>{label}</span>
  )
}

export function OrderStatusStepper({
  status,
  compact = false,
}: OrderStatusStepperProps) {
  if (status === 'cancelled') {
    return (
      <ol
        className={`order-stepper${compact ? ' order-stepper--compact' : ' order-stepper--large'}`}
        aria-label="Order status"
      >
        <li className="order-stepper__step is-cancelled">
          <span className="order-stepper__dot" aria-hidden />
          <span className="order-stepper__label">Cancelled</span>
        </li>
      </ol>
    )
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(
    status as (typeof ORDER_STATUS_STEPS)[number],
  )

  return (
    <ol
      className={`order-stepper${compact ? ' order-stepper--compact' : ' order-stepper--large'}`}
      aria-label="Order status"
    >
      {ORDER_STATUS_STEPS.map((step, index) => {
        let state = ''
        if (currentIndex >= 0 && index < currentIndex) state = 'is-done'
        else if (index === currentIndex) state = 'is-current'
        return (
          <li key={step} className={`order-stepper__step ${state}`.trim()}>
            <span className="order-stepper__dot" aria-hidden />
            <span className="order-stepper__label">
              {ORDER_STATUS_LABELS[step] ?? step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

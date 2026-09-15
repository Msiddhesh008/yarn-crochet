interface CartQtyStepperProps {
  quantity: number
  onChange: (quantity: number) => void
  label?: string
}

export function CartQtyStepper({
  quantity,
  onChange,
  label = 'Quantity',
}: CartQtyStepperProps) {
  return (
    <div className="cart-qty" role="group" aria-label={label}>
      <button
        type="button"
        className="cart-qty__btn"
        aria-label="Decrease quantity"
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <span className="cart-qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="cart-qty__btn"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  )
}

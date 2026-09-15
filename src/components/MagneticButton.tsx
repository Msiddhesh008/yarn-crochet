import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { magneticButton } from '../animations/utils'

interface MagneticButtonProps {
  to?: string
  href?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'unravel'
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}

export function MagneticButton({
  to,
  href,
  onClick,
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    return magneticButton(el, 0.28)
  }, [])

  const variantClass =
    variant === 'unravel' ? 'btn--primary btn--unravel' : `btn--${variant}`
  const classes = `btn ${variantClass} ${className}`.trim()

  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight className="btn__arrow" size={16} aria-hidden />
      <span className="btn__underline" aria-hidden />
    </>
  )

  if (to) {
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} to={to} className={classes}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {content}
    </button>
  )
}

import { useState } from 'react'
import { useStorefront } from '../context/StorefrontContext'
import type { ShopOrder } from '../types/orders'
import type { InvoiceBranding } from '../types/invoice'
import { downloadOrderInvoice } from '../utils/downloadOrderInvoice'

type InvoiceButtonVariant = 'ghost' | 'primary'

interface DownloadInvoiceButtonProps {
  order: ShopOrder
  variant?: InvoiceButtonVariant
  className?: string
}

function toBranding(brand: {
  name: string
  tagline: string
  loaderText: string
  logoSrc: string
}): InvoiceBranding {
  return {
    name: brand.name,
    tagline: brand.tagline,
    loaderText: brand.loaderText,
    logoAbsoluteUrl: brand.logoSrc,
  }
}

export function DownloadInvoiceButton({
  order,
  variant = 'ghost',
  className = '',
}: DownloadInvoiceButtonProps) {
  const { content } = useStorefront()
  const [busy, setBusy] = useState(false)

  if (order.status !== 'completed') {
    return null
  }

  const btnClass =
    variant === 'primary' ? 'btn btn--primary' : 'btn btn--ghost'

  const handleClick = () => {
    if (busy) return
    setBusy(true)
    downloadOrderInvoice(order, toBranding(content.brand))
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Could not create invoice PDF'
        window.alert(message)
      })
      .finally(() => setBusy(false))
  }

  return (
    <button
      type="button"
      className={`${btnClass} ${className}`.trim()}
      onClick={handleClick}
      disabled={busy}
    >
      {busy ? 'Preparing PDF…' : 'Download invoice'}
    </button>
  )
}

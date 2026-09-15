import { useStorefront } from '../context/StorefrontContext'

interface InstagramQrProps {
  variant?: 'footer' | 'menu'
  onNavigate?: () => void
}

export function InstagramQr({ variant = 'footer', onNavigate }: InstagramQrProps) {
  const { instagram } = useStorefront().content
  return (
    <a
      className={`instagram-qr instagram-qr--${variant}`}
      href={instagram.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Follow ${instagram.handle} on Instagram`}
      onClick={onNavigate}
    >
      <span className="instagram-qr__frame">
        <img
          src={instagram.qrImage}
          alt={`Instagram QR code for ${instagram.handle}`}
          width={280}
          height={280}
          loading="lazy"
        />
      </span>
      <span className="instagram-qr__handle">{instagram.handle}</span>
      <span className="instagram-qr__hint">{instagram.scanLabel}</span>
    </a>
  )
}

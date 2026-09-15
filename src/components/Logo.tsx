import { Link } from 'react-router-dom'
import { useStorefront } from '../context/StorefrontContext'

export function Logo() {
  const { brand } = useStorefront().content
  return (
    <Link to="/" className="logo" aria-label={`${brand.name} home`}>
      <img
        className="logo__image"
        src={brand.logoSrc}
        alt={brand.name}
        width={180}
        height={112}
      />
    </Link>
  )
}

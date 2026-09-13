import { Link } from 'react-router-dom'
import { brand } from '../data/content'
import logoSrc from '../assets/logo-transparent.png'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${brand.name} home`}>
      <img
        className="logo__image"
        src={logoSrc}
        alt={brand.name}
        width={180}
        height={112}
      />
    </Link>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Logo } from './Logo'
import { navLinks } from '../data/content'
import { useCart } from '../context/CartContext'
import { InstagramQr } from './InstagramQr'

interface NavbarProps {
  onSearchOpen: () => void
}

export function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setIsOpen } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="navbar__inner">
          <Logo />
          <nav className="navbar__links" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="navbar__actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Search"
              onClick={onSearchOpen}
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label={`Cart, ${count} items`}
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag size={18} />
              {count > 0 ? <span className="cart-count">{count}</span> : null}
            </button>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
      >
        <div
          className="mobile-menu__panel"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            <X size={20} />
          </button>
          <nav className="mobile-menu__links" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu__qr">
            <InstagramQr variant="menu" onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </>
  )
}

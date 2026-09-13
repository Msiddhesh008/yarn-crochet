import { Link } from 'react-router-dom'
import { footer, navLinks } from '../data/content'

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h2 className="footer__headline">{footer.headline}</h2>
        <svg className="footer__yarn" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0 22 C 120 8, 200 34, 320 18 S 520 6, 640 24 S 860 36, 980 14 S 1120 28, 1200 18" />
        </svg>
        <div className="footer__grid">
          <div className="footer__col">
            <h4>Visit</h4>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <a href="mailto:hello@yarn.studio">hello@yarn.studio</a>
            <p>Handmade to order</p>
          </div>
          <div className="footer__col">
            <h4>Social</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <InstagramIcon /> Instagram
              </span>
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>{footer.copyright}</p>
          <div className="footer__flower" aria-hidden />
        </div>
      </div>
    </footer>
  )
}

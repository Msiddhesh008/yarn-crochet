import { Link } from 'react-router-dom'
import { navLinks } from '../data/content'
import { useStorefront } from '../context/StorefrontContext'
import { InstagramQr } from './InstagramQr'

export function Footer() {
  const { footer } = useStorefront().content
  return (
    <footer className="footer">
      <div className="container">
        <h2 className="footer__headline">{footer.headline}</h2>
        <svg className="footer__yarn" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0 22 C 120 8, 200 34, 320 18 S 520 6, 640 24 S 860 36, 980 14 S 1120 28, 1200 18" />
        </svg>
        <div className="footer__grid">
          <div className="footer__col">
            <h4>{footer.visitLabel}</h4>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <h4>{footer.contactLabel}</h4>
            <a href={`mailto:${footer.email}`}>{footer.email}</a>
            <p>{footer.handmadeNote}</p>
          </div>
          <div className="footer__col footer__col--social">
            <h4>{footer.socialLabel}</h4>
            <InstagramQr variant="footer" />
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

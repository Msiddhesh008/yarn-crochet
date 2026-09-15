import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formatMoney } from '../utils/formatMoney'
import { useStorefront } from '../context/StorefrontContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { ShowcaseCardSkeleton } from './Skeleton'

gsap.registerPlugin(ScrollTrigger)

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const isDesktop = useIsDesktop()
  const { getFeaturedProducts, content, loading } = useStorefront()
  const { featuredShowcase } = content
  const items = getFeaturedProducts().slice(0, 4)

  useEffect(() => {
    if (loading || !pinRef.current || !trackRef.current || reduced || !isDesktop)
      return

    const ctx = gsap.context(() => {
      const track = trackRef.current
      const pin = pinRef.current
      if (!track || !pin) return

      const amount = Math.max(0, track.scrollWidth - window.innerWidth + 80)

      gsap.to(track, {
        x: -amount,
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${amount}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.showcase-card__media img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${amount}`,
              scrub: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced, isDesktop, loading, items.length])

  return (
    <section className="section showcase" ref={sectionRef} id="showcase">
      <div className="showcase__pin" ref={pinRef}>
        <div className="container showcase__intro">
          <p className="eyebrow">{featuredShowcase.eyebrow}</p>
          <h2 className="section-heading">
            {featuredShowcase.heading}
            <span>{featuredShowcase.subheading}</span>
          </h2>
        </div>
        <div className="showcase__track" ref={trackRef} aria-busy={loading || undefined}>
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <ShowcaseCardSkeleton key={i} />
              ))
            : items.map((product, index) => (
                <article key={product.id} className="showcase-card">
                  <div className="showcase-card__media">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="showcase-card__body">
                    <p className="showcase-card__cat">
                      Product {String(index + 1).padStart(2, '0')} ·{' '}
                      {product.category}
                    </p>
                    <h3 className="showcase-card__name">{product.name}</h3>
                    <p className="showcase-card__desc">{product.description}</p>
                    <div className="showcase-card__footer">
                      <span>{formatMoney(product.price)}</span>
                      <Link to={`/product/${product.slug}`}>View piece →</Link>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  )
}

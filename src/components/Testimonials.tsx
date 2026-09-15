import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStorefront } from '../context/StorefrontContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { testimonials } = useStorefront().content

  useEffect(() => {
    if (!ref.current || reduced) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.testimonial').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          },
        )
      })
    }, ref)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="section testimonials" ref={ref} id="testimonials">
      <div className="container">
        <p className="eyebrow">{testimonials.eyebrow}</p>
        <div className="testimonial-list">
          {testimonials.items.map((item) => (
            <article key={item.id} className="testimonial">
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <cite>{item.author}</cite>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

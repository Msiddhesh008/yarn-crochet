import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process as processCopy } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || reduced) {
      ref.current
        ?.querySelectorAll('.process-step')
        .forEach((el) => el.classList.add('is-active'))
      return
    }

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.process-step')

      gsap.to(steps, {
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1,
          onUpdate: (self) => {
            const index = Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length),
            )
            steps.forEach((step, i) => {
              step.classList.toggle('is-active', i <= index)
            })
          },
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="section" ref={ref} id="process">
      <div className="container">
        <p className="eyebrow" data-reveal>
          The process
        </p>
        <h2 className="section-heading" data-reveal>
          {processCopy.heading}
        </h2>
        <div className="process-track">
          {processCopy.steps.map((label) => (
            <article key={label} className="process-step">
              <div className="process-step__icon" aria-hidden />
              <p className="process-step__label">{label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

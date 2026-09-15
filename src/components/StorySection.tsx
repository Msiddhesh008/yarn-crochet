import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStorefront } from '../context/StorefrontContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const { stitchStory } = useStorefront().content

  useEffect(() => {
    if (!sectionRef.current) return

    if (reduced) {
      sectionRef.current
        .querySelectorAll('.stitch-step')
        .forEach((el) => el.classList.add('is-active'))
      if (pathRef.current) {
        gsap.set(pathRef.current, { strokeDashoffset: 0 })
      }
      return
    }

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.stitch-step')
      const path = pathRef.current

      if (path) {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=70%',
            scrub: 1,
            pin: '.stitch-story__pin',
          },
        })
      }

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `top+=${i * 12}% top`,
          end: `top+=${(i + 1) * 12}% top`,
          onEnter: () => step.classList.add('is-active'),
          onEnterBack: () => step.classList.add('is-active'),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="section stitch-story" ref={sectionRef} id="story">
      <div className="stitch-story__pin">
        <div className="container">
          <p className="eyebrow">{stitchStory.eyebrow}</p>
          <h2 className="section-heading">{stitchStory.heading}</h2>
          <svg
            className="stitch-story__path"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={pathRef}
              d="M40 220 C 180 80, 280 320, 420 200 S 620 60, 760 220 S 980 340, 1160 160"
            />
          </svg>
          <div className="stitch-steps">
            {stitchStory.steps.map((step) => (
              <article key={step.id} className="stitch-step">
                <p className="stitch-step__id">{step.id}</p>
                <h3 className="stitch-step__title">{step.title}</h3>
                <p className="stitch-step__desc">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

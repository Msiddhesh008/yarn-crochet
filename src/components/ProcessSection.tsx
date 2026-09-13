import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process as processCopy } from '../data/content'
import { subjects } from '../data/subjects'
import type { ProcessVisual } from '../types'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

function ProcessVisualMark({
  visual,
  image,
}: {
  visual: ProcessVisual
  image?: string
}) {
  if (image) {
    return (
      <img
        className={`process-step__visual${visual === 'finished' ? ' process-step__visual--product' : ''}`}
        src={image}
        alt=""
        loading="lazy"
      />
    )
  }

  if (visual === 'yarn') {
    return (
      <img
        className="process-step__visual"
        src={subjects.yarnBall}
        alt=""
        loading="lazy"
      />
    )
  }

  if (visual === 'flower') {
    return (
      <img
        className="process-step__visual"
        src={subjects.flowerRose}
        alt=""
        loading="lazy"
      />
    )
  }

  if (visual === 'hook') {
    return (
      <svg
        className="process-step__visual process-step__visual--svg"
        viewBox="0 0 80 80"
        aria-hidden
      >
        <path
          d="M18 62 C 22 48, 28 36, 38 28 C 46 22, 54 18, 58 14 C 60 12, 62 10, 64 12 C 66 14, 64 18, 60 22 C 54 28, 46 34, 40 44 C 34 54, 30 64, 28 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56 16 C 60 12, 66 14, 64 20 C 62 24, 56 22, 56 16 Z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
    )
  }

  return (
    <svg
      className="process-step__visual process-step__visual--svg"
      viewBox="0 0 80 80"
      aria-hidden
    >
      <circle
        cx="28"
        cy="40"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
      />
      <circle
        cx="44"
        cy="40"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
      />
      <circle
        cx="52"
        cy="28"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        opacity="0.7"
      />
    </svg>
  )
}

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
          {processCopy.eyebrow}
        </p>
        <h2 className="section-heading" data-reveal>
          {processCopy.heading}
        </h2>
        <div className="process-track">
          {processCopy.steps.map((step) => (
            <article key={step.label} className="process-step">
              <ProcessVisualMark visual={step.visual} image={step.image} />
              <p className="process-step__label">{step.label}</p>
              <p className="process-step__caption">{step.caption}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

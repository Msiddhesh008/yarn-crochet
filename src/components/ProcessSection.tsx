import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStorefront } from '../context/StorefrontContext'
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
  const processCopy = useStorefront().content.process

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const steps = Array.from(
      root.querySelectorAll<HTMLElement>('.process-step'),
    )

    const setActiveThrough = (index: number) => {
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i <= index)
      })
    }

    if (reduced) {
      setActiveThrough(steps.length - 1)
      return
    }

    const ctx = gsap.context(() => {
      // Class + CSS transitions only — avoid GSAP opacity fighting `.is-active`.
      gsap.set(steps, { clearProps: 'opacity,transform' })

      const isCompact = () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 959px)').matches

      ScrollTrigger.create({
        trigger: root,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
        onUpdate: (self) => {
          if (steps.length === 0) return
          // Mobile: swipe the track — unlock all once the section is in view.
          if (isCompact()) {
            if (self.progress > 0) setActiveThrough(steps.length - 1)
            return
          }
          if (self.progress >= 0.9) {
            setActiveThrough(steps.length - 1)
            return
          }
          const index = Math.min(
            steps.length - 1,
            Math.floor(self.progress * steps.length),
          )
          setActiveThrough(index)
        },
        onEnter: () => {
          if (isCompact()) setActiveThrough(steps.length - 1)
          else setActiveThrough(0)
        },
        onLeave: () => setActiveThrough(steps.length - 1),
        onEnterBack: () => setActiveThrough(steps.length - 1),
      })
    }, root)

    return () => ctx.revert()
  }, [reduced, processCopy.steps])

  return (
    <section className="section" ref={ref} id="process">
      <div className="container">
        <p className="eyebrow" data-reveal>
          {processCopy.eyebrow}
        </p>
        <h2 className="section-heading" data-reveal>
          {processCopy.heading}
        </h2>
        <div
          className="process-track"
          data-lenis-prevent
          data-lenis-prevent-touch
        >
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

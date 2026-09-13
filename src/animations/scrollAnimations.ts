import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollYarn(path: SVGPathElement, reduced: boolean) {
  if (reduced) {
    gsap.set(path, { strokeDashoffset: 0 })
    return
  }

  const length = path.getTotalLength()
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  })

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.yarn-spine',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  })
}

export function initSectionReveals(reduced: boolean) {
  if (reduced) return

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    )
  })
}

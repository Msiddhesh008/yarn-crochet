import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const ease = {
  soft: 'power2.out',
  luxury: 'power3.out',
  spring: 'power2.out',
}

export function revealUp(
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {},
) {
  return gsap.fromTo(
    elements,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: ease.luxury,
      stagger: 0.08,
      ...options,
    },
  )
}

export function revealFade(
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {},
) {
  return gsap.fromTo(
    elements,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      ease: ease.soft,
      ...options,
    },
  )
}

export function imageReveal(
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {},
) {
  return gsap.fromTo(
    elements,
    { scale: 1.08, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.1,
      ease: ease.luxury,
      ...options,
    },
  )
}

export function splitTextReveal(
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {},
) {
  return gsap.fromTo(
    elements,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.95,
      ease: ease.luxury,
      stagger: 0.12,
      ...options,
    },
  )
}

export function parallax(
  element: gsap.TweenTarget,
  amount = 40,
  trigger?: Element | string,
) {
  return gsap.to(element, {
    y: amount,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || (element as Element),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export function magneticButton(
  button: HTMLElement,
  strength = 0.35,
): () => void {
  const onMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: ease.soft,
    })
  }

  const onLeave = () => {
    gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: ease.luxury })
  }

  button.addEventListener('mousemove', onMove)
  button.addEventListener('mouseleave', onLeave)

  return () => {
    button.removeEventListener('mousemove', onMove)
    button.removeEventListener('mouseleave', onLeave)
  }
}

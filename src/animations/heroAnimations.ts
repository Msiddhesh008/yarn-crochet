import gsap from 'gsap'

export function createHeroTimeline(_scope: HTMLElement, reduced: boolean) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (reduced) {
    gsap.set(
      [
        '.hero__bg',
        '.hero__yarn',
        '.hero__line',
        '.hero__media',
        '.hero__floater',
        '.hero__cta',
        '.hero__support',
      ],
      { opacity: 1, clearProps: 'transform' },
    )
    return tl
  }

  tl.fromTo('.hero__bg', { opacity: 0 }, { opacity: 1, duration: 0.6 })
    .fromTo(
      '.hero__yarn path',
      { strokeDashoffset: 1200 },
      { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
      0.2,
    )
    .fromTo(
      '.hero__line',
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
      0.45,
    )
    .fromTo(
      '.hero__support',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.9,
    )
    .fromTo(
      '.hero__media',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 },
      0.55,
    )
    .fromTo(
      '.hero__floater',
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 0.8, stagger: 0.1 },
      0.85,
    )
    .fromTo(
      '.hero__cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
      1.15,
    )

  return tl
}

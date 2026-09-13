import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function scrollToTop(immediate = true) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate })
  }
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      lenisInstance = null
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [enabled])
}

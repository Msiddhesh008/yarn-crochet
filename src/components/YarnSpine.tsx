import { useEffect, useRef } from 'react'
import { initScrollYarn } from '../animations/scrollAnimations'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function YarnSpine() {
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!pathRef.current) return
    initScrollYarn(pathRef.current, reduced)
  }, [reduced])

  return (
    <svg className="yarn-spine" viewBox="0 0 100 4000" preserveAspectRatio="none" aria-hidden>
      <path
        ref={pathRef}
        d="M52 0 C 68 120, 28 220, 48 340 S 78 520, 40 680 S 70 900, 52 1100 S 30 1300, 60 1500 S 40 1750, 55 1950 S 75 2200, 45 2450 S 30 2700, 58 2950 S 70 3200, 48 3450 S 35 3700, 55 4000"
      />
    </svg>
  )
}

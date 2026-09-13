import { useEffect, useRef } from 'react'
import { createYarnTrail } from '../animations/cursorAnimation'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function YarnTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDesktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!isDesktop || reduced || !canvasRef.current) return
    return createYarnTrail(canvasRef.current)
  }, [isDesktop, reduced])

  if (!isDesktop || reduced) return null

  return <canvas ref={canvasRef} className="yarn-trail" aria-hidden />
}

import gsap from 'gsap'
import { hexToRgba, palette, readCssColor } from '../data/palette'

interface TrailPoint {
  x: number
  y: number
}

export function createYarnTrail(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined

  const points: TrailPoint[] = []
  const maxPoints = 18
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let raf = 0
  let hoveringInteractive = false

  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
  }

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
    const target = e.target as HTMLElement | null
    hoveringInteractive = Boolean(
      target?.closest('a, button, .product-card, [data-cursor="loop"]'),
    )
  }

  const draw = () => {
    points.push({ x: mouseX, y: mouseY })
    if (points.length > maxPoints) points.shift()

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const terracotta = readCssColor('--color-terracotta', palette.terracotta)
    const warmBrown = readCssColor('--color-warm-brown', palette.warmBrown)

    if (points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1]
        const curr = points[i]
        const cx = (prev.x + curr.x) / 2
        const cy = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, cx, cy)
      }
      ctx.strokeStyle = hoveringInteractive
        ? hexToRgba(terracotta, 0.55)
        : hexToRgba(warmBrown, 0.35)
      ctx.lineWidth = hoveringInteractive ? 2.2 : 1.4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    const last = points[points.length - 1]
    if (last && hoveringInteractive) {
      ctx.beginPath()
      ctx.arc(last.x, last.y, 10, 0, Math.PI * 2)
      ctx.strokeStyle = hexToRgba(terracotta, 0.7)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    raf = requestAnimationFrame(draw)
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMove)
  raf = requestAnimationFrame(draw)

  gsap.set(canvas, { opacity: 1 })

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMove)
  }
}

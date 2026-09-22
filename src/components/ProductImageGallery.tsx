import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'

interface ProductImageGalleryProps {
  images: string[]
  alt: string
}

const ZOOM = 2.25
const LENS = 140

/**
 * Product PDP gallery: left thumbnails + desktop hover lens/zoom.
 */
export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const list = images.length ? images : []
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [lens, setLens] = useState({ x: 0, y: 0 })
  const [canZoom, setCanZoom] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const src = list[Math.min(active, Math.max(list.length - 1, 0))] ?? ''

  useEffect(() => {
    setActive(0)
  }, [list.join('|')])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCanZoom(mq.matches && !reduced.matches)
    update()
    mq.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!canZoom || !stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const half = LENS / 2
      const x = Math.min(
        Math.max(e.clientX - rect.left - half, 0),
        rect.width - LENS,
      )
      const y = Math.min(
        Math.max(e.clientY - rect.top - half, 0),
        rect.height - LENS,
      )
      setLens({ x, y })
      setHovering(true)
    },
    [canZoom],
  )

  if (!src) return null

  const stageW = stageRef.current?.clientWidth ?? 1
  const stageH = stageRef.current?.clientHeight ?? 1
  const bgX = (lens.x / Math.max(stageW - LENS, 1)) * 100
  const bgY = (lens.y / Math.max(stageH - LENS, 1)) * 100

  const thumbs =
    list.length > 1 ? (
      <div className="product-gallery__thumbs" role="list">
        {list.map((thumb, index) => (
          <button
            key={`${thumb}-${index}`}
            type="button"
            role="listitem"
            className={`product-gallery__thumb${index === active ? ' is-active' : ''}`}
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={index === active ? 'true' : undefined}
          >
            <img src={thumb} alt="" />
          </button>
        ))}
      </div>
    ) : null

  return (
    <div
      className={`product-gallery${hovering && canZoom ? ' is-zooming' : ''}`}
    >
      <div className="product-gallery__layout">
        {thumbs}
        <div
          ref={stageRef}
          className={`product-gallery__stage${hovering && canZoom ? ' is-zooming' : ''}`}
          onMouseMove={onMove}
          onMouseEnter={() => canZoom && setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img src={src} alt={alt} />
          {canZoom && hovering ? (
            <div
              className="product-gallery__lens"
              style={{
                width: LENS,
                height: LENS,
                transform: `translate(${lens.x}px, ${lens.y}px)`,
              }}
              aria-hidden
            />
          ) : null}
        </div>
      </div>

      <div
        className="product-gallery__zoom"
        style={
          canZoom && hovering
            ? {
                backgroundImage: `url(${src})`,
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${bgX}% ${bgY}%`,
              }
            : undefined
        }
        aria-hidden
      />
    </div>
  )
}

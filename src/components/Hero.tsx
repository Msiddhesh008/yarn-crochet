import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useStorefront } from '../context/StorefrontContext'
import { MagneticButton } from './MagneticButton'
import { createHeroTimeline } from '../animations/heroAnimations'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { keyBlackBackground } from '../utils/keyBlackBackground'
import bowRose from '../assets/subjects/bow-rose.png'

interface HeroProps {
  ready: boolean
}

export function Hero({ ready }: HeroProps) {
  const { content } = useStorefront()
  const { hero } = content
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [heroSrc, setHeroSrc] = useState(hero.image || bowRose)

  useEffect(() => {
    let cancelled = false
    const primary = hero.image?.trim() || bowRose
    setHeroSrc(primary)

    const applyKeyed = async (src: string, allowFallback: boolean) => {
      try {
        const keyed = await keyBlackBackground(src)
        if (!cancelled) setHeroSrc(keyed)
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          if (allowFallback && src !== bowRose) {
            setHeroSrc(bowRose)
            await applyKeyed(bowRose, false)
          } else {
            setHeroSrc(src)
          }
        }
      }
    }

    void applyKeyed(primary, true)

    return () => {
      cancelled = true
    }
  }, [hero.image])

  useEffect(() => {
    if (!ready || !ref.current) return
    const ctxScope = ref.current
    const tl = createHeroTimeline(ctxScope, reduced)

    const floaters = ctxScope.querySelectorAll('.hero__floater')
    if (!reduced && floaters.length) {
      floaters.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -12 : 10,
          duration: 3 + i,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })
    }

    return () => {
      tl.kill()
      gsap.killTweensOf(floaters)
    }
  }, [ready, reduced])

  return (
    <section className="hero" ref={ref} aria-label="Hero">
      <div className="hero__bg" />
      <svg className="hero__yarn" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden>
        <path d="M40 80 C 180 120, 220 260, 360 240 S 560 80, 720 160 S 980 320, 1160 120" />
      </svg>
      <div className="hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="hero__line-wrap">
              <span className="hero__line">{hero.line1}</span>
            </span>
            <span className="hero__line-wrap">
              <span className="hero__line hero__line--accent">{hero.line2}</span>
            </span>
          </h1>
          <p className="hero__support">{hero.supporting}</p>
          <div className="hero__actions">
            <MagneticButton to="/shop" className="hero__cta">
              {hero.primaryCta}
            </MagneticButton>
            <MagneticButton to="/about" variant="ghost" className="hero__cta">
              {hero.secondaryCta}
            </MagneticButton>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__floater hero__floater--1" />
          <div className="hero__floater hero__floater--2" />
          <div className="hero__floater hero__floater--3" />
          <Link to="/shop" className="hero__media" data-cursor="loop">
            <img
              src={heroSrc}
              alt="Handmade crochet heart"
              width={660}
              height={775}
              onError={() => {
                if (heroSrc !== bowRose) setHeroSrc(bowRose)
              }}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

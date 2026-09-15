import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
  /** Accessible label for screen readers when used as a standalone placeholder */
  label?: string
}

/** Soft shimmer block — Yarn cream / terracotta pulse. */
export function Skeleton({ className = '', style, label }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'status' : undefined}
    />
  )
}

export function TextBlockSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="skeleton-text-block" aria-hidden>
      <Skeleton className="skeleton--eyebrow" />
      <Skeleton className="skeleton--heading" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`skeleton--line${i === lines - 1 ? ' skeleton--line-short' : ''}`}
        />
      ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-product-card" aria-hidden>
      <Skeleton className="skeleton-product-card__media" />
      <div className="skeleton-product-card__body">
        <Skeleton className="skeleton--eyebrow" />
        <Skeleton className="skeleton--title" />
        <div className="skeleton-product-card__row">
          <Skeleton className="skeleton--price" />
          <Skeleton className="skeleton--link" />
        </div>
      </div>
    </div>
  )
}

export function ShowcaseCardSkeleton() {
  return (
    <article className="showcase-card skeleton-showcase-card" aria-hidden>
      <Skeleton className="skeleton-showcase-card__media" />
      <div className="skeleton-showcase-card__body">
        <Skeleton className="skeleton--eyebrow" />
        <Skeleton className="skeleton--heading" />
        <Skeleton className="skeleton--line" />
        <Skeleton className="skeleton--line skeleton--line-short" />
        <div className="skeleton-showcase-card__footer">
          <Skeleton className="skeleton--price" />
          <Skeleton className="skeleton--link" />
        </div>
      </div>
    </article>
  )
}

export function OrderCardSkeleton() {
  return (
    <article className="account-order-card skeleton-order-card" aria-hidden>
      <div className="skeleton-order-card__inner">
        <div className="skeleton-order-card__top">
          <div>
            <Skeleton className="skeleton--title" />
            <Skeleton className="skeleton--line skeleton--line-short" />
          </div>
          <Skeleton className="skeleton--badge" />
        </div>
        <div className="skeleton-order-card__thumbs">
          <Skeleton className="skeleton-order-card__thumb" />
          <Skeleton className="skeleton-order-card__thumb" />
        </div>
        <div className="skeleton-order-card__footer">
          <Skeleton className="skeleton--line skeleton--line-short" />
          <Skeleton className="skeleton--price" />
        </div>
      </div>
    </article>
  )
}

export function OrderDetailSkeleton() {
  return (
    <div className="page" style={{ paddingTop: 0 }} aria-busy="true">
      <div className="container page-hero" style={{ maxWidth: 640 }}>
        <Skeleton className="skeleton--eyebrow" />
        <Skeleton className="skeleton--heading" />
        <Skeleton className="skeleton--line skeleton--line-short" />
        <Skeleton className="skeleton--badge" style={{ marginTop: '0.75rem' }} />
      </div>
      <div className="container" style={{ paddingBottom: '4rem', maxWidth: 640 }}>
        <Skeleton className="skeleton-order-detail__stepper" />
        <Skeleton className="skeleton--heading" style={{ marginTop: '1.5rem' }} />
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="skeleton-order-detail__line">
            <Skeleton className="skeleton-order-detail__thumb" />
            <div className="skeleton-order-detail__line-text">
              <Skeleton className="skeleton--title" />
              <Skeleton className="skeleton--line skeleton--line-short" />
            </div>
            <Skeleton className="skeleton--price" />
          </div>
        ))}
        <div className="skeleton-order-detail__split">
          <div>
            <Skeleton className="skeleton--heading" />
            <Skeleton className="skeleton--line" />
            <Skeleton className="skeleton--line" />
            <Skeleton className="skeleton--line skeleton--line-short" />
          </div>
          <Skeleton className="skeleton-order-detail__summary" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="page" aria-busy="true">
      <div className="container product-detail">
        <Skeleton className="skeleton-pdp__media" />
        <div className="skeleton-pdp__info">
          <Skeleton className="skeleton--eyebrow" />
          <Skeleton className="skeleton--heading" />
          <Skeleton className="skeleton--price" />
          <Skeleton className="skeleton--line" />
          <Skeleton className="skeleton--line" />
          <Skeleton className="skeleton--line skeleton--line-short" />
          <div className="skeleton-pdp__swatches">
            <Skeleton className="skeleton-pdp__swatch" />
            <Skeleton className="skeleton-pdp__swatch" />
            <Skeleton className="skeleton-pdp__swatch" />
          </div>
          <Skeleton className="skeleton-pdp__cta" />
        </div>
      </div>
    </div>
  )
}

export function ProfileFormSkeleton() {
  return (
    <div className="form-grid skeleton-profile-form" aria-busy="true" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton-profile-form__field">
          <Skeleton className="skeleton--eyebrow" />
          <Skeleton className="skeleton-profile-form__input" />
        </div>
      ))}
      <Skeleton className="skeleton-pdp__cta" />
    </div>
  )
}

export function AuthGateSkeleton() {
  return (
    <div className="page" aria-busy="true" aria-label="Checking session">
      <div className="container" style={{ paddingTop: '4rem', maxWidth: 640 }}>
        <TextBlockSkeleton lines={1} />
        <div style={{ marginTop: '2rem' }}>
          <OrderCardSkeleton />
        </div>
      </div>
    </div>
  )
}

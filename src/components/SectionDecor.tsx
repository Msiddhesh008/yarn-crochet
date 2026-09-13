import { decorAssets, type DecorPlacement } from '../data/decor'

interface SectionDecorProps {
  items: DecorPlacement[]
  className?: string
}

export function SectionDecor({ items, className = '' }: SectionDecorProps) {
  return (
    <div className={`section-decor ${className}`.trim()} aria-hidden>
      {items.map((item) => (
        <img
          key={`${item.asset}-${item.className}`}
          className={`section-decor__item ${item.className}`}
          src={decorAssets[item.asset]}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  )
}

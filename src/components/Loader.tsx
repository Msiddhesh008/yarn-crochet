import { brand } from '../data/content'

interface LoaderProps {
  done: boolean
}

export function Loader({ done }: LoaderProps) {
  return (
    <div className={`loader${done ? ' is-done' : ''}`} aria-hidden={done}>
      <div className="loader__inner">
        <img
          className="loader__logo"
          src={brand.logoSrc}
          alt=""
          width={220}
          height={138}
        />
        <p className="loader__text">{brand.loaderText}</p>
      </div>
    </div>
  )
}

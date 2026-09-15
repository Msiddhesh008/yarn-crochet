import { useStorefront } from '../context/StorefrontContext'

interface LoaderProps {
  done: boolean
}

export function Loader({ done }: LoaderProps) {
  const { brand } = useStorefront().content
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

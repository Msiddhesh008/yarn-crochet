import { useStorefront } from '../context/StorefrontContext'

export function Gallery() {
  const { gallery } = useStorefront().content
  return (
    <section className="section" id="gallery">
      <div className="container">
        <p className="eyebrow" data-reveal>
          {gallery.eyebrow}
        </p>
        <h2 className="section-heading" data-reveal>
          {gallery.heading}
          <span>{gallery.subheading}</span>
        </h2>
        <div className="gallery-grid">
          {gallery.items.map((item) => (
            <article key={item.id} className="gallery-item" data-cursor="loop">
              <img src={item.image} alt={item.caption} loading="lazy" />
              <div className="gallery-item__overlay">
                <p className="gallery-item__caption">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

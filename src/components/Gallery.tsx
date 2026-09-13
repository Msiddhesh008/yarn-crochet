import { galleryItems } from '../data/products'

export function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <p className="eyebrow" data-reveal>
          Studio notes
        </p>
        <h2 className="section-heading" data-reveal>
          Soft moments.
          <span>Quiet stitches.</span>
        </h2>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
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

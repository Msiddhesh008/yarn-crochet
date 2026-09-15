import { useStorefront } from '../context/StorefrontContext'

export function MakerSection() {
  const { maker } = useStorefront().content
  return (
    <section className="section maker" id="maker">
      <div className="container split maker__layout">
        <div className="maker__visual" data-reveal>
          <div className="maker__frame">
            <div className="maker__glow" aria-hidden />
            <svg className="maker__yarn-ring" viewBox="0 0 400 500" aria-hidden>
              <path
                className="maker__yarn-ring-path"
                d="M200 48
                   C 310 60, 372 140, 378 250
                   C 384 360, 320 460, 200 482
                   C 80 460, 16 360, 22 250
                   C 28 140, 90 60, 200 48 Z"
              />
            </svg>
            <figure className="maker__portrait">
              <img
                src={maker.image}
                alt="The young maker behind Yarn"
                width={576}
                height={1024}
                loading="lazy"
              />
            </figure>
          </div>
          <span className="maker__floater maker__floater--flower" aria-hidden />
          <span className="maker__floater maker__floater--loop" aria-hidden />
        </div>

        <div className="maker__story" data-reveal>
          <p className="eyebrow">{maker.eyebrow}</p>
          <h2 className="section-heading">{maker.heading}</h2>
          <div className="maker__lines">
            {maker.story.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="maker__signature">{maker.signature}</p>
          <p className="maker__note">{maker.note}</p>
        </div>
      </div>
    </section>
  )
}

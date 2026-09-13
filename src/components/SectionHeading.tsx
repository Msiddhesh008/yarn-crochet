interface SectionHeadingProps {
  eyebrow?: string
  title: string
  accent?: string
  intro?: string
}

export function SectionHeading({ eyebrow, title, accent, intro }: SectionHeadingProps) {
  return (
    <div data-reveal>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading">
        {title}
        {accent ? <span>{accent}</span> : null}
      </h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </div>
  )
}

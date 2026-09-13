import { MakerSection } from '../components/MakerSection'
import { StorySection } from '../components/StorySection'
import { ProcessSection } from '../components/ProcessSection'
import { MagneticButton } from '../components/MagneticButton'
import { aboutPage } from '../data/content'

export function AboutPage() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">{aboutPage.eyebrow}</p>
        <h1 className="section-heading">
          {aboutPage.heading}
          <span>{aboutPage.subheading}</span>
        </h1>
        <p className="section-intro">{aboutPage.intro}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <MagneticButton to="/custom">{aboutPage.cta}</MagneticButton>
        </div>
      </div>
      <MakerSection />
      <StorySection />
      <ProcessSection />
    </div>
  )
}

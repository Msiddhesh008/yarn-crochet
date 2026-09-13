import { MakerSection } from '../components/MakerSection'
import { StorySection } from '../components/StorySection'
import { ProcessSection } from '../components/ProcessSection'
import { MagneticButton } from '../components/MagneticButton'

export function AboutPage() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">Our story</p>
        <h1 className="section-heading">
          A little world
          <span>made of yarn.</span>
        </h1>
        <p className="section-intro">
          Yarn began with curiosity, soft fibre, and a ten-year-old maker who found joy
          one loop at a time.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <MagneticButton to="/custom">Start a custom piece</MagneticButton>
        </div>
      </div>
      <MakerSection />
      <StorySection />
      <ProcessSection />
    </div>
  )
}

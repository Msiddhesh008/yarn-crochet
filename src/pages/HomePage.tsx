import { useOutletContext } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { YarnSpine } from '../components/YarnSpine'
import { ProductGrid } from '../components/ProductGrid'
import { StorySection } from '../components/StorySection'
import { MakerSection } from '../components/MakerSection'
import { ProcessSection } from '../components/ProcessSection'
import { ProductShowcase } from '../components/ProductShowcase'
import { CustomOrder } from '../components/CustomOrder'
import { Gallery } from '../components/Gallery'
import { Testimonials } from '../components/Testimonials'
import { SectionDecor } from '../components/SectionDecor'

interface OutletContext {
  ready: boolean
}

export function HomePage() {
  const { ready } = useOutletContext<OutletContext>()

  return (
    <div className="home" style={{ position: 'relative' }}>
      <YarnSpine />
      <div className="home__stage home__stage--hero">
        <SectionDecor
          items={[
            { asset: 'flowerCream', className: 'decor--tr' },
            { asset: 'yarnBall', className: 'decor--bl' },
          ]}
        />
        <Hero ready={ready} />
      </div>
      <div className="home__stage">
        <SectionDecor
          items={[
            { asset: 'butterfly', className: 'decor--tr decor--sm' },
            { asset: 'leaf', className: 'decor--bl decor--tilt' },
          ]}
        />
        <ProductGrid limit={6} asymmetric />
      </div>
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'heart', className: 'decor--mr' }]} />
        <StorySection />
      </div>
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'bowCream', className: 'decor--ml decor--tilt-neg' }]} />
        <MakerSection />
      </div>
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'twineBall', className: 'decor--tr' }]} />
        <ProcessSection />
      </div>
      <ProductShowcase />
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'flowerRose', className: 'decor--ml' }]} />
        <CustomOrder />
      </div>
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'bowRose', className: 'decor--tr decor--sm' }]} />
        <Gallery />
      </div>
      <div className="home__stage">
        <SectionDecor items={[{ asset: 'leaf', className: 'decor--bl decor--tilt-neg' }]} />
        <Testimonials />
      </div>
    </div>
  )
}

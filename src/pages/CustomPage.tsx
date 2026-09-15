import { CustomOrder } from '../components/CustomOrder'
import { useStorefront } from '../context/StorefrontContext'

export function CustomPage() {
  const { customPage } = useStorefront().content
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="container page-hero">
        <p className="eyebrow">{customPage.eyebrow}</p>
        <h1 className="section-heading">
          {customPage.heading}
          <span>{customPage.subheading}</span>
        </h1>
        <p className="section-intro">{customPage.intro}</p>
      </div>
      <CustomOrder />
    </div>
  )
}
